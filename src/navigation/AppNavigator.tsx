import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { DashboardScreen } from '../screens/DashboardScreen';
import { InspecaoScreen } from '../screens/InspecaoScreen';
import { TrechosScreen } from '../screens/TrechosScreen';
import { RootStackParamList } from '../types/navigation';
import { palette } from '../theme/palette';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
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
        initialRouteName="Dashboard"
        screenOptions={{
          headerStyle: { backgroundColor: palette.surface },
          headerTintColor: palette.text,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: palette.background }
        }}
      >
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Motiva ORION' }} />
        <Stack.Screen name="Trechos" component={TrechosScreen} options={{ title: 'Trechos' }} />
        <Stack.Screen name="Inspecao" component={InspecaoScreen} options={{ title: 'Inspeção' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
