import { Redirect } from 'expo-router';
import { useAuthStore } from '@/stores/auth-store';
import { LoadingScreen } from '@/components/ui/loading-screen';

export default function Index() {
  const { isLoading, isAuthenticated } = useAuthStore();

  if (isLoading) return <LoadingScreen />;

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/shop" />;
  }
  return <Redirect href="/(auth)/login" />;
}
