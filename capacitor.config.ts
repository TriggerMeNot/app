import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'net.triggermenot.app',
  appName: 'TriggerMeNot',
  webDir: 'dist',
  server: {
    androidScheme: 'http',
    iosScheme: 'http',
    hostname: 'localhost:8081',
    cleartext: true,
    allowNavigation: [
      "/login/*",
      "/services/*",
    ]
  },
  plugins: {
    App: {
      domain: 'localhost:8081',
      paths: [
        '/login/',
        '/terms/',
        '/reset-password/',
        '/services/',
        '/settings/',
        '/playground/',
        '/playground/:id/'
      ]
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
