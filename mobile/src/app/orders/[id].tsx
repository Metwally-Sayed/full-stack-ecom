import { ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { Skeleton, SkeletonGroup } from '@/components/ui/skeleton';
import { OrderStatusBadge } from '@/components/ui/badge';
import { OrderItemsList } from '@/components/orders/order-items-list';
import { Colors } from '@/constants/colors';
import { FontSize, Spacing } from '@/constants/spacing';
import { useOrder } from '@/hooks/use-order';
import { formatDate, formatPrice, shortenId } from '@/lib/format';

function OrderDetailSkeleton() {
  return (
    <ScrollView contentContainerStyle={styles.skeletonContent}>
      <SkeletonGroup>
        <Skeleton height={24} width="50%" />
        <Skeleton height={20} width="30%" />
        <Skeleton height={16} width="40%" />
      </SkeletonGroup>
      <View style={{ height: Spacing.xl }} />
      {Array.from({ length: 3 }).map((_, i) => (
        <View key={i} style={styles.skeletonRow}>
          <Skeleton width={56} height={56} borderRadius={10} />
          <SkeletonGroup>
            <Skeleton height={16} width="60%" />
            <Skeleton height={12} width="30%" />
          </SkeletonGroup>
        </View>
      ))}
    </ScrollView>
  );
}

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { order, isLoading, isError, refetch } = useOrder(id);

  if (isLoading) return <OrderDetailSkeleton />;
  if (isError || !order) {
    return <ErrorState message="Order not found" onRetry={refetch} />;
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Card style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text variant="label" color={Colors.textSecondary}>Order ID</Text>
          <Text style={styles.orderId}>{shortenId(order.id)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text variant="label" color={Colors.textSecondary}>Status</Text>
          <OrderStatusBadge status={order.status} />
        </View>
        <View style={styles.summaryRow}>
          <Text variant="label" color={Colors.textSecondary}>Date</Text>
          <Text variant="body">{formatDate(order.createdAt)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text variant="label" color={Colors.textSecondary}>Total</Text>
          <Text style={styles.totalAmount}>{formatPrice(order.totalAmount)}</Text>
        </View>
      </Card>

      <View style={styles.itemsSection}>
        <Text variant="h3" style={styles.sectionTitle}>
          Items ({order.items.length})
        </Text>
        <Card>
          <OrderItemsList items={order.items} />
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.backgroundSecondary },
  content: { padding: Spacing.base, gap: Spacing.base },
  skeletonContent: { padding: Spacing.base, gap: Spacing.xl },
  skeletonRow: { flexDirection: 'row', gap: Spacing.md, alignItems: 'center' },
  summaryCard: { gap: Spacing.md },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  totalRow: {
    borderTopWidth: 1,
    borderColor: Colors.border,
    paddingTop: Spacing.md,
    marginTop: Spacing.sm,
  },
  orderId: { fontSize: FontSize.base, fontWeight: '700' },
  totalAmount: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.primary },
  itemsSection: { gap: Spacing.md },
  sectionTitle: {},
});
