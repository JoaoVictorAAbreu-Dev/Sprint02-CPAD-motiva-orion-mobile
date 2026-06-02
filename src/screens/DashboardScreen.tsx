import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { StatChip } from '../components/StatChip';
import { useAppContext } from '../context/AppContext';
import { RootStackParamList } from '../types/navigation';
import { palette } from '../theme/palette';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export function DashboardScreen({ navigation }: Props) {
  const { trechos, inspecoes, loading } = useAppContext();

  const pendencias = trechos.filter((trecho) => trecho.status === 'Pendência').length;
  const emInspecao = trechos.filter((trecho) => trecho.status === 'Em inspeção').length;

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.kicker}>CCR Motiva</Text>
        <Text style={styles.title}>Motiva ORION Mobile</Text>
        <Text style={styles.description}>
          Registro de inspeções e acompanhamento da vegetação rodoviária em campo.
        </Text>
      </View>

      <View style={styles.statsRow}>
        <StatChip label="Trechos" value={trechos.length} />
        <StatChip label="Inspeções" value={loading ? '...' : inspecoes.length} />
        <StatChip label="Pendências" value={pendencias} />
        <StatChip label="Em inspeção" value={emInspecao} />
      </View>

      <Card title="Acesso rápido" subtitle="Fluxos principais da operação">
        <Pressable style={styles.actionButton} onPress={() => navigation.navigate('Trechos')}>
          <Text style={styles.actionText}>Ver trechos</Text>
        </Pressable>
        <Pressable style={styles.actionButtonSecondary} onPress={() => navigation.navigate('Inspecao')}>
          <Text style={styles.actionTextSecondary}>Nova inspeção</Text>
        </Pressable>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginBottom: 16
  },
  kicker: {
    color: palette.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontSize: 12,
    marginBottom: 6
  },
  title: {
    color: palette.text,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8
  },
  description: {
    color: palette.textMuted,
    lineHeight: 22
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12
  },
  actionButton: {
    backgroundColor: palette.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10
  },
  actionText: {
    color: '#04110A',
    fontWeight: '800'
  },
  actionButtonSecondary: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border
  },
  actionTextSecondary: {
    color: palette.text,
    fontWeight: '700'
  }
});
