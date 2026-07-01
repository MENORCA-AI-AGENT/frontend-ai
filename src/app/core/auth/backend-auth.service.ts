import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

/**
 * Calls backend auth endpoints with the current Supabase access token.
 *
 * Decision: backend communication is separated from Supabase session management
 * so API contracts can evolve without changing the OAuth flow.
 */
@Injectable({ providedIn: 'root' })
export class BackendAuthService {
  private readonly auth = inject(AuthService);

  /**
   * Loads the backend-safe current user profile.
   *
   * Decision: this verifies that the physical-device Supabase session is also
   * accepted by NestJS before protected travel-agent features are enabled.
   */
  async getCurrentUser(): Promise<unknown> {
    return this.request('/api/auth/me', { method: 'GET' });
  }

  /**
   * Requests deletion of the authenticated account.
   *
   * Decision: account deletion must go through the backend because only the
   * backend can safely use Supabase service-role credentials.
   */
  async deleteCurrentAccount(): Promise<unknown> {
    return this.request('/api/auth/me', { method: 'DELETE' });
  }

  /**
   * Sends an authenticated request to the backend.
   *
   * Decision: using a tiny wrapper avoids repeating bearer-token plumbing across
   * future services while keeping this first auth slice lightweight.
   */
  private async request(path: string, init: RequestInit): Promise<unknown> {
    const token = this.auth.getAccessToken();

    if (!token) {
      throw new Error('No hay sesion activa.');
    }

    const response = await fetch(`${environment.apiUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...init.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Backend auth request failed: ${response.status}`);
    }

    return response.json();
  }
}
