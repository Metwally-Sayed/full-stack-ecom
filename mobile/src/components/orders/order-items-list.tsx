import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Text } from '@/components/ui/text';
import { Colors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/spacing';
import { formatPrice } from '@/lib/format';
import type { OrderItem } from '@/types/order';

type OrderItemsListProps = { items: OrderItem[] };

export function OrderItemsList({ items }: OrderItemsListProps) {
  return (
    <View style={styles.container}>
      {items.map((item) => (
        <View key={item.id} style={styles.row}>
          <Image
            source={item.productImageUrl ?? 'https://placehold.co/56x56/F3F4F6/9CA3AF?text=IMG'}
            style={styles.image}
            contentFit="cover"
            transition={150}
          />
          <View style={styles.info}>
            <Text variant="label" numberOfLines={2}>{item.productName}</Text>
            <Text variant="caption">Qty: {item.quantity}</Text>
          </View>
          <View style={styles.pricing}>
            <Text style={styles.lineTotal}>{formatPrice(item.lineTotal)}</Text>
            <Text variant="caption">{formatPrice(item.unitPrice)} each</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.md },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundElement,
  },
  info: { flex: 1, gap: 4 },
  pricing: { alignItems: 'flex-end', gap: 2 },
  lineTotal: { fontSize: FontSize.base, fontWeight: '700' },
});
