import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { ShoppingCart } from 'lucide-react-native';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Text } from '@/components/ui/text';
import { Colors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/spacing';
import { useCartStore } from '@/stores/cart-store';
import { useThemeColors } from '@/stores/theme-store';
import { formatPrice } from '@/lib/format';
import type { Product } from '@/types/product';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const colors = useThemeColors();

  function handleAddToCart() {
    addItem(product);
    Toast.show({ type: 'success', text1: 'Added to cart', text2: product.name });
  }

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
        },
      ]}
      onPress={() => router.push(`/product/${product.id}`)}
      activeOpacity={0.85}
    >
      <Image
        source={product.imageUrl ?? 'https://placehold.co/400x400/F3F4F6/9CA3AF?text=No+Image'}
        style={[styles.image, { backgroundColor: colors.backgroundElement }]}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.body}>
        <Text variant="label" numberOfLines={2} style={styles.name}>
          {product.name}
        </Text>
        {product.category ? (
          <Text
            variant="caption"
            numberOfLines={1}
            style={[styles.category, { color: colors.textMuted }]}
          >
            {product.category.name}
          </Text>
        ) : null}
        <View style={styles.footer}>
          <Text style={[styles.price, { color: colors.primary }]}>{formatPrice(product.price)}</Text>
          <TouchableOpacity
            style={[styles.cartBtn, { backgroundColor: colors.primary }]}
            onPress={handleAddToCart}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <ShoppingCart size={16} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  body: { padding: Spacing.md, gap: 4 },
  name: { fontSize: FontSize.sm, lineHeight: 18 },
  category: {},
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  price: { fontSize: FontSize.base, fontWeight: '700' },
  cartBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
