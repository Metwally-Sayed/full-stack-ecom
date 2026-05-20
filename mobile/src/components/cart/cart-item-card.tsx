import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { Trash2 } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { QuantityStepper } from './quantity-stepper';
import { Colors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/spacing';
import { formatPrice } from '@/lib/format';
import { useCartStore } from '@/stores/cart-store';
import type { CartItem } from '@/types/cart';

type CartItemCardProps = {
  item: CartItem;
};

export function CartItemCard({ item }: CartItemCardProps) {
  const { increaseQuantity, decreaseQuantity, removeItem } = useCartStore();

  return (
    <View style={styles.card}>
      <Image
        source={item.product.imageUrl ?? 'https://placehold.co/80x80/F3F4F6/9CA3AF?text=IMG'}
        style={styles.image}
        contentFit="cover"
        transition={150}
      />
      <View style={styles.body}>
        <View style={styles.top}>
          <Text variant="label" numberOfLines={2} style={styles.name}>
            {item.product.name}
          </Text>
          <TouchableOpacity onPress={() => removeItem(item.product.id)} hitSlop={8}>
            <Trash2 size={16} color={Colors.error} />
          </TouchableOpacity>
        </View>
        <Text style={styles.unitPrice}>{formatPrice(item.product.price)} each</Text>
        <View style={styles.bottom}>
          <QuantityStepper
            value={item.quantity}
            onIncrease={() => increaseQuantity(item.product.id)}
            onDecrease={() => decreaseQuantity(item.product.id)}
          />
          <Text style={styles.lineTotal}>
            {formatPrice(item.product.price * item.quantity)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: Spacing.md,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundElement,
  },
  body: { flex: 1, gap: 6 },
  top: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.sm },
  name: { flex: 1, fontSize: FontSize.sm },
  unitPrice: { fontSize: FontSize.xs, color: Colors.textSecondary },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lineTotal: { fontSize: FontSize.base, fontWeight: '700', color: Colors.text },
});
