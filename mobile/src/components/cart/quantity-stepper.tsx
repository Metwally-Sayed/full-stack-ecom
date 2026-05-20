import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { Colors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/spacing';

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
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.btn, value <= min && styles.btnDisabled]}
        onPress={onDecrease}
        disabled={value <= min}
        hitSlop={6}
      >
        <Minus size={14} color={value <= min ? Colors.textMuted : Colors.primary} />
      </TouchableOpacity>
      <Text style={styles.value}>{value}</Text>
      <TouchableOpacity
        style={[styles.btn, value >= max && styles.btnDisabled]}
        onPress={onIncrease}
        disabled={value >= max}
        hitSlop={6}
      >
        <Plus size={14} color={value >= max ? Colors.textMuted : Colors.primary} />
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
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  btn: {
    padding: Spacing.xs + 2,
    backgroundColor: Colors.backgroundElement,
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
