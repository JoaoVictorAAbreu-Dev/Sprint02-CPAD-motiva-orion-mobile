import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Card } from '../../../components/Card';
import { Screen } from '../../../components/Screen';
import { SectionHeader } from '../../../components/SectionHeader';
import { StatChip } from '../../../components/StatChip';
import { StatusBadge } from '../../../components/StatusBadge';
import { useAppContext } from '../../../context/AppContext';
import { MainTabParamList, RootStackParamList } from '../../../types/navigation';
import { palette } from '../../../theme/palette';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Dashboard'>,
  NativeStackScreenProps<RootStackParamList>
>;

const formatDateTime = (value?: string) => {
  if (!value) return '-';
  return new Date(value).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export function DashboardScreen({ navigation }: Props) {
  const { trechos, inspecoes, loading } = useAppContext();

  const normal = trechos.filter((trecho) => trecho.status === 'Normal').length;
  const atencao = trechos.filter((trecho) => trecho.status === 'Atenção').length;
  const critico = trechos.filter((trecho) => trecho.status === 'Crítico').length;
  const totalPendencias = atencao + critico;
  const lastInspection = inspecoes[0];

  return (
    <Screen>
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.brandMark} />
          <StatusBadge label="Operação de campo" tone="primary" />
        </View>
        <Text style={styles.kicker}>CCR Motiva</Text>
        <Text style={styles.title}>Motiva ORION Mobile</Text>
        <Text style={styles.description}>
          Gestão de inspeções, vegetação rodoviária e ocorrências em campo com visão executiva e operação rápida.
        </Text>
      </View>

      <Card title="Resumo operacional" subtitle="Visão consolidada dos trechos monitorados" accentColor={palette.primary}>
        <View style={styles.metricsGrid}>
          <StatChip label="Trechos" value={trechos.length} accent={palette.primary} />
          <StatChip label="Inspeções" value={loading ? '...' : inspecoes.length} accent={palette.success} />
          <StatChip label="Pendências" value={totalPendencias} accent={palette.warning} />
          <StatChip label="Críticos" value={critico} accent={palette.danger} />
        </View>
      </Card>

      <Card title="Status da malha" subtitle="Distribuição por condição operacional" accentColor={palette.success}>
        <View style={styles.statusRow}>
          <StatusBadge label={`${normal} normais`} tone="success" />
          <StatusBadge label={`${atencao} em atenção`} tone="warning" />
          <StatusBadge label={`${critico} críticos`} tone="danger" />
        </View>
      </Card>

      <SectionHeader title="Acesso rápido" subtitle="Rotas principais para equipe de campo" />
      <View style={styles.quickActions}>
        <Pressable style={styles.primaryAction} onPress={() => navigation.navigate('Trechos')}>
          <Text style={styles.primaryActionTitle}>Abrir trechos</Text>
          <Text style={styles.primaryActionText}>Selecionar faixa, ver ocorrências e iniciar inspeção.</Text>
        </Pressable>
        <Pressable style={styles.secondaryAction} onPress={() => navigation.navigate('Inspecao')}>
          <Text style={styles.secondaryActionTitle}>Nova inspeção</Text>
          <Text style={styles.secondaryActionText}>Registrar observação e foto diretamente em campo.</Text>
        </Pressable>
      </View>

      <Card title="Última atividade" subtitle="Registro mais recente sincronizado" accentColor={palette.primary}>
        {lastInspection ? (
          <View style={styles.activityBlock}>
            <Text style={styles.activityTitle}>{lastInspection.responsavel}</Text>
            <Text style={styles.activityText}>Trecho: {lastInspection.trechoId}</Text>
            <Text style={styles.activityText}>Risco: {lastInspection.risco}</Text>
            <Text style={styles.activityText}>Data: {formatDateTime(lastInspection.data)}</Text>
          </View>
        ) : (
          <Text style={styles.activityText}>Nenhuma inspeção registrada ainda.</Text>
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingBottom: 4
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  brandMark: {
    width: 52,
    height: 6,
    borderRadius: 999,
    backgroundColor: palette.primary
  },
  kicker: {
    color: palette.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontSize: 12,
    marginBottom: 6
  },
  title: {
    color: palette.text,
    fontSize: 30,
    fontWeight: '900',
    marginBottom: 10
  },
  description: {
    color: palette.textMuted,
    lineHeight: 22,
    maxWidth: 560
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  quickActions: {
    gap: 12
  },
  primaryAction: {
    backgroundColor: palette.primary,
    borderRadius: 20,
    padding: 18
  },
  primaryActionTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 6
  },
  primaryActionText: {
    color: 'rgba(248, 250, 252, 0.9)',
    lineHeight: 20
  },
  secondaryAction: {
    backgroundColor: palette.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: palette.border
  },
  secondaryActionTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 6
  },
  secondaryActionText: {
    color: palette.textMuted,
    lineHeight: 20
  },
  activityBlock: {
    gap: 4
  },
  activityTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4
  },
  activityText: {
    color: palette.textMuted,
    lineHeight: 20
  }
});
