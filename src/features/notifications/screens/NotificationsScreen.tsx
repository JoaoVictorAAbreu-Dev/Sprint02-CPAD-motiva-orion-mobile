import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { AppButton } from '../../../components/AppButton';
import { Card } from '../../../components/Card';
import { EmptyState } from '../../../components/EmptyState';
import { Screen } from '../../../components/Screen';
import { SectionHeader } from '../../../components/SectionHeader';
import { StatusBadge } from '../../../components/StatusBadge';
import { useAppContext } from '../../../context/AppContext';
import { navigate } from '../../../navigation/navigationRef';
import { RootStackParamList } from '../../../types/navigation';
import { palette } from '../../../theme/palette';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

const toneByType: Record<'info' | 'warning' | 'critical', 'primary' | 'warning' | 'danger'> = {
  info: 'primary',
  warning: 'warning',
  critical: 'danger'
};

export function NotificationsScreen({ navigation }: Props) {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useAppContext();

  return (
    <Screen showBackButton onBackPress={() => navigation.goBack()}>
      <SectionHeader
        title="Notificações"
        subtitle="Alertas operacionais e eventos recentes da base local."
      />

      <View style={styles.actionsRow}>
        <AppButton
          label="Marcar todas como lidas"
          variant="secondary"
          onPress={markAllNotificationsAsRead}
        />
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={item.title}
            onPress={async () => {
              if (!item.read) {
                await markNotificationAsRead(item.id);
              }

              if (item.targetTrechoId) {
                navigate('DetalheTrecho', { trechoId: item.targetTrechoId });
              }
            }}
          >
            <Card
              title={item.title}
              subtitle={item.message}
              accentColor={item.type === 'critical' ? palette.danger : item.type === 'warning' ? palette.warning : palette.primary}
            >
              <View style={styles.metaRow}>
                <StatusBadge
                  label={item.read ? 'Lida' : 'Nova'}
                  tone={item.read ? 'success' : toneByType[item.type]}
                />
                <Text style={styles.meta}>{new Date(item.createdAt).toLocaleString('pt-BR')}</Text>
              </View>
            </Card>
          </Pressable>
        )}
        ListEmptyComponent={
          <EmptyState
            title="Sem notificações"
            description="Novos eventos operacionais aparecerão aqui."
          />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  actionsRow: {
    gap: 12
  },
  listContent: {
    gap: 12,
    paddingBottom: 24
  },
  metaRow: {
    gap: 8
  },
  meta: {
    color: palette.textMuted
  }
});
