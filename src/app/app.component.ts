import { Component, NgZone, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

/**
 * Root shell for the Ionic application.
 *
 * Decision: deep-link handling lives at the root so OAuth callbacks from the
 * physical device can route into Angular no matter which page was active.
 */
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly zone = inject(NgZone);

  /**
   * Registers the Capacitor URL listener used by OAuth providers.
   *
   * Decision: the callback URL is normalized into an Angular route so the same
   * `AuthCallbackPage` completes login for both browser and native flows.
   */
  ngOnInit(): void {
    void App.addListener('appUrlOpen', ({ url }) => {
      const route = this.toAngularRoute(url);

      if (!route) {
        return;
      }

      this.zone.run(() => {
        void this.router.navigateByUrl(route, { replaceUrl: true });
      });
    });
  }

  /**
   * Converts supported web and custom-scheme callback URLs into app routes.
   *
   * Decision: custom schemes encode `auth` as the URL host, so the method joins
   * host, path, and query to preserve `/auth/callback?code=...`.
   */
  private toAngularRoute(url: string): string | null {
    try {
      const parsed = new URL(url);

      if (parsed.protocol === 'com.menorca.aiagent:') {
        return `/${parsed.host}${parsed.pathname}${parsed.search}`;
      }

      if (parsed.pathname.startsWith('/auth/callback')) {
        return `${parsed.pathname}${parsed.search}`;
      }

      return null;
    } catch {
      return null;
    }
  }
}
