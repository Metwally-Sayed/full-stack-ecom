import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { BorderRadius, FontSize, Spacing } from '@/constants/spacing';
import { useThemeColors } from '@/stores/theme-store';

type ProductSearchProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export function ProductSearch({
  value,
  onChangeText,
  placeholder = 'Search products…',
}: ProductSearchProps) {
  const colors = useThemeColors();

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.backgroundElement }]}>
      <Search size={18} color={colors.textMuted} style={styles.icon} />
      <TextInput
        style={[styles.input, { color: colors.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="never"
      />
      {value.length > 0 ? (
        <TouchableOpacity onPress={() => onChangeText('')} hitSlop={8}>
          <X size={16} color={colors.textMuted} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    gap: Spacing.sm,
  },
  icon: {},
  input: {
    flex: 1,
    fontSize: FontSize.sm,
    padding: 0,
  },
});
