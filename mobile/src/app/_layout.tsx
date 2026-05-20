import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { RealtimeBridge } from '@/components/common/realtime-bridge';
import { useAuthStore } from '@/stores/auth-store';

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
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer />
      <RealtimeBridge />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="product/[id]"
          options={{
            headerShown: true,
            headerTitle: '',
            headerBackTitle: 'Back',
            headerTintColor: '#208AEF',
            headerShadowVisible: false,
            headerStyle: { backgroundColor: '#FFFFFF' },
          }}
        />
        <Stack.Screen
          name="orders/[id]"
          options={{
            headerShown: true,
            headerTitle: 'Order Details',
            headerBackTitle: 'Back',
            headerTintColor: '#208AEF',
            headerShadowVisible: false,
            headerStyle: { backgroundColor: '#FFFFFF' },
          }}
        />
        <Stack.Screen name="checkout/success" />
      </Stack>
      <Toast />
    </QueryClientProvider>
  );
}
