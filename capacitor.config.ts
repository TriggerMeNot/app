import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'net.triggermenot.app',
  appName: 'TriggerMeNot',
  webDir: 'dist',
  server: {
    androidScheme: 'http',
    iosScheme: 'http',
    hostname: '192.168.1.14:8081',
    cleartext: true,
    allowNavigation: [
      'http://*/*',
    ]
  },
  plugins: {
    App: {
      domain: '192.168.1.14:8081',
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
