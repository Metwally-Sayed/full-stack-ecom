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
import { login } from '@/services/auth.service';
import { saveAccessToken, saveRefreshToken } from '@/lib/storage';
import { getErrorMessage } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type FormData = z.infer<typeof schema>;

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      const res = await login(data);

      if (res.user.role === 'admin') {
        Toast.show({
          type: 'error',
          text1: 'Access denied',
          text2: 'Please use a customer account for the mobile app',
        });
        return;
      }

      await saveAccessToken(res.accessToken);
      if (res.refreshToken) await saveRefreshToken(res.refreshToken);
      setUser(res.user);
      router.replace('/(tabs)/shop');
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Login failed', text2: getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
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
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>M</Text>
            </View>
            <Text variant="h2" style={styles.title}>Mini Shop</Text>
            <Text variant="body" color={Colors.textSecondary} style={styles.subtitle}>
              Your favourite products, delivered fast
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
                  autoComplete="email"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  placeholder="Your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secure
                  error={errors.password?.message}
                />
              )}
            />

            <TouchableOpacity
              onPress={() => router.push('/(auth)/forgot-password')}
              style={styles.forgotBtn}
            >
              <Text variant="bodySmall" color={Colors.primary}>Forgot password?</Text>
            </TouchableOpacity>

            <Button onPress={handleSubmit(onSubmit)} loading={loading} fullWidth size="lg">
              Sign In
            </Button>
          </View>

          <View style={styles.footer}>
            <Text variant="body" color={Colors.textSecondary}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text variant="body" color={Colors.primary} style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  kav: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1 },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.base,
    gap: Spacing['2xl'],
  },
  header: { alignItems: 'center', gap: Spacing.md },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { fontSize: 32, fontWeight: '800', color: Colors.white },
  title: { textAlign: 'center' },
  subtitle: { textAlign: 'center' },
  form: { gap: Spacing.base },
  forgotBtn: { alignSelf: 'flex-end' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  linkText: { fontWeight: '700' },
});
