import { Injectable, computed, signal } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  SocialLogin,
  SocialLoginError,
} from '@capgo/capacitor-social-login';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { AuthProvider, AuthState } from './auth.types';

type NativeIdentityToken = {
  token: string;
  nonce?: string;
};

/**
 * Owns client-side Supabase authentication for the Ionic app.
 *
 * Decision: Supabase Auth remains the identity provider while this service
 * coordinates provider allow-listing, native provider token exchange, session
 * state, and backend token handoff.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase: SupabaseClient;
  private readonly nativeSocialReady: Promise<void>;
  private readonly state = signal<AuthState>({
    session: null,
    user: null,
    loading: true,
    error: null,
  });

  readonly session = computed(() => this.state().session);
  readonly user = computed(() => this.state().user);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly isAuthenticated = computed(() => Boolean(this.state().session));
  readonly allowedProviders = environment.allowedAuthProviders;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabasePublishableKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
          flowType: 'pkce',
        },
      },
    );

    void this.restoreSession();
    this.nativeSocialReady = this.initializeNativeSocialLogin();

    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.state.update((current) => ({
        ...current,
        session,
        user: session?.user ?? null,
        loading: false,
        error: null,
      }));
    });
  }

  /**
   * Starts OAuth login with Google or Apple.
   *
   * Decision: native builds use provider-native UI to obtain an ID token and
   * exchange it with Supabase. Browser OAuth stays as the web fallback only.
   */
  async signInWithProvider(provider: AuthProvider): Promise<void> {
    if (!this.isAllowedProvider(provider)) {
      this.setError('Proveedor de acceso no permitido.');
      return;
    }

    this.state.update((current) => ({ ...current, loading: true, error: null }));

    if (Capacitor.isNativePlatform()) {
      await this.signInWithNativeProvider(provider);
      return;
    }

    await this.signInWithSupabaseOAuth(provider);
  }

  /**
   * Starts the browser OAuth flow for web builds.
   *
   * Decision: web still relies on Supabase OAuth because Google and Apple web
   * consent screens are browser-based by design.
   */
  private async signInWithSupabaseOAuth(provider: AuthProvider): Promise<void> {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: environment.authRedirectUrl,
      },
    });

    if (error) {
      this.setError(error.message);
      return;
    }

    this.state.update((current) => ({ ...current, loading: false }));
  }

  /**
   * Completes native Google or Apple sign-in and creates the Supabase session.
   *
   * Decision: Supabase remains the identity authority; native SDKs only collect
   * provider ID tokens, then `signInWithIdToken` issues the Supabase session.
   */
  private async signInWithNativeProvider(
    provider: AuthProvider,
  ): Promise<void> {
    try {
      await this.nativeSocialReady;
      const identity = await this.getNativeIdToken(provider);
      const credentials = {
        provider,
        token: identity.token,
        ...(identity.nonce ? { nonce: identity.nonce } : {}),
      };
      const { data, error } =
        await this.supabase.auth.signInWithIdToken(credentials);

      if (error) {
        this.setError(error.message);
        return;
      }

      this.state.set({
        session: data.session,
        user: data.session?.user ?? null,
        loading: false,
        error: null,
      });
    } catch (error) {
      this.setError(this.toAuthErrorMessage(error));
    }
  }

  /**
   * Initializes the Capacitor social provider plugin once for native builds.
   *
   * Decision: initialization is centralized so screens can request login
   * without knowing provider client IDs or platform-specific setup.
   */
  private async initializeNativeSocialLogin(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    await SocialLogin.initialize({
      google: {
        webClientId: environment.googleWebClientId || undefined,
        iOSClientId: environment.googleIosClientId || undefined,
        iOSServerClientId: environment.googleWebClientId || undefined,
        mode: 'online',
      },
      apple: {
        clientId: environment.appleClientId || undefined,
        redirectUrl: Capacitor.getPlatform() === 'ios'
          ? ''
          : environment.appleRedirectUrl,
      },
    });
  }

  /**
   * Requests a native provider token from Google or Apple.
   *
   * Decision: each provider response has a different shape, so extracting the
   * ID token here keeps Supabase session creation provider-agnostic.
   */
  private async getNativeIdToken(
    provider: AuthProvider,
  ): Promise<NativeIdentityToken> {
    if (provider === 'google') {
      return this.getGoogleNativeIdToken();
    }

    return this.getAppleNativeIdToken();
  }

  /**
   * Requests a Google ID token through the native account selector.
   *
   * Decision: Google requires a Web Client ID for Android and an optional iOS
   * Client ID for iOS, so the method fails early when config is incomplete.
   */
  private async getGoogleNativeIdToken(): Promise<NativeIdentityToken> {
    if (!environment.googleWebClientId) {
      throw new Error(
        'Falta configurar googleWebClientId para login nativo con Google.',
      );
    }

    await SocialLogin.logout({ provider: 'google' }).catch(() => undefined);

    const login = await SocialLogin.login({
      provider: 'google',
      options: {
        scopes: ['email', 'profile'],
        forcePrompt: true,
      },
    });
    const result = login.result;

    if (result.responseType !== 'online' || !result.idToken) {
      throw new Error('Google no devolvio un ID token nativo.');
    }

    return { token: result.idToken };
  }

  /**
   * Requests an Apple identity token through the native Apple sheet.
   *
   * Decision: Sign in with Apple is native on iOS; Android/web Apple flows
   * require OAuth-style setup and are intentionally not used for native iOS QA.
   */
  private async getAppleNativeIdToken(): Promise<NativeIdentityToken> {
    if (Capacitor.getPlatform() !== 'ios') {
      throw new Error('Apple nativo solo esta disponible en iOS.');
    }

    const login = await SocialLogin.login({
      provider: 'apple',
      options: {
        scopes: ['email', 'name'],
      },
    });

    if (!login.result.idToken) {
      throw new Error('Apple no devolvio un identity token nativo.');
    }

    return { token: login.result.idToken };
  }

  /**
   * Exchanges an OAuth callback code for a persisted Supabase session.
   *
   * Decision: handling the callback explicitly works for both web URLs and
   * Capacitor deep links, keeping the login flow testable in Angular routes.
   */
  async completeOAuthCallback(callbackUrl: string): Promise<boolean> {
    const code = this.readCodeFromUrl(callbackUrl);

    if (!code) {
      this.setError('No se recibio codigo de autenticacion.');
      return false;
    }

    this.state.update((current) => ({ ...current, loading: true, error: null }));

    const { data, error } =
      await this.supabase.auth.exchangeCodeForSession(code);

    if (error) {
      this.setError(error.message);
      return false;
    }

    this.state.set({
      session: data.session,
      user: data.session?.user ?? null,
      loading: false,
      error: null,
    });

    return true;
  }

  /**
   * Signs the user out of the local Supabase session.
   *
   * Decision: sign-out stays client-side because Supabase owns browser/mobile
   * session persistence and token cleanup.
   */
  async signOut(): Promise<void> {
    this.state.update((current) => ({ ...current, loading: true, error: null }));
    const { error } = await this.supabase.auth.signOut();

    if (error) {
      this.setError(error.message);
      return;
    }

    if (Capacitor.isNativePlatform()) {
      await Promise.all([
        SocialLogin.logout({ provider: 'google' }).catch(() => undefined),
        SocialLogin.logout({ provider: 'apple' }).catch(() => undefined),
      ]);
    }

    this.state.set({ session: null, user: null, loading: false, error: null });
  }

  /**
   * Returns the current access token for backend API calls.
   *
   * Decision: the backend validates Supabase tokens directly, so frontend API
   * requests only need to forward the current access token as a bearer credential.
   */
  getAccessToken(): string | null {
    return this.state().session?.access_token ?? null;
  }

  /**
   * Restores a persisted Supabase session when the app starts.
   *
   * Decision: a physical-device test should keep the user signed in after the
   * OAuth browser returns or the app is reopened.
   */
  private async restoreSession(): Promise<void> {
    const { data, error } = await this.supabase.auth.getSession();

    if (error) {
      this.setError(error.message);
      return;
    }

    this.state.set({
      session: data.session,
      user: data.session?.user ?? null,
      loading: false,
      error: null,
    });
  }

  /**
   * Confirms a provider is part of the product allow-list.
   *
   * Decision: keeping the check in the service protects both templates and any
   * future programmatic auth entry points.
   */
  private isAllowedProvider(provider: string): provider is AuthProvider {
    return this.allowedProviders.some((allowed) => allowed === provider);
  }

  /**
   * Reads the PKCE callback code from web or native callback URLs.
   *
   * Decision: using the URL parser avoids brittle string slicing across
   * `http://localhost` and custom native callback schemes.
   */
  private readCodeFromUrl(callbackUrl: string): string | null {
    try {
      return new URL(callbackUrl).searchParams.get('code');
    } catch {
      return null;
    }
  }

  /**
   * Stores the latest user-facing auth error.
   *
   * Decision: a shared setter keeps loading state consistent after any failed
   * Supabase operation.
   */
  private setError(message: string): void {
    this.state.update((current) => ({
      ...current,
      loading: false,
      error: message,
    }));
  }

  /**
   * Normalizes provider and Supabase errors into Spanish UI messages.
   *
   * Decision: native plugins return heterogeneous errors, so the UI receives a
   * stable string while logs can still be added later if needed.
   */
  private toAuthErrorMessage(error: unknown): string {
    const nativeError = error as Partial<SocialLoginError>;

    if (nativeError.code === 'USER_CANCELLED') {
      return 'Acceso cancelado.';
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'No se pudo completar el acceso nativo.';
  }
}
