import React, { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppButton } from '../../../components/AppButton';
import { Card } from '../../../components/Card';
import { LoadingState } from '../../../components/LoadingState';
import { Screen } from '../../../components/Screen';
import { SectionHeader } from '../../../components/SectionHeader';
import { StatChip } from '../../../components/StatChip';
import { StatusBadge } from '../../../components/StatusBadge';
import { useAppContext } from '../../../context/AppContext';
import { getOperationalRecommendations } from '../../../services/operationalPriority';
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
  const { trechos, ocorrencias, inspecoes, loading, reloadAppState } = useAppContext();
  const [refreshing, setRefreshing] = useState(false);
  const recommendations = useMemo(
    () => getOperationalRecommendations(trechos, ocorrencias, inspecoes).slice(0, 3),
    [inspecoes, ocorrencias, trechos]
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await reloadAppState();
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <Screen>
        <LoadingState label="Carregando painel operacional..." />
      </Screen>
    );
  }

  const normal = trechos.filter((trecho) => trecho.status === 'Normal').length;
  const atencao = trechos.filter((trecho) => trecho.status === 'Atenção').length;
  const critico = trechos.filter((trecho) => trecho.status === 'Crítico').length;
  const totalPendencias = atencao + critico;
  const lastInspection = inspecoes[0];

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={palette.primary} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <View style={styles.brandMark} />
            <StatusBadge label="Operação de campo" tone="primary" />
          </View>
          <Text style={styles.kicker}>CCR Motiva</Text>
          <Text style={styles.title}>Motiva ORION Mobile</Text>
          <Text style={styles.description}>
            Gestão operacional da vegetação rodoviária com foco em inspeções, priorização de trechos e resposta rápida em
            campo.
          </Text>
        </View>

        <Card title="Resumo operacional" subtitle="Visão consolidada dos trechos monitorados" accentColor={palette.primary}>
          <View style={styles.metricsGrid}>
            <StatChip label="Trechos" value={trechos.length} accent={palette.primary} />
            <StatChip label="Inspeções" value={inspecoes.length} accent={palette.success} />
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

        <Card title="Prioridade ORION" subtitle="Trechos sugeridos para ação imediata" accentColor={palette.warning}>
          {recommendations.length ? (
            <View style={styles.recommendations}>
              {recommendations.map((item, index) => (
                <View key={item.trecho.id} style={styles.recommendationItem}>
                  <View style={styles.recommendationTopRow}>
                    <View style={styles.rankBadge}>
                      <Text style={styles.rankText}>#{index + 1}</Text>
                    </View>
                    <StatusBadge
                      label={`${item.score} pontos`}
                      tone={item.trecho.status === 'Crítico' ? 'danger' : item.trecho.status === 'Atenção' ? 'warning' : 'success'}
                    />
                  </View>
                  <Text style={styles.recommendationTitle}>{item.trecho.nome}</Text>
                  <Text style={styles.recommendationMeta}>
                    {item.trecho.rodovia} • km {item.trecho.km.toFixed(1)}
                  </Text>
                  <Text style={styles.recommendationReason}>{item.headline}</Text>
                  <Text style={styles.recommendationReason}>{item.reason}</Text>
                  <Text style={styles.recommendationAction}>{item.nextAction}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.activityText}>Nenhum trecho disponível para priorização.</Text>
          )}
        </Card>

        <SectionHeader title="Acesso rápido" subtitle="Rotas principais para equipe de campo" />
        <View style={styles.quickActions}>
          <AppButton
            label="Abrir trechos"
            onPress={() => navigation.navigate('Trechos')}
            accessibilityHint="Abre a lista de trechos monitorados."
          />
          <AppButton
            label="Nova inspeção"
            variant="secondary"
            onPress={() => navigation.navigate('Inspecao')}
            accessibilityHint="Abre o formulário de registro de inspeção."
          />
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
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    gap: 16,
    paddingBottom: 24
  },
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
  recommendations: {
    gap: 12
  },
  recommendationItem: {
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surfaceElevated,
    gap: 6
  },
  recommendationTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.35)'
  },
  rankText: {
    color: palette.text,
    fontWeight: '900'
  },
  recommendationTitle: {
    color: palette.text,
    fontWeight: '900',
    fontSize: 15
  },
  recommendationMeta: {
    color: palette.textMuted,
    lineHeight: 18
  },
  recommendationReason: {
    color: palette.textMuted,
    lineHeight: 19
  },
  recommendationAction: {
    color: palette.text,
    fontWeight: '800',
    marginTop: 2
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
