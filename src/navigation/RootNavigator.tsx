import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MainTabs } from './MainTabs';
import { DetalheTrechoScreen } from '../features/trechos/screens/DetalheTrechoScreen';
import { InspecaoScreen } from '../features/inspecao/screens/InspecaoScreen';
import { NotificationsScreen } from '../features/notifications/screens/NotificationsScreen';
import { SettingsScreen } from '../features/settings/screens/SettingsScreen';
import { navigationRef } from './navigationRef';
import { RootStackParamList } from '../types/navigation';
import { palette } from '../theme/palette';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer
      ref={navigationRef}
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
          headerShown: false,
          contentStyle: { backgroundColor: palette.background }
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="DetalheTrecho" component={DetalheTrechoScreen} />
        <Stack.Screen name="Inspecao" component={InspecaoScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
