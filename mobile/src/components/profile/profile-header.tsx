import { StyleSheet, View } from 'react-native';
import { User } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { FontSize, Spacing } from '@/constants/spacing';
import { useThemeColors } from '@/stores/theme-store';
import type { User as UserType } from '@/types/auth';

type ProfileHeaderProps = { user: UserType };

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View style={[styles.avatar, { backgroundColor: colors.primaryLight }]}>
        <User size={36} color={colors.primary} />
      </View>
      <View style={styles.info}>
        <Text variant="h3">{user.name}</Text>
        <Text variant="body" color={colors.textSecondary}>{user.email}</Text>
        <View style={[styles.roleBadge, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.roleText, { color: colors.primary }]}>{user.role}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    paddingVertical: Spacing.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { gap: 4 },
  roleBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  roleText: { fontSize: FontSize.xs, fontWeight: '600', textTransform: 'capitalize' },
});
