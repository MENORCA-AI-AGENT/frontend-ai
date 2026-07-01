// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  supabaseUrl: 'https://ocwakwtzliledabccvgc.supabase.co',
  supabasePublishableKey: 'sb_publishable_SjGUvDxtB7iMZAi4LhFNSg_HzuJsMtK',
  authRedirectUrl: 'http://localhost:8100/auth/callback',
  nativeAuthRedirectUrl: 'com.danny-armijos.menorca-ai-agent://auth/callback',
  googleWebClientId: '804358190687-071h3gve8rt605sc8m05igqrp0tdr5dg.apps.googleusercontent.com',
  googleIosClientId: '804358190687-1jgo41tfqn5bvcsh7o1n6bt1nhn8kg5e.apps.googleusercontent.com',
  appleClientId: 'com.danny-armijos.menorca-ai-agent',
  appleRedirectUrl: 'https://ocwakwtzliledabccvgc.supabase.co/auth/v1/callback',
  allowedAuthProviders: ['google', 'apple'] as const,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
