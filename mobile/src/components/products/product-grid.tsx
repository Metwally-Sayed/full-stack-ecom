import { StyleSheet, View } from 'react-native';
import { ProductCard } from './product-card';
import { Spacing } from '@/constants/spacing';
import type { Product } from '@/types/product';

type ProductGridProps = {
  products: Product[];
};

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <View style={styles.grid}>
      {products.map((product) => (
        <View key={product.id} style={styles.item}>
          <ProductCard product={product} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  item: { width: '47.5%' },
});
