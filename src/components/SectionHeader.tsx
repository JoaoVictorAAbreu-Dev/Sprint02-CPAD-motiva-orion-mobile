import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { palette } from '../theme/palette';

export function SectionHeader({
  title,
  subtitle
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6
  },
  title: {
    color: palette.text,
    fontSize: 22,
    fontWeight: '900'
  },
  subtitle: {
    color: palette.textMuted,
    lineHeight: 20
  }
});
