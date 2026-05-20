import { useCallback, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import { PackageSearch } from 'lucide-react-native';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { ProductGrid } from '@/components/products/product-grid';
import { ProductListSkeleton } from '@/components/products/product-list-skeleton';
import { CategoryTabs } from '@/components/products/category-tabs';
import { ProductSearch } from '@/components/products/product-search';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { useProducts } from '@/hooks/use-products';
import { useCategories } from '@/hooks/use-categories';
import { useDebounce } from '@/hooks/use-debounce';

export default function ShopScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const debouncedSearch = useDebounce(search, 350);
  const { categories } = useCategories();
  const { products, isLoading, isFetching, isError, refetch } = useProducts({
    search: debouncedSearch || undefined,
    category: selectedCategory ?? undefined,
    limit: 20,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['products'] });
    setRefreshing(false);
  }, [queryClient]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Search + categories in one tight block */}
      <View style={styles.header}>
        <ProductSearch value={search} onChangeText={setSearch} />
        <CategoryTabs
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </View>

      {/* Thin loading bar when switching categories/search */}
      {isFetching && !isLoading && (
        <ActivityIndicator
          size="small"
          color={Colors.primary}
          style={styles.fetchingIndicator}
        />
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        {isLoading ? (
          <ProductListSkeleton />
        ) : isError ? (
          <ErrorState message="Failed to load products" onRetry={refetch} style={styles.state} />
        ) : products.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title={search ? 'No results found' : 'No products available'}
            description={search ? `No products match "${search}"` : 'Check back later'}
            style={styles.state}
          />
        ) : (
          <ProductGrid products={products} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.background,
    paddingTop: Spacing.sm,
    gap: Spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  fetchingIndicator: { marginVertical: Spacing.xs },
  scroll: { flex: 1 },
  scrollContent: { padding: Spacing.base, paddingTop: Spacing.sm, flexGrow: 1 },
  state: { minHeight: 300 },
});
