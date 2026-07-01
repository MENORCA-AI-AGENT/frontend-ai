import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { AuthService } from '../core/auth/auth.service';
import { I18nService } from '../core/i18n/i18n.service';

/**
 * Main travel dashboard rendered after onboarding or authentication.
 *
 * Decision: the page mirrors the approved Google Stitch dashboard while keeping
 * auth actions in the avatar so device testing can repeat Supabase sessions
 * without adding extra visual controls outside the source design.
 */
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonContent, RouterLink],
})
export class HomePage {
  readonly auth = inject(AuthService);
  readonly i18n = inject(I18nService);

  /**
   * Ends the current Supabase session.
   *
   * Decision: logout stays available from the first auth milestone so physical
   * device testing can repeat Google and Apple sign-in flows cleanly.
   */
  signOut(): Promise<void> {
    return this.auth.signOut();
  }
}
