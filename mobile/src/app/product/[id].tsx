import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ui/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { QuantityStepper } from '@/components/cart/quantity-stepper';
import { OrderStatusBadge } from '@/components/ui/badge';
import { Colors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/spacing';
import { useProduct } from '@/hooks/use-product';
import { useCartStore } from '@/stores/cart-store';
import { formatPrice } from '@/lib/format';

function ProductDetailSkeleton() {
  return (
    <ScrollView contentContainerStyle={styles.skeletonContent}>
      <Skeleton height={320} borderRadius={0} />
      <View style={styles.body}>
        <Skeleton height={28} width="70%" />
        <Skeleton height={16} width="40%" />
        <Skeleton height={32} width="30%" />
        <Skeleton height={14} />
        <Skeleton height={14} />
        <Skeleton height={14} width="80%" />
      </View>
    </ScrollView>
  );
}

export default function ProductDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { product, isLoading, isError, refetch } = useProduct(id);
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);

  function handleAddToCart() {
    if (!product) return;
    for (let i = 0; i < qty; i++) addItem(product);
    Toast.show({
      type: 'success',
      text1: `Added ${qty} × ${product.name}`,
      text2: 'Item added to cart',
    });
  }

  if (isLoading) return <ProductDetailSkeleton />;
  if (isError || !product) {
    return <ErrorState message="Product not found" onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={product.imageUrl ?? 'https://placehold.co/800x800/F3F4F6/9CA3AF?text=No+Image'}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.body}>
          {product.category ? (
            <Text variant="caption" style={styles.category}>{product.category.name}</Text>
          ) : null}
          <Text variant="h2" style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>

          {product.description ? (
            <View style={styles.descSection}>
              <Text variant="label" style={styles.descLabel}>Description</Text>
              <Text variant="body" color={Colors.textSecondary}>{product.description}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Spacing.base + insets.bottom }]}>
        <View style={styles.footerTop}>
          <Text variant="label">Quantity</Text>
          <QuantityStepper
            value={qty}
            onIncrease={() => setQty((q) => q + 1)}
            onDecrease={() => setQty((q) => Math.max(1, q - 1))}
          />
        </View>
        <View style={styles.footerBottom}>
          <View>
            <Text variant="caption">Total</Text>
            <Text style={styles.total}>{formatPrice(product.price * qty)}</Text>
          </View>
          <Button onPress={handleAddToCart} size="lg" style={styles.addBtn}>
            Add to Cart
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  skeletonContent: { flexGrow: 1 },
  image: {
    width: '100%',
    height: 320,
    backgroundColor: Colors.backgroundElement,
  },
  body: { padding: Spacing.base, gap: Spacing.sm },
  category: { color: Colors.primary, textTransform: 'uppercase', letterSpacing: 0.5 },
  name: { marginTop: 2 },
  price: { fontSize: FontSize['2xl'], fontWeight: '800', color: Colors.primary },
  descSection: { marginTop: Spacing.sm, gap: Spacing.sm },
  descLabel: { color: Colors.textSecondary },
  footer: {
    borderTopWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    gap: Spacing.md,
    backgroundColor: Colors.background,
  },
  footerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  total: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.text },
  addBtn: { flex: 1, marginLeft: Spacing.base },
});
