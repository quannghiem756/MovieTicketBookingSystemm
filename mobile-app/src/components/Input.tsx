import React from 'react';
import { TextInput as PaperTextInput, useTheme } from 'react-native-paper';
import { StyleSheet, ViewStyle } from 'react-native';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  style?: ViewStyle;
  error?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  right?: React.ReactNode;
}

const Input = ({
  label,
  value,
  onChangeText,
  secureTextEntry,
  style,
  error,
  keyboardType,
  autoCapitalize = 'none',
  right
}: InputProps) => {
  const theme = useTheme();

  return (
    <PaperTextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      style={[styles.input, { backgroundColor: theme.colors.surface }, style]}
      mode="outlined"
      error={error}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      textColor={theme.colors.onSurface}
      outlineColor={theme.colors.outline}
      activeOutlineColor={theme.colors.primary}
      right={right}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 12,
  },
});

export default Input;
