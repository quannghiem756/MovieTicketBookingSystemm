import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions, TouchableOpacity } from 'react-native';
import { Text, ActivityIndicator, useTheme, Surface, IconButton, Button } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTranslation } from '../context/I18nContext';
import { getNewsById } from '../services/movieService';
import { API_BASE_URL } from '../services/api';
import { Image } from 'expo-image';
import RenderHTML from 'react-native-render-html';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const NewsDetailsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const theme = useTheme();
  const { width } = useWindowDimensions();
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

  const processImageUrls = (content: string) => {
    if (!content) return content;
    // Replace relative /uploads paths with full API URL
    return content.replace(/src="\/uploads\//g, `src="${API_BASE_URL}/uploads/`);
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
        <MaterialCommunityIcons name="alert-circle-outline" size={60} color={theme.colors.error} />
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{error || t('news.noNews')}</Text>
        <Button mode="contained" onPress={fetchNewsDetail} style={styles.retryButton}>
          {t('common.retry')}
        </Button>
        <Button mode="text" onPress={() => navigation.goBack()} style={styles.backButtonText}>
          {t('common.back')}
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <IconButton
        icon="arrow-left"
        iconColor="#ffffff"
        size={24}
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        testID="back-button"
      />
      <ScrollView>
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
          
          <View style={styles.htmlContainer}>
            <RenderHTML
              contentWidth={width - 40}
              source={{ html: processImageUrls(news.content) }}
              tagsStyles={{
                p: { color: '#cccccc', fontSize: 16, lineHeight: 24, marginBottom: 15 },
                h1: { color: '#ffffff', marginBottom: 10 },
                h2: { color: '#ffffff', marginBottom: 10 },
                h3: { color: '#ffffff', marginBottom: 10 },
                li: { color: '#cccccc', fontSize: 16 },
                img: { borderRadius: 8, marginVertical: 10 },
              }}
            />
          </View>
        </Surface>
      </ScrollView>
    </View>
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
    padding: 20,
  },
  content: {
    padding: 20,
    backgroundColor: 'transparent',
  },
  featuredImage: {
    width: '100%',
    height: 350,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  errorText: {
    fontSize: 16,
    marginVertical: 20,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 10,
    width: '60%',
  },
  backButtonText: {
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff',
    lineHeight: 34,
  },
  htmlContainer: {
    marginTop: 10,
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
