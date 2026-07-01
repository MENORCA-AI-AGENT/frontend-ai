import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.menorca.aiagent',
  appName: 'Menorca AI Agent',
  webDir: 'www',
  plugins: {
    SocialLogin: {
      providers: {
        google: true,
        apple: true,
        facebook: false,
        twitter: false,
      },
      logLevel: 0,
    },
  },
};

export default config;
