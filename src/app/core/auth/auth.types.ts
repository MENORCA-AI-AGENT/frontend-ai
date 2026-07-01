import type { Provider, Session, User } from '@supabase/supabase-js';

/**
 * OAuth providers intentionally enabled for the Menorca AI Agent app.
 *
 * Decision: Google and Apple are modeled as a narrow union so the UI cannot
 * accidentally render unsupported Supabase providers.
 */
export type AuthProvider = Extract<Provider, 'google' | 'apple'>;

/**
 * Current authentication state exposed to Angular components.
 *
 * Decision: components consume this compact state instead of raw Supabase
 * internals so the frontend can evolve without coupling templates to SDK shapes.
 */
export interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}
