import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { palette } from '../theme/palette';

type Props = {
  label?: string;
};

export function LoadingState({ label = 'Carregando informações...' }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={palette.primary} />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12
  },
  text: {
    color: palette.textMuted,
    fontWeight: '700'
  }
});
