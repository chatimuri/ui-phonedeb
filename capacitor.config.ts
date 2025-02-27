
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.2ac59982d8334c1b87d2c50ad7891159',
  appName: 'BloodSugarTracker',
  webDir: 'dist',
  server: {
    url: 'https://2ac59982-d833-4c1b-87d2-c50ad7891159.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#FFFFFF",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#6366F1",
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
