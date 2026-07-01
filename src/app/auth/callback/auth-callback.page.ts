import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonSpinner } from '@ionic/angular/standalone';
import { AuthService } from '../../core/auth/auth.service';

/**
 * Handles Supabase OAuth redirects for web and Capacitor deep links.
 *
 * Decision: a dedicated callback route keeps PKCE session exchange isolated and
 * gives Playwright/mobile tests a stable page to inspect.
 */
@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.page.html',
  styleUrls: ['./auth-callback.page.scss'],
  imports: [IonContent, IonSpinner],
})
export class AuthCallbackPage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /**
   * Completes the OAuth code exchange and routes the user into the app.
   *
   * Decision: using the full current URL preserves query parameters across web
   * and native callback forms.
   */
  async ngOnInit(): Promise<void> {
    const completed = await this.auth.completeOAuthCallback(window.location.href);
    await this.router.navigateByUrl(completed ? '/home' : '/login', {
      replaceUrl: true,
    });
  }
}
