import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { palette } from '../theme/palette';
import { AppButton } from './AppButton';

type Props = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, description, actionLabel, onAction }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.badge} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onAction ? (
        <AppButton label={actionLabel} variant="secondary" onPress={onAction} style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    alignItems: 'center',
    gap: 8
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(37, 99, 235, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.35)'
  },
  title: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center'
  },
  description: {
    color: palette.textMuted,
    textAlign: 'center',
    lineHeight: 20
  },
  action: {
    alignSelf: 'stretch',
    marginTop: 8
  }
});
