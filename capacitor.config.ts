import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'net.triggermenot.app',
  appName: 'TriggerMeNot',
  webDir: 'dist',
  server: {
    androidScheme: 'http',
    iosScheme: 'http',
    hostname: 'localhost:8081',
    cleartext: true
  },
  plugins: {
    App: {
      domain: 'localhost:8081',
    }
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: "mobile"
  },
  android: {
    backgroundColor: "#FFFFFF",
  }
};

export default config;
