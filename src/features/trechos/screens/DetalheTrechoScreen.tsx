import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Card } from '../../../components/Card';
import { Screen } from '../../../components/Screen';
import { SectionHeader } from '../../../components/SectionHeader';
import { StatusBadge } from '../../../components/StatusBadge';
import { StatChip } from '../../../components/StatChip';
import { useAppContext } from '../../../context/AppContext';
import { RootStackParamList } from '../../../types/navigation';
import { palette } from '../../../theme/palette';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalheTrecho'>;

const toneByStatus: Record<'Normal' | 'Atenção' | 'Crítico', 'success' | 'warning' | 'danger'> = {
  Normal: 'success',
  Atenção: 'warning',
  Crítico: 'danger'
};

const toneByOccurrence: Record<'Aberta' | 'Em atendimento' | 'Resolvida', 'warning' | 'primary' | 'success'> = {
  Aberta: 'warning',
  'Em atendimento': 'primary',
  Resolvida: 'success'
};

const toneColors = {
  primary: palette.primary,
  success: palette.success,
  warning: palette.warning,
  danger: palette.danger
} as const;

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

type TimelineItem =
  | { id: string; type: 'inspecao'; date: string; title: string; subtitle: string; tone: 'primary' | 'success' | 'warning' }
  | { id: string; type: 'ocorrencia'; date: string; title: string; subtitle: string; tone: 'primary' | 'success' | 'warning' };

export function DetalheTrechoScreen({ route, navigation }: Props) {
  const { getTrechoById, getOcorrenciasByTrechoId, getInspecoesByTrechoId } = useAppContext();
  const trecho = getTrechoById(route.params.trechoId);

  if (!trecho) {
    return (
      <Screen>
        <Card title="Trecho não encontrado" subtitle="O trecho selecionado não existe mais na base local.">
          <Pressable style={styles.primaryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.primaryButtonText}>Voltar</Text>
          </Pressable>
        </Card>
      </Screen>
    );
  }

  const ocorrencias = getOcorrenciasByTrechoId(trecho.id);
  const inspecoes = getInspecoesByTrechoId(trecho.id);
  const ultimaInspecao = inspecoes[0];

  const timeline = useMemo<TimelineItem[]>(() => {
    const inspectionItems: TimelineItem[] = inspecoes.map((item) => ({
      id: item.id,
      type: 'inspecao' as const,
      date: item.data,
      title: `Inspeção - ${item.responsavel}`,
      subtitle: `${item.risco} • ${item.observacao}`,
      tone: item.risco === 'Alto' ? 'warning' : item.risco === 'Médio' ? 'primary' : 'success'
    }));

    const occurrenceItems: TimelineItem[] = ocorrencias.map((item) => ({
      id: item.id,
      type: 'ocorrencia' as const,
      date: item.data,
      title: item.tipo,
      subtitle: item.descricao,
      tone: toneByOccurrence[item.status]
    }));

    return [...inspectionItems, ...occurrenceItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [inspecoes, ocorrencias]);

  return (
    <Screen>
      <SectionHeader title="Detalhes do trecho" subtitle="Visão operacional com indicadores, histórico e ocorrências." />

      <Card
        title={trecho.nome}
        subtitle={`${trecho.rodovia} • km ${trecho.km.toFixed(1)} • prioridade ${trecho.prioridade}`}
        eyebrow={trecho.id.toUpperCase()}
        accentColor={
          trecho.status === 'Normal' ? palette.success : trecho.status === 'Atenção' ? palette.warning : palette.danger
        }
      >
        <View style={styles.heroInfo}>
          <StatusBadge label={trecho.status} tone={toneByStatus[trecho.status]} />
          <Text style={styles.meta}>Vegetação: {trecho.nivelVegetacao}</Text>
          <Text style={styles.meta}>Última intervenção: {formatDate(trecho.ultimaIntervencao)}</Text>
        </View>

        <View style={styles.metricsGrid}>
          <StatChip label="Ocorrências" value={ocorrencias.length} accent={palette.warning} />
          <StatChip label="Inspeções" value={inspecoes.length} accent={palette.primary} />
          <StatChip label="Faixa inicial" value={`km ${trecho.kmInicial.toFixed(1)}`} accent={palette.success} />
          <StatChip label="Faixa final" value={`km ${trecho.kmFinal.toFixed(1)}`} accent={palette.danger} />
        </View>
      </Card>

      <Card title="Ações operacionais" subtitle="Próximo passo recomendado" accentColor={palette.primary}>
        <View style={styles.actionGroup}>
          <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('Inspecao', { trechoId: trecho.id })}>
            <Text style={styles.primaryButtonText}>Iniciar inspeção</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.secondaryButtonText}>Voltar à lista</Text>
          </Pressable>
        </View>
      </Card>

      <Card title="Última inspeção" subtitle="Registro mais recente para este trecho" accentColor={palette.success}>
        {ultimaInspecao ? (
          <View style={styles.detailStack}>
            <Text style={styles.detailTitle}>{ultimaInspecao.responsavel}</Text>
            <Text style={styles.detailText}>Risco: {ultimaInspecao.risco}</Text>
            <Text style={styles.detailText}>Data: {formatDateTime(ultimaInspecao.data)}</Text>
            <Text style={styles.detailText}>{ultimaInspecao.observacao}</Text>
          </View>
        ) : (
          <Text style={styles.detailText}>Ainda não há inspeções registradas para este trecho.</Text>
        )}
      </Card>

      <Card title="Linha do tempo" subtitle="Inspeções e ocorrências em ordem cronológica" accentColor={palette.warning}>
        <FlatList
          data={timeline}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
              <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: toneColors[item.tone] }]} />
              <View style={styles.timelineContent}>
                <View style={styles.timelineHeader}>
                  <Text style={styles.timelineTitle}>{item.title}</Text>
                  <StatusBadge label={item.type === 'inspecao' ? 'Inspeção' : 'Ocorrência'} tone={item.tone} />
                </View>
                <Text style={styles.timelineText}>{item.subtitle}</Text>
                <Text style={styles.timelineMeta}>{formatDateTime(item.date)}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.detailText}>Nenhum histórico disponível para este trecho.</Text>}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroInfo: {
    gap: 8,
    marginBottom: 14
  },
  meta: {
    color: palette.textMuted,
    lineHeight: 20
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12
  },
  actionGroup: {
    gap: 12
  },
  primaryButton: {
    backgroundColor: palette.primary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center'
  },
  primaryButtonText: {
    color: '#F8FAFC',
    fontWeight: '900'
  },
  secondaryButton: {
    backgroundColor: palette.surfaceElevated,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border
  },
  secondaryButtonText: {
    color: palette.text,
    fontWeight: '800'
  },
  detailStack: {
    gap: 6
  },
  detailTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '800'
  },
  detailText: {
    color: palette.textMuted,
    lineHeight: 20
  },
  separator: {
    height: 12
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginTop: 5
  },
  timelineContent: {
    flex: 1,
    gap: 6
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10
  },
  timelineTitle: {
    flex: 1,
    color: palette.text,
    fontWeight: '800'
  },
  timelineText: {
    color: palette.textMuted,
    lineHeight: 20
  },
  timelineMeta: {
    color: palette.textMuted,
    fontSize: 12
  }
});
