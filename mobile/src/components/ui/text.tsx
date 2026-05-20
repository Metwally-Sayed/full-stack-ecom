import { Text as RNText, StyleSheet, type StyleProp, type TextStyle } from 'react-native';
import { Colors } from '@/constants/colors';
import { lightColors, type AppColors } from '@/constants/palette';
import { FontSize } from '@/constants/spacing';
import { useThemeColors } from '@/stores/theme-store';

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'bodySmall' | 'caption' | 'label';

type TextProps = {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
};

const variantStyles: Record<TextVariant, TextStyle> = {
  h1: { fontSize: FontSize['3xl'], fontWeight: '700', lineHeight: 36 },
  h2: { fontSize: FontSize['2xl'], fontWeight: '700', lineHeight: 30 },
  h3: { fontSize: FontSize.xl, fontWeight: '600', lineHeight: 26 },
  body: { fontSize: FontSize.base, fontWeight: '400', lineHeight: 22 },
  bodySmall: { fontSize: FontSize.sm, fontWeight: '400', lineHeight: 20 },
  caption: { fontSize: FontSize.xs, fontWeight: '400', color: Colors.textSecondary },
  label: { fontSize: FontSize.sm, fontWeight: '600', lineHeight: 18 },
};

function resolveColor(color: string | undefined, colors: AppColors) {
  if (!color) return colors.text;

  const paletteEntry = Object.entries(lightColors).find(([, value]) => value === color);
  if (!paletteEntry) return color;

  return colors[paletteEntry[0] as keyof AppColors];
}

export function Text({ children, variant = 'body', color, style, numberOfLines }: TextProps) {
  const colors = useThemeColors();
  const textColor = color
    ? resolveColor(color, colors)
    : variant === 'caption'
      ? colors.textSecondary
      : colors.text;

  return (
    <RNText
      style={[styles.base, variantStyles[variant], { color: textColor }, style]}
      numberOfLines={numberOfLines}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: { color: Colors.text },
});
