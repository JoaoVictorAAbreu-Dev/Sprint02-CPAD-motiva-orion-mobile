import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { CameraCapturedPicture, CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppButton } from '../../../components/AppButton';
import { Card } from '../../../components/Card';
import { FormField } from '../../../components/FormField';
import { Screen } from '../../../components/Screen';
import { SectionHeader } from '../../../components/SectionHeader';
import { StatusBadge } from '../../../components/StatusBadge';
import { useAppContext } from '../../../context/AppContext';
import { RootStackParamList } from '../../../types/navigation';
import { palette } from '../../../theme/palette';

type Props = NativeStackScreenProps<RootStackParamList, 'Inspecao'>;

type Risco = 'Baixo' | 'Médio' | 'Alto';

export function InspecaoScreen({ route, navigation }: Props) {
  const { trechos, getTrechoById, registrarInspecao } = useAppContext();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const submittedRef = useRef(false);

  const trechoSelecionado = useMemo(
    () => (route.params?.trechoId ? getTrechoById(route.params.trechoId) : trechos[0]),
    [getTrechoById, route.params?.trechoId, trechos]
  );

  const [trechoId, setTrechoId] = useState(trechoSelecionado?.id ?? '');
  const [responsavel, setResponsavel] = useState('');
  const [observacao, setObservacao] = useState('');
  const [risco, setRisco] = useState<Risco>('Baixo');
  const [acaoRecomendada, setAcaoRecomendada] = useState('');
  const [foto, setFoto] = useState<CameraCapturedPicture | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [locationPermission, setLocationPermission] = useState<Location.LocationPermissionResponse | null>(null);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [capturingLocation, setCapturingLocation] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (trechoSelecionado?.id) {
      setTrechoId(trechoSelecionado.id);
    }
  }, [trechoSelecionado?.id]);

  useEffect(() => {
    void requestCameraPermission();
  }, [requestCameraPermission]);

  useEffect(() => {
    (async () => {
      const permission = await Location.getForegroundPermissionsAsync();
      setLocationPermission(permission);
    })();
  }, []);

  const hasChanges =
    Boolean(responsavel.trim()) ||
    Boolean(observacao.trim()) ||
    Boolean(acaoRecomendada.trim()) ||
    Boolean(foto) ||
    Boolean(coordinates) ||
    risco !== 'Baixo' ||
    (route.params?.trechoId ? false : trechoId !== (trechoSelecionado?.id ?? ''));

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (event) => {
      if (!hasChanges || saving || submittedRef.current) {
        return;
      }

      event.preventDefault();
      Alert.alert('Descartar alterações?', 'Você tem dados não salvos nesta inspeção.', [
        { text: 'Continuar editando', style: 'cancel' },
        {
          text: 'Descartar',
          style: 'destructive',
          onPress: () => navigation.dispatch(event.data.action)
        }
      ]);
    });

    return unsubscribe;
  }, [hasChanges, navigation, saving]);

  const canSubmit = trechoId && responsavel.trim() && observacao.trim() && acaoRecomendada.trim() && foto && !saving;

  const takePhoto = async () => {
    if (!cameraReady || !cameraRef.current || capturing) return;

    try {
      setCapturing(true);
      const captured = await cameraRef.current.takePictureAsync({ quality: 0.7, exif: false });
      setFoto(captured ?? null);
    } catch {
      Alert.alert('Erro na câmera', 'Não foi possível capturar a foto. Tente novamente.');
    } finally {
      setCapturing(false);
    }
  };

  const captureLocation = async () => {
    try {
      setCapturingLocation(true);
      const currentPermission = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(currentPermission);

      if (!currentPermission.granted) {
        Alert.alert('Permissão negada', 'É necessário permitir o acesso à localização para registrar as coordenadas.');
        return;
      }

      const currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      setCoordinates({
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude
      });
    } catch {
      Alert.alert('Erro de localização', 'Não foi possível capturar a posição atual.');
    } finally {
      setCapturingLocation(false);
    }
  };

  const submit = async () => {
    if (!canSubmit) {
      Alert.alert('Campos obrigatórios', 'Preencha trecho, responsável, observação, ação recomendada e tire uma foto.');
      return;
    }

    try {
      setSaving(true);
      await registrarInspecao({
        trechoId,
        responsavel: responsavel.trim(),
        observacao: observacao.trim(),
        risco,
        acaoRecomendada: acaoRecomendada.trim(),
        fotoUri: foto?.uri,
        latitude: coordinates?.latitude,
        longitude: coordinates?.longitude
      });

      submittedRef.current = true;
      Alert.alert('Inspeção registrada', 'Registro salvo com sucesso.');
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen showBackButton onBackPress={() => navigation.goBack()}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <SectionHeader
              title="Nova inspeção"
              subtitle="Registre a condição da vegetação, anexe evidência visual e sincronize a operação."
            />

            {trechoSelecionado ? (
              <Card
                title={trechoSelecionado.nome}
                subtitle={`${trechoSelecionado.rodovia} • km ${trechoSelecionado.km.toFixed(1)}`}
                eyebrow="Trecho selecionado"
                accentColor={palette.primary}
              >
                <View style={styles.trechoInfo}>
                  <StatusBadge
                    label={trechoSelecionado.status}
                    tone={trechoSelecionado.status === 'Normal' ? 'success' : trechoSelecionado.status === 'Atenção' ? 'warning' : 'danger'}
                  />
                  <Text style={styles.meta}>Prioridade: {trechoSelecionado.prioridade}</Text>
                  <Text style={styles.meta}>Vegetação: {trechoSelecionado.nivelVegetacao}</Text>
                </View>
              </Card>
            ) : null}

            <Card title="Evidência fotográfica" subtitle="Captura obrigatória para concluir a inspeção" accentColor={palette.success}>
              {cameraPermission?.granted ? (
                <View style={styles.cameraBlock}>
                  <View style={styles.cameraFrame}>
                    {foto ? (
                      <Image source={{ uri: foto.uri }} style={styles.preview} />
                    ) : (
                      <CameraView ref={cameraRef} style={styles.camera} facing="back" onCameraReady={() => setCameraReady(true)} />
                    )}
                  </View>

                  <View style={styles.cameraActions}>
                    <AppButton
                      label={foto ? 'Tirar outra foto' : capturing ? 'Capturando...' : 'Tirar foto'}
                      onPress={takePhoto}
                      loading={capturing}
                      disabled={!cameraReady}
                      style={styles.flexButton}
                    />
                    {foto ? (
                      <AppButton label="Remover" variant="secondary" onPress={() => setFoto(null)} style={styles.flexButton} />
                    ) : null}
                  </View>
                </View>
              ) : (
                <View style={styles.permissionCard}>
                  <Text style={styles.permissionText}>
                    A câmera precisa de permissão para registrar a inspeção com imagem.
                  </Text>
                  <AppButton label="Conceder permissão" onPress={requestCameraPermission} />
                </View>
              )}
            </Card>

            <Card title="Geolocalização" subtitle="Captura da posição atual do ponto de inspeção" accentColor={palette.primary}>
              <View style={styles.locationBlock}>
                <Text style={styles.meta}>
                  {coordinates
                    ? `Latitude: ${coordinates.latitude.toFixed(6)} | Longitude: ${coordinates.longitude.toFixed(6)}`
                    : 'Nenhuma coordenada registrada ainda.'}
                </Text>
                <Text style={styles.meta}>Permissão: {locationPermission?.granted ? 'Concedida' : 'Pendente'}</Text>
                <AppButton
                  label={capturingLocation ? 'Capturando localização...' : 'Capturar localização'}
                  variant="secondary"
                  onPress={captureLocation}
                  loading={capturingLocation}
                />
              </View>
            </Card>

            <Card title="Dados da inspeção" subtitle="Preencha as informações de campo" accentColor={palette.primary}>
              <FormField label="Trecho" helperText="O formulário já começa com um trecho sugerido.">
                <TextInput
                  value={trechoId}
                  onChangeText={setTrechoId}
                  placeholder="Informe o ID do trecho"
                  placeholderTextColor={palette.textMuted}
                  style={styles.input}
                  autoCapitalize="none"
                />
              </FormField>

              <FormField label="Responsável">
                <TextInput
                  value={responsavel}
                  onChangeText={setResponsavel}
                  placeholder="Nome do responsável"
                  placeholderTextColor={palette.textMuted}
                  style={styles.input}
                />
              </FormField>

              <FormField label="Observação">
                <TextInput
                  value={observacao}
                  onChangeText={setObservacao}
                  placeholder="Descreva a condição observada"
                  placeholderTextColor={palette.textMuted}
                  style={[styles.input, styles.multiline]}
                  multiline
                />
              </FormField>

              <FormField label="Risco">
                <View style={styles.segment}>
                  {(['Baixo', 'Médio', 'Alto'] as const).map((item) => (
                    <Pressable
                      key={item}
                      accessibilityRole="button"
                      accessibilityLabel={`Risco ${item}`}
                      accessibilityState={{ selected: risco === item }}
                      style={[styles.segmentItem, risco === item && styles.segmentItemActive]}
                      onPress={() => setRisco(item)}
                    >
                      <Text style={styles.segmentText}>{item}</Text>
                    </Pressable>
                  ))}
                </View>
              </FormField>

              <FormField label="Ação recomendada">
                <TextInput
                  value={acaoRecomendada}
                  onChangeText={setAcaoRecomendada}
                  placeholder="Ex.: roçada e remoção de material"
                  placeholderTextColor={palette.textMuted}
                  style={[styles.input, styles.multiline]}
                  multiline
                />
              </FormField>

              <AppButton label={saving ? 'Salvando inspeção...' : 'Salvar inspeção'} onPress={submit} loading={saving} />
            </Card>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  content: {
    gap: 12,
    paddingBottom: 24
  },
  trechoInfo: {
    gap: 8
  },
  meta: {
    color: palette.textMuted,
    lineHeight: 20
  },
  cameraBlock: {
    gap: 12
  },
  cameraFrame: {
    height: 230,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface
  },
  camera: {
    flex: 1
  },
  preview: {
    width: '100%',
    height: '100%'
  },
  cameraActions: {
    flexDirection: 'row',
    gap: 10
  },
  flexButton: {
    flex: 1
  },
  permissionCard: {
    gap: 10
  },
  permissionText: {
    color: palette.textMuted,
    lineHeight: 20
  },
  locationBlock: {
    gap: 12
  },
  input: {
    backgroundColor: palette.surfaceElevated,
    borderColor: palette.border,
    borderWidth: 1,
    borderRadius: 14,
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
    borderRadius: 12,
    backgroundColor: palette.surfaceElevated,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center'
  },
  segmentItemActive: {
    backgroundColor: 'rgba(37, 99, 235, 0.22)',
    borderColor: palette.primary
  },
  segmentText: {
    color: palette.text,
    fontWeight: '800'
  }
});
