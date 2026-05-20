import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ReceiptText } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Skeleton, SkeletonGroup } from '@/components/ui/skeleton';
import { OrderCard } from '@/components/orders/order-card';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { useOrders } from '@/hooks/use-orders';

function OrdersSkeleton() {
  return (
    <View style={styles.skeletonContainer}>
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonGroup key={i}>
          <Skeleton height={20} width="40%" />
          <Skeleton height={14} width="60%" />
          <Skeleton height={24} width="30%" />
        </SkeletonGroup>
      ))}
    </View>
  );
}

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const { orders, isLoading, isError, refetch } = useOrders();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <Text variant="h2">My Orders</Text>
      </View>

      {isLoading ? (
        <OrdersSkeleton />
      ) : isError ? (
        <ErrorState message="Failed to load orders" onRetry={refetch} />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ReceiptText}
          title="No orders yet"
          description="Your order history will appear here once you make a purchase"
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(o) => o.id}
          renderItem={({ item }) => <OrderCard order={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
  },
  list: { padding: Spacing.base, gap: Spacing.md },
  skeletonContainer: { padding: Spacing.base, gap: Spacing.xl },
});
