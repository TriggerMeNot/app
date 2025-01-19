import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'net.triggermenot.app',
  appName: 'TriggerMeNot',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'http',
    iosScheme: 'http',
    hostname: 'localhost:8081',
    cleartext: true
  },
  plugins: {
    App: {
      domain: 'localhost:8081',
      paths: [
        "login/*",
        "services/*",
      ]
    },
    CapacitorHttp: {
      enabled: true
    },
    CapacitorBrowser: {
      enabled: true
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
