import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ee8e673189314bdf86753a11696bcbc1',
  appName: 'ZenFlow',
  webDir: 'dist',
  server: {
    url: 'https://ee8e6731-8931-4bdf-8675-3a11696bcbc1.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;