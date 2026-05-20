import { StyleSheet, View } from 'react-native';
import { User } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { Colors } from '@/constants/colors';
import { FontSize, Spacing } from '@/constants/spacing';
import type { User as UserType } from '@/types/auth';

type ProfileHeaderProps = { user: UserType };

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <User size={36} color={Colors.primary} />
      </View>
      <View style={styles.info}>
        <Text variant="h3">{user.name}</Text>
        <Text variant="body" color={Colors.textSecondary}>{user.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{user.role}</Text>
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
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { gap: 4 },
  roleBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  roleText: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.primary, textTransform: 'capitalize' },
});
