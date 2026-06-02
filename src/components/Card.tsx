import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import { palette } from '../theme/palette';

type Props = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  accentColor?: string;
  children?: React.ReactNode;
  onPress?: () => void;
};

export function Card({ title, subtitle, eyebrow, accentColor = palette.primary, children, onPress }: Props) {
  if (onPress) {
    return (
      <Pressable style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]} onPress={onPress}>
        <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {children}
      </Pressable>
    );
  }

  return (
    <View style={styles.card}>
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
    overflow: 'hidden'
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }]
  },
  accentBar: {
    height: 4,
    width: 54,
    borderRadius: 999,
    marginBottom: 14
  },
  eyebrow: {
    color: palette.textMuted,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginBottom: 4
  },
  title: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6
  },
  subtitle: {
    color: palette.textMuted,
    marginBottom: 10,
    lineHeight: 20
  }
});
