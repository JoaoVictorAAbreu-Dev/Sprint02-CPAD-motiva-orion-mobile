import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppButton } from '../../../components/AppButton';
import { Card } from '../../../components/Card';
import { EmptyState } from '../../../components/EmptyState';
import { LoadingState } from '../../../components/LoadingState';
import { Screen } from '../../../components/Screen';
import { SectionHeader } from '../../../components/SectionHeader';
import { StatusBadge } from '../../../components/StatusBadge';
import { useAppContext } from '../../../context/AppContext';
import { MainTabParamList, RootStackParamList } from '../../../types/navigation';
import { palette } from '../../../theme/palette';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Trechos'>,
  NativeStackScreenProps<RootStackParamList>
>;

const statusTone: Record<'Normal' | 'Atenção' | 'Crítico', 'success' | 'warning' | 'danger'> = {
  Normal: 'success',
  Atenção: 'warning',
  Crítico: 'danger'
};

const priorities = ['Todas', 'Baixa', 'Média', 'Alta'] as const;
const statuses = ['Todas', 'Normal', 'Atenção', 'Crítico'] as const;

export function TrechosScreen({ navigation }: Props) {
  const { trechos, ocorrencias, loading, reloadAppState } = useAppContext();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<(typeof statuses)[number]>('Todas');
  const [priorityFilter, setPriorityFilter] = useState<(typeof priorities)[number]>('Todas');
  const [rodoviaFilter, setRodoviaFilter] = useState('Todas');
  const [refreshing, setRefreshing] = useState(false);

  const rodovias = useMemo(() => ['Todas', ...Array.from(new Set(trechos.map((trecho) => trecho.rodovia)))], [trechos]);

  const filteredTrechos = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return trechos.filter((trecho) => {
      const matchesQuery =
        !normalizedQuery ||
        trecho.id.toLowerCase().includes(normalizedQuery) ||
        trecho.nome.toLowerCase().includes(normalizedQuery) ||
        trecho.rodovia.toLowerCase().includes(normalizedQuery) ||
        trecho.km.toFixed(1).includes(normalizedQuery);

      const matchesStatus = statusFilter === 'Todas' || trecho.status === statusFilter;
      const matchesPriority = priorityFilter === 'Todas' || trecho.prioridade === priorityFilter;
      const matchesRodovia = rodoviaFilter === 'Todas' || trecho.rodovia === rodoviaFilter;

      return matchesQuery && matchesStatus && matchesPriority && matchesRodovia;
    });
  }, [priorityFilter, query, rodoviaFilter, statusFilter, trechos]);

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
        <LoadingState label="Carregando trechos monitorados..." />
      </Screen>
    );
  }

  return (
    <Screen>
      <FlatList
        data={filteredTrechos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={palette.primary} />}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <SectionHeader
              title="Trechos"
              subtitle="Selecione uma faixa da rodovia para ver detalhes, ocorrências e iniciar inspeção."
            />

            <View style={styles.summaryBar}>
              <StatusBadge label={`${trechos.length} trechos monitorados`} tone="primary" />
              <StatusBadge label={`${ocorrencias.length} ocorrências`} tone="warning" />
            </View>

            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar por ID, km, rodovia ou nome"
              placeholderTextColor={palette.textMuted}
              style={styles.search}
              accessibilityLabel="Buscar trecho"
            />

            <View style={styles.filtersBlock}>
              <Text style={styles.filterLabel}>Status</Text>
              <View style={styles.chipsRow}>
                {statuses.map((item) => (
                  <FilterChip
                    key={item}
                    label={item}
                    active={statusFilter === item}
                    onPress={() => setStatusFilter(item)}
                  />
                ))}
              </View>

              <Text style={styles.filterLabel}>Prioridade</Text>
              <View style={styles.chipsRow}>
                {priorities.map((item) => (
                  <FilterChip
                    key={item}
                    label={item}
                    active={priorityFilter === item}
                    onPress={() => setPriorityFilter(item)}
                  />
                ))}
              </View>

              <Text style={styles.filterLabel}>Rodovia</Text>
              <View style={styles.chipsRow}>
                {rodovias.map((item) => (
                  <FilterChip
                    key={item}
                    label={item}
                    active={rodoviaFilter === item}
                    onPress={() => setRodoviaFilter(item)}
                  />
                ))}
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="Nenhum trecho encontrado"
            description="Ajuste os filtros ou a busca para localizar outro trecho."
            actionLabel="Limpar filtros"
            onAction={() => {
              setQuery('');
              setStatusFilter('Todas');
              setPriorityFilter('Todas');
              setRodoviaFilter('Todas');
            }}
          />
        }
        renderItem={({ item }) => {
          const trechoOcorrencias = ocorrencias.filter((ocorrencia) => ocorrencia.trechoId === item.id);

          return (
            <Card
              title={item.nome}
              subtitle={`${item.rodovia} • km ${item.km.toFixed(1)} | prioridade ${item.prioridade}`}
              eyebrow={item.id.toUpperCase()}
              accentColor={
                item.status === 'Normal' ? palette.success : item.status === 'Atenção' ? palette.warning : palette.danger
              }
              onPress={() => navigation.navigate('DetalheTrecho', { trechoId: item.id })}
              accessibilityHint="Abre o detalhe operacional do trecho."
            >
              <View style={styles.metaRow}>
                <StatusBadge label={item.status} tone={statusTone[item.status]} />
                <Text style={styles.meta}>Nível de vegetação: {item.nivelVegetacao}</Text>
                <Text style={styles.meta}>Última intervenção: {item.ultimaIntervencao}</Text>
                <Text style={styles.meta}>{trechoOcorrencias.length} ocorrências associadas</Text>
              </View>

              <AppButton
                label="Iniciar inspeção"
                variant="secondary"
                onPress={() => navigation.navigate('Inspecao', { trechoId: item.id })}
                accessibilityHint="Abre o formulário de inspeção com este trecho selecionado."
              />
            </Card>
          );
        }}
      />
    </Screen>
  );
}

function FilterChip({
  label,
  active,
  onPress
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Filtrar por ${label}`}
      accessibilityState={{ selected: active }}
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  listContent: {
    gap: 12,
    paddingBottom: 24
  },
  headerBlock: {
    gap: 12
  },
  summaryBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  search: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderWidth: 1,
    borderRadius: 16,
    color: palette.text,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  filtersBlock: {
    gap: 10
  },
  filterLabel: {
    color: palette.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '800'
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border
  },
  chipActive: {
    backgroundColor: 'rgba(37, 99, 235, 0.18)',
    borderColor: palette.primary
  },
  chipText: {
    color: palette.textMuted,
    fontWeight: '700',
    fontSize: 12
  },
  chipTextActive: {
    color: palette.text
  },
  metaRow: {
    gap: 8,
    marginBottom: 14
  },
  meta: {
    color: palette.textMuted,
    lineHeight: 20
  }
});
