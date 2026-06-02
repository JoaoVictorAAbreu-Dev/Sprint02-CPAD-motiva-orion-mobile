import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MainTabs } from './MainTabs';
import { DetalheTrechoScreen } from '../features/trechos/screens/DetalheTrechoScreen';
import { InspecaoScreen } from '../features/inspecao/screens/InspecaoScreen';
import { RootStackParamList } from '../types/navigation';
import { palette } from '../theme/palette';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: palette.background,
          card: palette.surface,
          text: palette.text,
          primary: palette.primary,
          border: palette.border,
          notification: palette.primary
        }
      }}
    >
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerStyle: { backgroundColor: palette.surface },
          headerTintColor: palette.text,
          headerTitleStyle: { fontWeight: '800' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: palette.background }
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="DetalheTrecho" component={DetalheTrechoScreen} options={{ title: 'Detalhes do trecho' }} />
        <Stack.Screen name="Inspecao" component={InspecaoScreen} options={{ title: 'Inspeção' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
