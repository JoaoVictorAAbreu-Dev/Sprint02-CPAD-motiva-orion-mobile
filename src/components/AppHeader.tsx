import React from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { palette } from '../theme/palette';

const logo = require('../../assets/images/logo-motiva-orion.png') as ImageSourcePropType;

type Props = {
  showBackButton?: boolean;
  onBackPress?: () => void;
  onPressNotifications?: () => void;
  onPressProfile?: () => void;
};

export function AppHeader({
  showBackButton = false,
  onBackPress,
  onPressNotifications,
  onPressProfile
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.leftGroup}>
        {showBackButton ? (
          <IconButton
            icon="chevron-back"
            accessibilityLabel="Voltar"
            onPress={onBackPress}
          />
        ) : null}

        <Image source={logo} style={styles.logo} resizeMode="contain" />

        <View style={styles.brandBlock}>
          <Text style={styles.brandTitle}>Motiva ORION</Text>
          <Text style={styles.brandSubtitle}>Centro de Operações</Text>
        </View>
      </View>

      <View style={styles.rightGroup}>
        <IconButton
          icon="notifications-outline"
          accessibilityLabel="Notificações"
          onPress={onPressNotifications}
        />
        <IconButton
          icon="settings-outline"
          accessibilityLabel="Configurações ou perfil"
          onPress={onPressProfile}
        />
      </View>
    </View>
  );
}

function IconButton({
  icon,
  accessibilityLabel,
  onPress
}: {
  icon: keyof typeof Ionicons.glyphMap;
  accessibilityLabel: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [styles.iconButton, pressed ? styles.iconButtonPressed : null]}
    >
      <Ionicons name={icon} size={18} color={palette.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 72,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },
  leftGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 0
  },
  logo: {
    width: 36,
    height: 36
  },
  brandBlock: {
    flexShrink: 1,
    minWidth: 0
  },
  brandTitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '900'
  },
  brandSubtitle: {
    color: palette.textMuted,
    fontSize: 12,
    fontWeight: '700'
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }]
  }
});
