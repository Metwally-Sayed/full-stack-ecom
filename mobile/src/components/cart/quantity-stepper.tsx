import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { BorderRadius, FontSize, Spacing } from '@/constants/spacing';
import { useThemeColors } from '@/stores/theme-store';

type QuantityStepperProps = {
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
};

export function QuantityStepper({
  value,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
}: QuantityStepperProps) {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { borderColor: colors.border }]}>
      <TouchableOpacity
        style={[
          styles.btn,
          { backgroundColor: colors.backgroundElement },
          value <= min && styles.btnDisabled,
        ]}
        onPress={onDecrease}
        disabled={value <= min}
        hitSlop={6}
      >
        <Minus size={14} color={value <= min ? colors.textMuted : colors.primary} />
      </TouchableOpacity>
      <Text style={styles.value}>{value}</Text>
      <TouchableOpacity
        style={[
          styles.btn,
          { backgroundColor: colors.backgroundElement },
          value >= max && styles.btnDisabled,
        ]}
        onPress={onIncrease}
        disabled={value >= max}
        hitSlop={6}
      >
        <Plus size={14} color={value >= max ? colors.textMuted : colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  btn: {
    padding: Spacing.xs + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.4 },
  value: {
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.base,
    fontWeight: '600',
    minWidth: 36,
    textAlign: 'center',
  },
});
