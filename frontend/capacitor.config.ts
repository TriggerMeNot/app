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
      "*"
    ]
  },
  plugins: {
    App: {
      domain: 'localhost:8081',
      paths: [
        '/login/',
        '/login/google/',
        '/login/github/',
        '/login/microsoft/',
        '/login/discord/',
        '/terms/',
        '/reset-password/',
        '/services/',
        '/services/google/',
        '/services/github/',
        '/services/microsoft/',
        '/services/discord/',
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
