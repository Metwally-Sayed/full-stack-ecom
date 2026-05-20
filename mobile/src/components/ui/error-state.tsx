import { StyleSheet, View, type ViewStyle } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { Text } from './text';
import { Button } from './button';
import { Spacing } from '@/constants/spacing';
import { useThemeColors } from '@/stores/theme-store';

type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
  style?: ViewStyle;
};

export function ErrorState({
  message = 'Something went wrong',
  onRetry,
  style,
}: ErrorStateProps) {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconWrapper, { backgroundColor: colors.errorLight }]}>
        <AlertCircle size={40} color={colors.error} />
      </View>
      <Text variant="h3" style={styles.title}>Oops!</Text>
      <Text variant="body" style={[styles.message, { color: colors.textSecondary }]}>
        {message}
      </Text>
      {onRetry ? (
        <Button onPress={onRetry} variant="outline" style={styles.retryBtn}>
          Try Again
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  title: { textAlign: 'center' },
  message: { textAlign: 'center' },
  retryBtn: { marginTop: Spacing.sm },
});
