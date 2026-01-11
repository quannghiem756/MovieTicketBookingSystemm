import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, ActivityIndicator, useTheme, Surface } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTranslation } from '../context/I18nContext';
import { getNewsById } from '../services/movieService';

const NewsDetailsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const theme = useTheme();
  const { id } = route.params;

  const [news, setNews] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNewsDetail();
  }, [id]);

  const fetchNewsDetail = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getNewsById(id);
      setNews(data);
    } catch (err) {
      setError(t('common.error'));
      console.error('Error loading news details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator testID="loading-indicator" size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error || !news) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{ color: theme.colors.error }}>{error || t('news.noNews')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>{news.title}</Text>
        <Text variant="labelMedium" style={styles.category}>{news.category}</Text>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    backgroundColor: 'transparent',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  category: {
    color: '#ff6b35',
    fontWeight: 'bold',
  },
});

export default NewsDetailsScreen;