import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { LogOut, HelpCircle, FileText, Info } from 'lucide-react-native';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { ProfileHeader } from '@/components/profile/profile-header';
import { Colors } from '@/constants/colors';
import { BorderRadius, FontSize, Spacing } from '@/constants/spacing';
import { useAuthStore } from '@/stores/auth-store';
import Constants from 'expo-constants';

type RowProps = { icon: React.ReactNode; label: string; onPress?: () => void; danger?: boolean };

function Row({ icon, label, onPress, danger }: RowProps) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.rowIcon}>{icon}</View>
      <Text style={[styles.rowLabel, danger && styles.danger]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  function handleLogout() {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          Toast.show({ type: 'success', text1: 'Logged out' });
          router.replace('/(auth)/login');
        },
      },
    ]);
  }

  if (!user) return null;

  return (
    <Screen scrollable style={styles.screen}>
      <ProfileHeader user={user} />

      <Card style={styles.section}>
        <Row
          icon={<HelpCircle size={18} color={Colors.textSecondary} />}
          label="Help & Support"
          onPress={() => {}}
        />
        <View style={styles.divider} />
        <Row
          icon={<FileText size={18} color={Colors.textSecondary} />}
          label="Terms & Privacy"
          onPress={() => {}}
        />
        <View style={styles.divider} />
        <Row
          icon={<Info size={18} color={Colors.textSecondary} />}
          label={`App Version ${Constants.expoConfig?.version ?? '1.0.0'}`}
        />
      </Card>

      <Card style={styles.section}>
        <Row
          icon={<LogOut size={18} color={Colors.error} />}
          label="Log Out"
          onPress={handleLogout}
          danger
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: Colors.backgroundSecondary },
  section: { marginBottom: Spacing.base, padding: 0 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  rowIcon: { width: 24, alignItems: 'center' },
  rowLabel: { fontSize: FontSize.base, color: Colors.text },
  danger: { color: Colors.error },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: Spacing.base + 24 + Spacing.md },
});
