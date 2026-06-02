import React from 'react';
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

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

export function DetalheTrechoScreen({ route, navigation }: Props) {
  const { getTrechoById, getOcorrenciasByTrechoId, inspecoes } = useAppContext();
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
  const trechosInspecoes = inspecoes.filter((inspecao) => inspecao.trechoId === trecho.id);
  const ultimaInspecao = trechosInspecoes[0];

  return (
    <Screen>
      <SectionHeader title="Detalhes do trecho" subtitle="Visão operacional com indicadores, inspeções e ocorrências." />

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
          <Text style={styles.meta}>Última intervenção: {trecho.ultimaIntervencao}</Text>
        </View>

        <View style={styles.metricsGrid}>
          <StatChip label="Ocorrências" value={ocorrencias.length} accent={palette.warning} />
          <StatChip label="Inspeções" value={trechosInspecoes.length} accent={palette.primary} />
          <StatChip label="Faixa" value={`km ${trecho.kmInicial.toFixed(1)}`} accent={palette.success} />
          <StatChip label="Até" value={`km ${trecho.kmFinal.toFixed(1)}`} accent={palette.danger} />
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
            <Text style={styles.detailText}>Data: {formatDate(ultimaInspecao.data)}</Text>
            <Text style={styles.detailText}>{ultimaInspecao.observacao}</Text>
          </View>
        ) : (
          <Text style={styles.detailText}>Ainda não há inspeções registradas para este trecho.</Text>
        )}
      </Card>

      <Card title="Ocorrências relacionadas" subtitle="Situações vinculadas à vegetação deste trecho" accentColor={palette.warning}>
        <FlatList
          data={ocorrencias}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <View style={styles.occurrenceItem}>
              <View style={styles.occurrenceHeader}>
                <Text style={styles.occurrenceType}>{item.tipo}</Text>
                <StatusBadge label={item.status} tone={toneByOccurrence[item.status]} />
              </View>
              <Text style={styles.occurrenceText}>{item.descricao}</Text>
              <Text style={styles.occurrenceMeta}>{formatDate(item.data)}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.detailText}>Nenhuma ocorrência vinculada a este trecho.</Text>}
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
  occurrenceItem: {
    gap: 8
  },
  occurrenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10
  },
  occurrenceType: {
    flex: 1,
    color: palette.text,
    fontWeight: '800'
  },
  occurrenceText: {
    color: palette.textMuted,
    lineHeight: 20
  },
  occurrenceMeta: {
    color: palette.textMuted,
    fontSize: 12
  }
});
