import { StyleSheet, View, type ViewStyle } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Text } from './text';
import { Button } from './button';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconWrapper}>
        <Icon size={40} color={Colors.textMuted} />
      </View>
      <Text variant="h3" style={styles.title}>{title}</Text>
      {description ? (
        <Text variant="body" style={styles.description}>{description}</Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button onPress={onAction} variant="primary" style={styles.action}>
          {actionLabel}
        </Button>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['2xl'],
    gap: Spacing.md,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.backgroundElement,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  title: { textAlign: 'center' },
  description: { textAlign: 'center', color: Colors.textSecondary },
  action: { marginTop: Spacing.sm },
});
