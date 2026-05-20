import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Toast from 'react-native-toast-message';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { register } from '@/services/auth.service';
import { saveAccessToken, saveRefreshToken } from '@/lib/storage';
import { getErrorMessage } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { useThemeColors } from '@/stores/theme-store';

const schema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterScreen() {
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);
  const colors = useThemeColors();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      const res = await register({ name: data.name, email: data.email, password: data.password });
      await saveAccessToken(res.accessToken);
      if (res.refreshToken) await saveRefreshToken(res.refreshToken);
      setUser(res.user);
      Toast.show({ type: 'success', text1: 'Welcome!', text2: `Account created for ${res.user.name}` });
      router.replace('/(tabs)/shop');
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Registration failed', text2: getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.kav, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text variant="h2">Create Account</Text>
            <Text variant="body" color={Colors.textSecondary}>
              Join Mini Shop today
            </Text>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input label="Full Name" placeholder="John Doe" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.name?.message} autoComplete="name" />
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input label="Email" placeholder="you@example.com" value={value} onChangeText={onChange} onBlur={onBlur} keyboardType="email-address" error={errors.email?.message} autoComplete="email" />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input label="Password" placeholder="Min 8 characters" value={value} onChangeText={onChange} onBlur={onBlur} secure error={errors.password?.message} />
              )}
            />
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input label="Confirm Password" placeholder="Repeat password" value={value} onChangeText={onChange} onBlur={onBlur} secure error={errors.confirmPassword?.message} />
              )}
            />
            <Button onPress={handleSubmit(onSubmit)} loading={loading} fullWidth size="lg" style={styles.btn}>
              Create Account
            </Button>
          </View>

          <View style={styles.footer}>
            <Text variant="body" color={Colors.textSecondary}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text variant="body" color={Colors.primary} style={{ fontWeight: '700' }}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  kav: { flex: 1 },
  safe: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.base,
    gap: Spacing['2xl'],
  },
  header: { gap: Spacing.sm },
  form: { gap: Spacing.base },
  btn: { marginTop: Spacing.sm },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
});
