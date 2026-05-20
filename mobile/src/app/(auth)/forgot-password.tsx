import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Toast from 'react-native-toast-message';
import { CheckCircle } from 'lucide-react-native';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { forgotPassword } from '@/services/auth.service';
import { getErrorMessage } from '@/lib/api';

const schema = z.object({ email: z.string().email('Enter a valid email') });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordScreen() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      await forgotPassword(data);
      setSent(true);
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Failed', text2: getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <Screen style={styles.kav} contentStyle={styles.center}>
        <CheckCircle size={56} color={Colors.success} />
        <Text variant="h3" style={styles.centered}>Check your email</Text>
        <Text variant="body" color={Colors.textSecondary} style={styles.centered}>
          Password reset instructions have been sent to your email address.
        </Text>
        <Button onPress={() => router.back()} variant="outline" style={styles.btn}>
          Back to Login
        </Button>
      </Screen>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.kav}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text variant="h2">Reset Password</Text>
            <Text variant="body" color={Colors.textSecondary}>
              Enter your email and we&apos;ll send you a reset link.
            </Text>
          </View>
          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  placeholder="you@example.com"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  error={errors.email?.message}
                />
              )}
            />
            <Button onPress={handleSubmit(onSubmit)} loading={loading} fullWidth size="lg">
              Send Reset Link
            </Button>
            <Button onPress={() => router.back()} variant="ghost" fullWidth>
              Back to Login
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  kav: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1 },
  content: { flexGrow: 1, padding: Spacing.base, gap: Spacing['2xl'] },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.base },
  centered: { textAlign: 'center' },
  header: { gap: Spacing.sm },
  form: { gap: Spacing.base },
  btn: { marginTop: Spacing.sm },
});
