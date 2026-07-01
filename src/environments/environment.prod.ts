export const environment = {
  production: true,
  apiUrl: '',
  supabaseUrl: 'https://ocwakwtzliledabccvgc.supabase.co',
  supabasePublishableKey: 'sb_publishable_SjGUvDxtB7iMZAi4LhFNSg_HzuJsMtK',
  authRedirectUrl: 'https://app.menorca-ai-agent.com/auth/callback',
  nativeAuthRedirectUrl: 'com.menorca.aiagent://auth/callback',
  allowedAuthProviders: ['google', 'apple'] as const,
};
