import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { OrderStatusBadge } from '@/components/ui/badge';
import { Colors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/spacing';
import { formatDate, formatPrice, shortenId } from '@/lib/format';
import type { Order } from '@/types/order';

type OrderCardProps = { order: Order };

export function OrderCard({ order }: OrderCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/orders/${order.id}`)}
      activeOpacity={0.8}
    >
      <View style={styles.top}>
        <Text style={styles.id}>{shortenId(order.id)}</Text>
        <OrderStatusBadge status={order.status} />
      </View>
      <View style={styles.mid}>
        <Text variant="bodySmall" color={Colors.textSecondary}>
          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
        </Text>
        <Text variant="bodySmall" color={Colors.textSecondary}>
          {formatDate(order.createdAt)}
        </Text>
      </View>
      <View style={styles.bottom}>
        <Text style={styles.total}>{formatPrice(order.totalAmount)}</Text>
        <ChevronRight size={18} color={Colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    gap: Spacing.sm,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  id: { fontSize: FontSize.base, fontWeight: '700' },
  mid: { flexDirection: 'row', justifyContent: 'space-between' },
  bottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  total: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
});
