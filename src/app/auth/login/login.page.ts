import { Component, computed, inject } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonSpinner,
} from '@ionic/angular/standalone';
import { AuthService } from '../../core/auth/auth.service';
import { AuthProvider } from '../../core/auth/auth.types';

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
}
