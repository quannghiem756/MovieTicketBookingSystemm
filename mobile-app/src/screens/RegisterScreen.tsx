import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Title, useTheme, HelperText } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/I18nContext';
import Button from '../components/Button';
import Input from '../components/Input';

const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError(t('auth.error.fillAll'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth.error.passwordMismatch'));
      return;
    }

    setLoading(true);
    setError('');

    const result = await register({ name, email, password });
    
    if (result.success) {
      // Navigate to login or verification
      navigation.navigate('Login');
    } else {
      setError(result.error || t('auth.error.registrationFailed'));
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Title style={[styles.title, { color: theme.colors.primary }]}>{t('auth.createAccount')}</Title>
          <Text style={styles.subtitle}>{t('auth.joinUs')}</Text>
        </View>

        <View style={styles.form}>
          <Input
            label={t('auth.name')}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            error={!!error}
          />
          <Input
            label={t('auth.email')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={!!error}
          />
          <Input
            label={t('auth.password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={!!error}
          />
          <Input
            label={t('auth.confirmPassword')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={!!error}
          />

          {error ? <HelperText type="error" visible={!!error}>{error}</HelperText> : null}

          <Button
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            {t('auth.register')}
          </Button>

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.linkContainer}
          >
            <Text style={styles.linkText}>
              {t('auth.alreadyHaveAccount')} <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>{t('auth.login')}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    color: '#b3b3b3',
    fontSize: 16,
  },
  form: {
    width: '100%',
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
  },
  linkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#ffffff',
    fontSize: 14,
  },
});

export default RegisterScreen;
