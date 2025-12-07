import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Navigation from './src/navigation/Navigation';
import * as SplashScreen from 'expo-splash-screen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore errors from splash screen
});

export default function App() {
  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, images, etc.
        // await loadFonts();
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn('Error in app init:', e);
      }
    }

    prepare();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Navigation />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
