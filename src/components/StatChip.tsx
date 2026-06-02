import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

import { palette } from '../theme/palette';

export function StatChip({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: palette.surfaceElevated,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: 12
  },
  value: {
    color: palette.primary,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4
  },
  label: {
    color: palette.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6
  }
});
