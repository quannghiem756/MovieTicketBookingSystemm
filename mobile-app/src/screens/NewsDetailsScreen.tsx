import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useTranslation } from '../context/I18nContext';

const NewsDetailsScreen = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text>{t('news.details')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f0f',
  },
});

export default NewsDetailsScreen;
