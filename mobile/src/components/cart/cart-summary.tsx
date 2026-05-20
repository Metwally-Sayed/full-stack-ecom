import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { FontSize, Spacing } from '@/constants/spacing';
import { formatPrice } from '@/lib/format';
import { useThemeColors } from '@/stores/theme-store';

type CartSummaryProps = {
  subtotal: number;
  itemCount: number;
  onCheckout: () => void;
  loading?: boolean;
};

export function CartSummary({ subtotal, itemCount, onCheckout, loading }: CartSummaryProps) {
  const colors = useThemeColors();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.row}>
        <Text variant="body" color={colors.textSecondary}>
          {itemCount} item{itemCount !== 1 ? 's' : ''}
        </Text>
        <Text style={[styles.subtotal, { color: colors.text }]}>{formatPrice(subtotal)}</Text>
      </View>
      <Button onPress={onCheckout} loading={loading} fullWidth size="lg">
        Place Order
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.base,
    paddingBottom: Spacing.xl,
    borderTopWidth: 1,
    gap: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtotal: { fontSize: FontSize.xl, fontWeight: '700' },
});
