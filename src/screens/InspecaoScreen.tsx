import React, { useEffect, useState } from 'react';
import { Alert, Text, TextInput, View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Screen } from '../components/Screen';
import { useAppContext } from '../context/AppContext';
import { RootStackParamList } from '../types/navigation';
import { palette } from '../theme/palette';

type Props = NativeStackScreenProps<RootStackParamList, 'Inspecao'>;

export function InspecaoScreen({ route, navigation }: Props) {
  const { trechos, getTrechoById, registrarInspecao } = useAppContext();
  const trechoSelecionado = route.params?.trechoId ? getTrechoById(route.params.trechoId) : undefined;

  const [trechoId, setTrechoId] = useState(trechoSelecionado?.id ?? trechos[0]?.id ?? '');
  const [responsavel, setResponsavel] = useState('');
  const [observacao, setObservacao] = useState('');
  const [risco, setRisco] = useState<'Baixo' | 'Médio' | 'Alto'>('Baixo');
  const [acaoRecomendada, setAcaoRecomendada] = useState('');

  useEffect(() => {
    if (trechoSelecionado?.id) {
      setTrechoId(trechoSelecionado.id);
    }
  }, [trechoSelecionado?.id]);

  const submit = async () => {
    if (!trechoId || !responsavel.trim() || !observacao.trim() || !acaoRecomendada.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha trecho, responsável, observação e ação recomendada.');
      return;
    }

    await registrarInspecao({
      trechoId,
      responsavel: responsavel.trim(),
      observacao: observacao.trim(),
      risco,
      acaoRecomendada: acaoRecomendada.trim()
    });

    Alert.alert('Inspeção registrada', 'Registro salvo com sucesso.');
    navigation.navigate('Dashboard');
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>Nova inspeção</Text>

        <Field label="Trecho">
          <TextInput
            value={trechoId}
            onChangeText={setTrechoId}
            placeholder="Informe o ID do trecho"
            placeholderTextColor={palette.textMuted}
            style={styles.input}
            autoCapitalize="none"
          />
        </Field>

        <Field label="Responsável">
          <TextInput
            value={responsavel}
            onChangeText={setResponsavel}
            placeholder="Nome do responsável"
            placeholderTextColor={palette.textMuted}
            style={styles.input}
          />
        </Field>

        <Field label="Observação">
          <TextInput
            value={observacao}
            onChangeText={setObservacao}
            placeholder="Descreva a condição observada"
            placeholderTextColor={palette.textMuted}
            style={[styles.input, styles.multiline]}
            multiline
          />
        </Field>

        <Field label="Risco">
          <View style={styles.segment}>
            {(['Baixo', 'Médio', 'Alto'] as const).map((item) => (
              <Pressable
                key={item}
                style={[styles.segmentItem, risco === item && styles.segmentItemActive]}
                onPress={() => setRisco(item)}
              >
                <Text style={styles.segmentText}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </Field>

        <Field label="Ação recomendada">
          <TextInput
            value={acaoRecomendada}
            onChangeText={setAcaoRecomendada}
            placeholder="Ex.: roçada e remoção de material"
            placeholderTextColor={palette.textMuted}
            style={[styles.input, styles.multiline]}
            multiline
          />
        </Field>

        <Pressable style={styles.submit} onPress={submit}>
          <Text style={styles.submitText}>Salvar inspeção</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24
  },
  header: {
    color: palette.text,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 16
  },
  field: {
    marginBottom: 14
  },
  label: {
    color: palette.textMuted,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '600'
  },
  input: {
    backgroundColor: palette.surface,
    borderColor: palette.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: palette.text
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: 'top'
  },
  segment: {
    flexDirection: 'row',
    gap: 8
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center'
  },
  segmentItemActive: {
    backgroundColor: palette.primary
  },
  segmentText: {
    color: palette.text,
    fontWeight: '700'
  },
  submit: {
    backgroundColor: palette.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6
  },
  submitText: {
    color: '#04110A',
    fontWeight: '800'
  }
});
