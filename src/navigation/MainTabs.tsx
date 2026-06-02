import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { DashboardScreen } from '../features/dashboard/screens/DashboardScreen';
import { TrechosScreen } from '../features/trechos/screens/TrechosScreen';
import { MainTabParamList } from '../types/navigation';
import { palette } from '../theme/palette';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: palette.surface,
          borderTopColor: palette.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8
        },
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: palette.textMuted,
        tabBarLabelStyle: {
          fontWeight: '700',
          fontSize: 12
        }
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Ionicons name="speedometer-outline" color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Trechos"
        component={TrechosScreen}
        options={{
          title: 'Trechos',
          tabBarIcon: ({ color, size }) => <Ionicons name="map-outline" color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
}
