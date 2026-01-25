import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Text, Title, useTheme, HelperText, Menu, TouchableRipple } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/I18nContext';
import Button from '../components/Button';
import Input from '../components/Input';
import { createTicket } from '../services/supportService';

const ContactUsScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('General Question');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);

  const categories = [
    { label: t('contactUs.categories.payment'), value: 'Payment Issue' },
    { label: t('contactUs.categories.ticket'), value: 'Ticket/QR Problem' },
    { label: t('contactUs.categories.account'), value: 'Account' },
    { label: t('contactUs.categories.general'), value: 'General Question' },
  ];

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async () => {
    if (!name || !email || !phone || !message) {
      setError(t('common.error'));
      Alert.alert(t('contactUs.error'), 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setError(t('contactUs.error'));
      Alert.Alert(t('contactUs.error'), 'Invalid email format');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createTicket({
        name,
        email,
        phone,
        category,
        message
      });
      
      Alert.alert(
        t('contactUs.submitted'),
        t('contactUs.success') + '\n\n' + t('contactUs.checkEmail'),
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err: any) {
      setError(err.response?.data?.message || t('contactUs.error'));
      Alert.alert(t('contactUs.error'), err.response?.data?.message || t('contactUs.error'));
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (value: string) => {
    return categories.find(c => c.value === value)?.label || value;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Title style={styles.title}>{t('contactUs.title')}</Title>
        </View>

        <View style={styles.form}>
          <Input
            label={t('contactUs.name')}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <Input
            label={t('contactUs.email')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Input
            label={t('contactUs.phone')}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <View style={styles.menuContainer}>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <TouchableRipple
                  onPress={() => setMenuVisible(true)}
                  style={[styles.menuAnchor, { borderColor: theme.colors.outline }]} 
                >
                  <View style={styles.menuAnchorContent}>
                    <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}>{t('contactUs.category')}</Text>
                    <Text style={{ color: theme.colors.onSurface, fontSize: 16, marginTop: 4 }}>
                      {getCategoryLabel(category)}
                    </Text>
                  </View>
                </TouchableRipple>
              }
              contentStyle={{ backgroundColor: theme.colors.surface }}
            >
              {categories.map((cat) => (
                <Menu.Item
                  key={cat.value}
                  onPress={() => {
                    setCategory(cat.value);
                    setMenuVisible(false);
                  }}
                  title={cat.label}
                  titleStyle={{ color: theme.colors.onSurface }}
                />
              ))}
            </Menu>
          </View>

          <Input
            label={t('contactUs.message')}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={5}
            style={styles.messageInput}
          />

          {error ? <HelperText type="error" visible={!!error}>{error}</HelperText> : null}

          <Button
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            {t('contactUs.submit')}
          </Button>
          
          <Button
            mode="text"
            onPress={() => navigation.goBack()}
            disabled={loading}
            style={styles.cancelButton}
          >
            {t('contactUs.cancel')}
          </Button>
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
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  form: {
    width: '100%',
  },
  menuContainer: {
    marginBottom: 12,
  },
  menuAnchor: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 56,
    justifyContent: 'center',
  },
  menuAnchorContent: {
    justifyContent: 'center',
  },
  messageInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 10,
  },
  cancelButton: {
    marginTop: 10,
  },
});

export default ContactUsScreen;
