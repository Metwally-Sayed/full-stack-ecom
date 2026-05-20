import { StyleSheet, View } from 'react-native';
import { Skeleton } from '@/components/ui/skeleton';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { useThemeColors } from '@/stores/theme-store';

function ProductSkeletonCard() {
  const colors = useThemeColors();

  return (
    <View style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <Skeleton height={160} borderRadius={0} />
      <View style={styles.body}>
        <Skeleton height={14} width="80%" />
        <Skeleton height={11} width="50%" />
        <View style={styles.footer}>
          <Skeleton height={16} width={60} />
          <Skeleton width={30} height={30} borderRadius={15} />
        </View>
      </View>
    </View>
  );
}

export function ProductListSkeleton() {
  return (
    <View style={styles.grid}>
      {Array.from({ length: 6 }).map((_, i) => (
        <View key={i} style={styles.item}>
          <ProductSkeletonCard />
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
  card: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
  },
  body: { padding: Spacing.md, gap: 6 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
});
