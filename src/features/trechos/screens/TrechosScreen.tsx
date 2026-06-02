import React from 'react';
import { FlatList, Text, View, StyleSheet, Pressable } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Card } from '../../../components/Card';
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

export function TrechosScreen({ navigation }: Props) {
  const { trechos, ocorrencias } = useAppContext();

  return (
    <Screen>
      <SectionHeader
        title="Trechos"
        subtitle="Selecione uma faixa da rodovia para ver detalhes, ocorrências e iniciar inspeção."
      />

      <View style={styles.summaryBar}>
        <StatusBadge label={`${trechos.length} trechos monitorados`} tone="primary" />
        <StatusBadge label={`${ocorrencias.length} ocorrências abertas`} tone="warning" />
      </View>

      <FlatList
        data={trechos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const trechoOcorrencias = ocorrencias.filter((ocorrencia) => ocorrencia.trechoId === item.id);

          return (
            <Card
              title={item.nome}
              subtitle={`${item.rodovia} • km ${item.km.toFixed(1)} | prioridade ${item.prioridade}`}
              eyebrow={item.id.toUpperCase()}
              accentColor={
                item.status === 'Normal'
                  ? palette.success
                  : item.status === 'Atenção'
                    ? palette.warning
                    : palette.danger
              }
              onPress={() => navigation.navigate('DetalheTrecho', { trechoId: item.id })}
            >
              <View style={styles.metaRow}>
                <StatusBadge label={item.status} tone={statusTone[item.status]} />
                <Text style={styles.meta}>Nível de vegetação: {item.nivelVegetacao}</Text>
                <Text style={styles.meta}>Última intervenção: {item.ultimaIntervencao}</Text>
                <Text style={styles.meta}>{trechoOcorrencias.length} ocorrências associadas</Text>
              </View>

              <Pressable style={styles.button} onPress={() => navigation.navigate('Inspecao', { trechoId: item.id })}>
                <Text style={styles.buttonText}>Iniciar inspeção</Text>
              </Pressable>
            </Card>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  summaryBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  listContent: {
    paddingBottom: 24
  },
  metaRow: {
    gap: 8,
    marginBottom: 14
  },
  meta: {
    color: palette.textMuted,
    lineHeight: 20
  },
  button: {
    backgroundColor: palette.surfaceElevated,
    paddingVertical: 13,
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.border
  },
  buttonText: {
    color: palette.text,
    fontWeight: '800'
  }
});
