import 'react-native-gesture-handler';

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider } from './context/AppContext';
import { RootNavigator } from './navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="light" />
        <RootNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}
