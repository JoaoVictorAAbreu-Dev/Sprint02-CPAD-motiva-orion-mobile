import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

import { palette } from '../theme/palette';

type Props = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  onPress?: () => void;
};

export function Card({ title, subtitle, children, onPress }: Props) {
  if (onPress) {
    return (
      <Pressable style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]} onPress={onPress}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {children}
      </Pressable>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: 12
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }]
  },
  title: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6
  },
  subtitle: {
    color: palette.textMuted,
    marginBottom: 10
  }
});
