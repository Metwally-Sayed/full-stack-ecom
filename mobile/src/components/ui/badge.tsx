import { StyleSheet, View, type TextStyle, type ViewStyle } from 'react-native';
import { Text } from './text';
import { BorderRadius, FontSize, Spacing } from '@/constants/spacing';
import { useThemeColors } from '@/stores/theme-store';
import type { OrderStatus } from '@/types/order';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  style?: ViewStyle;
};

export function Badge({ children, variant = 'default', style }: BadgeProps) {
  const colors = useThemeColors();
  const themedBgStyles: Record<BadgeVariant, ViewStyle> = {
    default: { backgroundColor: colors.backgroundElement },
    success: { backgroundColor: colors.successLight },
    warning: { backgroundColor: colors.warningLight },
    error: { backgroundColor: colors.errorLight },
    info: { backgroundColor: colors.infoLight },
  };
  const themedTextStyles: Record<BadgeVariant, TextStyle> = {
    default: { color: colors.textSecondary },
    success: { color: colors.success },
    warning: { color: colors.warning },
    error: { color: colors.error },
    info: { color: colors.info },
  };

  return (
    <View style={[styles.base, themedBgStyles[variant], style]}>
      <Text style={[styles.text, themedTextStyles[variant]]}>{children}</Text>
    </View>
  );
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const variantMap: Record<OrderStatus, BadgeVariant> = {
    Pending: 'warning',
    Processing: 'info',
    Completed: 'success',
    Cancelled: 'error',
  };
  return <Badge variant={variantMap[status]}>{status}</Badge>;
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  text: { fontSize: FontSize.xs, fontWeight: '600' },
});
