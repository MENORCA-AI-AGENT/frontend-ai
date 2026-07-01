export const environment = {
  production: true,
  apiUrl: '',
  supabaseUrl: 'https://ocwakwtzliledabccvgc.supabase.co',
  supabasePublishableKey: 'sb_publishable_SjGUvDxtB7iMZAi4LhFNSg_HzuJsMtK',
  authRedirectUrl: 'https://app.menorca-ai-agent.com/auth/callback',
  nativeAuthRedirectUrl: 'com.danny-armijos.menorca-ai-agent://auth/callback',
  googleWebClientId: '804358190687-071h3gve8rt605sc8m05igqrp0tdr5dg.apps.googleusercontent.com',
  googleIosClientId: '804358190687-1jgo41tfqn5bvcsh7o1n6bt1nhn8kg5e.apps.googleusercontent.com',
  appleClientId: 'com.danny-armijos.menorca-ai-agent',
  appleRedirectUrl: 'https://ocwakwtzliledabccvgc.supabase.co/auth/v1/callback',
  allowedAuthProviders: ['google', 'apple'] as const,
};
