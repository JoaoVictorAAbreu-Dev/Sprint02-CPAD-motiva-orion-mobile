import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Card } from '../../../components/Card';
import { Screen } from '../../../components/Screen';
import { SectionHeader } from '../../../components/SectionHeader';
import { useAppContext } from '../../../context/AppContext';
import { RootStackParamList } from '../../../types/navigation';
import { palette } from '../../../theme/palette';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: Props) {
  const { settings, updateSettings } = useAppContext();

  return (
    <Screen showBackButton onBackPress={() => navigation.goBack()}>
      <SectionHeader
        title="Configurações"
        subtitle="Preferências operacionais e comportamento do aplicativo."
      />

      <Card title="Preferências" subtitle="Ajustes persistidos localmente" accentColor={palette.primary}>
        <SettingRow
          title="Alertas operacionais"
          description="Gera notificações quando novas inspeções elevam o nível de atenção do trecho."
          value={settings.operationalAlertsEnabled}
          onValueChange={(value) => updateSettings({ operationalAlertsEnabled: value })}
        />

        <SettingRow
          title="Confirmar ao sair da inspeção"
          description="Exibe confirmação ao abandonar um formulário com dados não salvos."
          value={settings.confirmInspectionDiscard}
          onValueChange={(value) => updateSettings({ confirmInspectionDiscard: value })}
        />

        <SettingRow
          title="Badge de notificações"
          description="Exibe contador de notificações não lidas no cabeçalho."
          value={settings.showUnreadBadge}
          onValueChange={(value) => updateSettings({ showUnreadBadge: value })}
        />
      </Card>
    </Screen>
  );
}

function SettingRow({
  title,
  description,
  value,
  onValueChange
}: {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: palette.border, true: 'rgba(37, 99, 235, 0.4)' }}
        thumbColor={value ? palette.primary : '#D1D5DB'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: palette.border
  },
  textBlock: {
    flex: 1,
    gap: 4
  },
  title: {
    color: palette.text,
    fontWeight: '900'
  },
  description: {
    color: palette.textMuted,
    lineHeight: 18
  }
});
