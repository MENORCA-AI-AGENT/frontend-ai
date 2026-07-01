import { Injectable, computed, signal } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { AuthProvider, AuthState } from './auth.types';

/**
 * Owns client-side Supabase authentication for the Ionic app.
 *
 * Decision: Supabase Auth remains the identity provider while this service
 * coordinates provider allow-listing, mobile browser redirects, session state,
 * and backend token handoff.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase: SupabaseClient;
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
   * Decision: native builds open Supabase's OAuth URL in the system browser so
   * provider consent screens work reliably on physical devices and return via
   * the app's deep link scheme.
   */
  async signInWithProvider(provider: AuthProvider): Promise<void> {
    if (!this.isAllowedProvider(provider)) {
      this.setError('Proveedor de acceso no permitido.');
      return;
    }

    this.state.update((current) => ({ ...current, loading: true, error: null }));

    const redirectTo = Capacitor.isNativePlatform()
      ? environment.nativeAuthRedirectUrl
      : environment.authRedirectUrl;
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        skipBrowserRedirect: Capacitor.isNativePlatform(),
      },
    });

    if (error) {
      this.setError(error.message);
      return;
    }

    if (Capacitor.isNativePlatform() && data.url) {
      await Browser.open({ url: data.url, presentationStyle: 'fullscreen' });
      return;
    }

    this.state.update((current) => ({ ...current, loading: false }));
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

    if (Capacitor.isNativePlatform()) {
      await Browser.close().catch(() => undefined);
    }

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
   * `http://localhost` and `com.menorca.aiagent://` schemes.
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
}
