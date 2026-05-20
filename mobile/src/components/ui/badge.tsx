import { StyleSheet, View, type TextStyle, type ViewStyle } from 'react-native';
import { Text } from './text';
import { Colors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/spacing';
import type { OrderStatus } from '@/types/order';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
  style?: ViewStyle;
};

const bgStyles: Record<BadgeVariant, ViewStyle> = {
  default: { backgroundColor: Colors.backgroundElement },
  success: { backgroundColor: Colors.successLight },
  warning: { backgroundColor: Colors.warningLight },
  error: { backgroundColor: Colors.errorLight },
  info: { backgroundColor: Colors.infoLight },
};

const textStyles: Record<BadgeVariant, TextStyle> = {
  default: { color: Colors.textSecondary },
  success: { color: Colors.success },
  warning: { color: Colors.warning },
  error: { color: Colors.error },
  info: { color: Colors.info },
};

export function Badge({ children, variant = 'default', style }: BadgeProps) {
  return (
    <View style={[styles.base, bgStyles[variant], style]}>
      <Text style={[styles.text, textStyles[variant]]}>{children}</Text>
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
