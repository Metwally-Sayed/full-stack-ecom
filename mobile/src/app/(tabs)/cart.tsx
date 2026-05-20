import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShoppingBag } from 'lucide-react-native';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { EmptyState } from '@/components/ui/empty-state';
import { CartItemCard } from '@/components/cart/cart-item-card';
import { CartSummary } from '@/components/cart/cart-summary';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { useCartStore } from '@/stores/cart-store';
import { useCheckout } from '@/hooks/use-checkout';
import { getErrorMessage } from '@/lib/api';

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const items = useCartStore((s) => s.items);
  const totalItems = useCartStore((s) => s.totalItems());
  const subtotal = useCartStore((s) => s.subtotal());
  const checkout = useCheckout();

  async function handleCheckout() {
    if (items.length === 0) return;
    try {
      await checkout.mutateAsync(
        items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      );
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Checkout failed', text2: getErrorMessage(err) });
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <Text variant="h2">My Cart</Text>
        {totalItems > 0 ? (
          <Text variant="body" color={Colors.textSecondary}>
            {totalItems} item{totalItems !== 1 ? 's' : ''}
          </Text>
        ) : null}
      </View>

      {items.length === 0 ? (
        <Screen contentStyle={styles.emptyContent}>
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Add some products to get started"
            actionLabel="Browse Products"
            onAction={() => router.push('/(tabs)/shop')}
          />
        </Screen>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.product.id}
            renderItem={({ item }) => <CartItemCard item={item} />}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
          <CartSummary
            subtotal={subtotal}
            itemCount={totalItems}
            onCheckout={handleCheckout}
            loading={checkout.isPending}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
  },
  emptyContent: { flex: 1, padding: 0 },
  list: { padding: Spacing.base, gap: Spacing.md },
});
