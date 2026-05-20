import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Colors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/spacing';
import { formatPrice } from '@/lib/format';

type CartSummaryProps = {
  subtotal: number;
  itemCount: number;
  onCheckout: () => void;
  loading?: boolean;
};

export function CartSummary({ subtotal, itemCount, onCheckout, loading }: CartSummaryProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text variant="body" color={Colors.textSecondary}>
          {itemCount} item{itemCount !== 1 ? 's' : ''}
        </Text>
        <Text style={styles.subtotal}>{formatPrice(subtotal)}</Text>
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
    borderColor: Colors.border,
    backgroundColor: Colors.background,
    gap: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtotal: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text },
});
