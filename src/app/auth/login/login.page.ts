import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonSpinner,
} from '@ionic/angular/standalone';
import { AuthService } from '../../core/auth/auth.service';
import { AuthProvider } from '../../core/auth/auth.types';
import { I18nService } from '../../core/i18n/i18n.service';

/**
 * Login screen for Google and Apple Supabase OAuth.
 *
 * Decision: the page keeps the provider logos visible and unmodified because
 * Apple and Google sign-in approvals depend on recognizable branded buttons.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonButton, IonContent, IonSpinner],
})
export class LoginPage {
  readonly auth = inject(AuthService);
  readonly i18n = inject(I18nService);
  private readonly router = inject(Router);
  readonly isBusy = computed(() => this.auth.loading());

  /**
   * Starts the selected OAuth provider flow.
   *
   * Decision: the component delegates provider validation and native/browser
   * behavior to AuthService so the template stays focused on interaction.
   */
  signIn(provider: AuthProvider): Promise<void> {
    return this.auth.signInWithProvider(provider);
  }

  /**
   * Continues to the guest travel dashboard without creating a session.
   *
   * Decision: guest mode belongs in the login surface because it is the point
   * where the user chooses between native Supabase auth and the limited
   * anonymous quota described by the product rules.
   */
  skipRegistration(): Promise<boolean> {
    return this.router.navigateByUrl('/home');
  }
}
