import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

import { palette } from '../theme/palette';

type Props = {
  label: string;
  tone?: 'primary' | 'success' | 'warning' | 'danger';
};

const tones = {
  primary: { backgroundColor: 'rgba(37, 99, 235, 0.16)', color: '#93C5FD', borderColor: 'rgba(37, 99, 235, 0.45)' },
  success: { backgroundColor: 'rgba(22, 163, 74, 0.16)', color: '#86EFAC', borderColor: 'rgba(22, 163, 74, 0.45)' },
  warning: { backgroundColor: 'rgba(234, 179, 8, 0.16)', color: '#FDE68A', borderColor: 'rgba(234, 179, 8, 0.45)' },
  danger: { backgroundColor: 'rgba(220, 38, 38, 0.16)', color: '#FCA5A5', borderColor: 'rgba(220, 38, 38, 0.45)' }
} as const;

export function StatusBadge({ label, tone = 'primary' }: Props) {
  const style = tones[tone];

  return (
    <View style={[styles.badge, { backgroundColor: style.backgroundColor, borderColor: style.borderColor }]}>
      <Text style={[styles.text, { color: style.color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1
  },
  text: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4
  }
});
