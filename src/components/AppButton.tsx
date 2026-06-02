import React from 'react';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';

import { palette } from '../theme/palette';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
};

const variantStyles: Record<Variant, { backgroundColor: string; borderColor: string; textColor: string }> = {
  primary: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
    textColor: '#F8FAFC'
  },
  secondary: {
    backgroundColor: palette.surfaceElevated,
    borderColor: palette.border,
    textColor: palette.text
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: palette.border,
    textColor: palette.textMuted
  },
  danger: {
    backgroundColor: palette.danger,
    borderColor: palette.danger,
    textColor: '#F8FAFC'
  }
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  accessibilityLabel,
  accessibilityHint
}: Props) {
  const tokens = variantStyles[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: tokens.backgroundColor, borderColor: tokens.borderColor },
        variant === 'ghost' ? styles.ghost : null,
        isDisabled ? styles.disabled : null,
        pressed && !isDisabled ? styles.pressed : null,
        style
      ]}
    >
      {loading ? <ActivityIndicator color={tokens.textColor} /> : <Text style={[styles.label, { color: tokens.textColor }]}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ghost: {
    backgroundColor: 'transparent'
  },
  disabled: {
    opacity: 0.55
  },
  pressed: {
    transform: [{ scale: 0.99 }]
  },
  label: {
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.2
  }
});
