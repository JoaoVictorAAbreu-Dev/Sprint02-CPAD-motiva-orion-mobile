import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';

import { palette } from '../theme/palette';

export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bgGlowTop} />
      <View style={styles.bgGlowBottom} />
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 16
  },
  bgGlowTop: {
    position: 'absolute',
    top: -80,
    right: -100,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(37, 99, 235, 0.16)'
  },
  bgGlowBottom: {
    position: 'absolute',
    bottom: -120,
    left: -120,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(22, 163, 74, 0.08)'
  }
});
