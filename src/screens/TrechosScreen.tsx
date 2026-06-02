import React from 'react';
import { FlatList, Text, View, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Screen } from '../components/Screen';
import { Card } from '../components/Card';
import { useAppContext } from '../context/AppContext';
import { RootStackParamList } from '../types/navigation';
import { palette } from '../theme/palette';

type Props = NativeStackScreenProps<RootStackParamList, 'Trechos'>;

export function TrechosScreen({ navigation }: Props) {
  const { trechos } = useAppContext();

  return (
    <Screen>
      <Text style={styles.header}>Trechos disponíveis</Text>
      <FlatList
        data={trechos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card
            title={item.nome}
            subtitle={`${item.rodovia} • km ${item.kmInicial.toFixed(1)} ao km ${item.kmFinal.toFixed(1)}`}
            onPress={() => navigation.navigate('Inspecao', { trechoId: item.id })}
          >
            <View style={styles.metaRow}>
              <Text style={styles.meta}>Vegetação: {item.vegetacaoPredominante}</Text>
              <Text style={styles.status}>Status: {item.status}</Text>
              <Text style={styles.meta}>Última inspeção: {item.ultimaInspecao}</Text>
            </View>
            <Pressable style={styles.button} onPress={() => navigation.navigate('Inspecao', { trechoId: item.id })}>
              <Text style={styles.buttonText}>Registrar inspeção</Text>
            </Pressable>
          </Card>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    color: palette.text,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 14
  },
  metaRow: {
    gap: 4,
    marginBottom: 12
  },
  meta: {
    color: palette.textMuted
  },
  status: {
    color: palette.primary,
    fontWeight: '700'
  },
  button: {
    backgroundColor: palette.surfaceElevated,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10
  },
  buttonText: {
    color: palette.text,
    fontWeight: '700'
  }
});
