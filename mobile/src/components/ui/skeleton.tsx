import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, type ViewStyle } from 'react-native';
import { BorderRadius } from '@/constants/spacing';
import { useThemeColors } from '@/stores/theme-store';

type SkeletonProps = {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
};

export function Skeleton({ width, height = 16, borderRadius = BorderRadius.md, style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.4)).current;
  const colors = useThemeColors();

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width: width ?? '100%', height, borderRadius, opacity, backgroundColor: colors.backgroundElement },
        style,
      ]}
    />
  );
}

export function SkeletonGroup({ children }: { children: React.ReactNode }) {
  return <View style={styles.group}>{children}</View>;
}

const styles = StyleSheet.create({
  skeleton: {},
  group: { gap: 8 },
});
