import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';

import { palette } from '../theme/palette';

export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.container}>
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
    padding: 16
  }
});
