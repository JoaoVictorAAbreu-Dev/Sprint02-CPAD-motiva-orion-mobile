import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

import { palette } from '../theme/palette';

export function StatChip({
  label,
  value,
  accent = palette.primary
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <View style={[styles.chip, { borderColor: accent }]}>
      <View style={[styles.strip, { backgroundColor: accent }]} />
      <Text style={[styles.value, { color: accent }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: palette.surfaceElevated,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: 12,
    overflow: 'hidden'
  },
  strip: {
    height: 3,
    width: 36,
    borderRadius: 999,
    marginBottom: 12
  },
  value: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 4
  },
  label: {
    color: palette.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.6
  }
});
