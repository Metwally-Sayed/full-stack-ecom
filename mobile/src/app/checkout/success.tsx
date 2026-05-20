import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { CheckCircle } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { shortenId } from '@/lib/format';

export default function CheckoutSuccessScreen() {
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <CheckCircle size={72} color={Colors.success} />
        </View>

        <Text variant="h2" style={styles.title}>Order Placed!</Text>
        <Text variant="body" color={Colors.textSecondary} style={styles.subtitle}>
          Your order has been successfully placed and is being processed.
        </Text>

        {orderId ? (
          <View style={styles.orderIdBadge}>
            <Text variant="label" color={Colors.textSecondary}>Order ID</Text>
            <Text variant="h3" color={Colors.primary}>{shortenId(orderId)}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.actions}>
        <Button
          onPress={() => router.replace('/(tabs)/orders')}
          fullWidth
          size="lg"
        >
          View My Orders
        </Button>
        <Button
          onPress={() => router.replace('/(tabs)/shop')}
          variant="outline"
          fullWidth
          size="lg"
        >
          Continue Shopping
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
    padding: Spacing.base,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.base,
  },
  iconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  title: { textAlign: 'center' },
  subtitle: { textAlign: 'center', maxWidth: 280 },
  orderIdBadge: {
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 16,
    marginTop: Spacing.sm,
  },
  actions: { gap: Spacing.md, paddingBottom: Spacing.md },
});
