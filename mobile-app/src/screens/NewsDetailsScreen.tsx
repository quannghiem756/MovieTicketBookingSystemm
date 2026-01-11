import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, ActivityIndicator, useTheme, Surface } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTranslation } from '../context/I18nContext';
import { getNewsById } from '../services/movieService';
import { API_BASE_URL } from '../services/api';
import { Image } from 'expo-image';

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

  const getImageUrl = (url: string) => {
    if (!url) return undefined;
    if (url.startsWith('/uploads')) {
      return `${API_BASE_URL}${url}`;
    }
    return url;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
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
      {news.featuredImage && (
        <Image
          testID="news-image"
          source={{ uri: getImageUrl(news.featuredImage) }}
          style={styles.featuredImage}
          contentFit="cover"
        />
      )}
      <Surface style={styles.content}>
        <View style={styles.header}>
          <Text variant="labelMedium" style={styles.category}>{news.category}</Text>
          <Text variant="labelSmall" style={styles.date}>{formatDate(news.publishDate)}</Text>
        </View>
        <Text variant="headlineMedium" style={styles.title}>{news.title}</Text>
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
  featuredImage: {
    width: '100%',
    height: 250,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ffffff',
  },
  category: {
    backgroundColor: 'rgba(255, 107, 53, 0.2)',
    color: '#ff6b35',
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  date: {
    color: '#999999',
  },
});

export default NewsDetailsScreen;
