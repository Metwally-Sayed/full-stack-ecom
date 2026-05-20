import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Spacing } from '@/constants/spacing';
import { useThemeColors } from '@/stores/theme-store';

type ScreenProps = {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
};

export function Screen({
  children,
  scrollable = false,
  style,
  contentStyle,
  edges = ['top', 'left', 'right'],
}: ScreenProps) {
  const colors = useThemeColors();
  const backgroundStyle = { backgroundColor: colors.background };

  if (scrollable) {
    return (
      <SafeAreaView style={[styles.safeArea, backgroundStyle, style]} edges={edges}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, backgroundStyle, style]} edges={edges}>
      <View style={[styles.content, contentStyle]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.base,
  },
  content: {
    flex: 1,
    padding: Spacing.base,
  },
});
