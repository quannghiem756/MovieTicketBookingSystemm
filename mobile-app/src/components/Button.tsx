import React from 'react';
import { Button as PaperButton, useTheme } from 'react-native-paper';
import { StyleSheet, ViewStyle } from 'react-native';

interface ButtonProps {
  mode?: 'text' | 'outlined' | 'contained';
  onPress: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
}

const Button = ({ mode = 'contained', onPress, children, style, loading, disabled, icon }: ButtonProps) => {
  const theme = useTheme();

  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      loading={loading}
      disabled={disabled}
      icon={icon}
      style={[
        styles.button,
        mode === 'contained' && { backgroundColor: disabled ? theme.colors.onSurfaceDisabled : theme.colors.primary },
        mode === 'outlined' && { borderColor: theme.colors.outline },
        style,
      ]}
      labelStyle={styles.label}
    >
      {children}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    marginVertical: 4,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    paddingVertical: 2,
  },
});

export default Button;
