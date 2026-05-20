import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { RealtimeBridge } from '@/components/common/realtime-bridge';
import { useAuthStore } from '@/stores/auth-store';
import { useThemeColors, useThemeStore } from '@/stores/theme-store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

function AuthInitializer() {
  const hydrateAuth = useAuthStore((s) => s.hydrateAuth);
  useEffect(() => {
    void hydrateAuth();
  }, [hydrateAuth]);
  return null;
}

export default function RootLayout() {
  const colors = useThemeColors();
  const mode = useThemeStore((s) => s.mode);
  const hydrateTheme = useThemeStore((s) => s.hydrateTheme);

  useEffect(() => {
    void hydrateTheme();
  }, [hydrateTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer />
      <RealtimeBridge />
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} backgroundColor={colors.background} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="product/[id]"
          options={{
            headerShown: true,
            headerTitle: '',
            headerBackTitle: 'Back',
            headerTintColor: colors.primary,
            headerShadowVisible: false,
            headerStyle: { backgroundColor: colors.background },
          }}
        />
        <Stack.Screen
          name="orders/[id]"
          options={{
            headerShown: true,
            headerTitle: 'Order Details',
            headerBackTitle: 'Back',
            headerTintColor: colors.primary,
            headerShadowVisible: false,
            headerStyle: { backgroundColor: colors.background },
          }}
        />
        <Stack.Screen name="checkout/success" />
      </Stack>
      <Toast />
    </QueryClientProvider>
  );
}
