import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { palette } from '../theme/palette';

type Props = {
  label: string;
  helperText?: string;
  children: React.ReactNode;
};

export function FormField({ label, helperText, children }: Props) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {helperText ? <Text style={styles.helper}>{helperText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8
  },
  label: {
    color: palette.textMuted,
    fontSize: 13,
    fontWeight: '700'
  },
  helper: {
    color: palette.textMuted,
    fontSize: 12,
    lineHeight: 18
  }
});
