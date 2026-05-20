import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { FontSize, Spacing } from '@/constants/spacing';
import { useThemeColors } from '@/stores/theme-store';
import type { Category } from '@/types/category';

type CategoryTabsProps = {
  categories: Category[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
};

export function CategoryTabs({ categories, selected, onSelect }: CategoryTabsProps) {
  const colors = useThemeColors();
  const allTab = { id: 'all', name: 'All', slug: null as null };
  const tabs = [allTab, ...categories.map((c) => ({ ...c, slug: c.slug as string | null }))];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {tabs.map((tab) => {
        const isActive = tab.slug === selected;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => onSelect(tab.slug)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                { color: isActive ? colors.primary : colors.textSecondary },
                isActive && styles.tabTextActive,
              ]}
            >
              {tab.name}
            </Text>
            {isActive && <View style={[styles.indicator, { backgroundColor: colors.primary }]} />}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
  },
  tab: {
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.xs + 2,
    paddingBottom: Spacing.xs,
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  tabText: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  tabTextActive: {
    fontWeight: '700',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: Spacing.sm,
    right: Spacing.sm,
    height: 2,
    borderRadius: 2,
  },
});
