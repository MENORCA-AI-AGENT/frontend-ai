import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { AuthService } from '../core/auth/auth.service';

/**
 * First authenticated app surface after login.
 *
 * Decision: this page remains lightweight for the auth slice, showing session
 * state and a stable destination before the travel widgets are implemented.
 */
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonButton, IonHeader, IonToolbar, IonTitle, IonContent, RouterLink],
})
export class HomePage {
  readonly auth = inject(AuthService);

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
