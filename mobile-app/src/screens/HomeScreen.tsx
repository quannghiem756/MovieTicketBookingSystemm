import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { Text, Title, useTheme, Card, Paragraph, ActivityIndicator } from 'react-native-paper';
import { useTranslation } from '../context/I18nContext';
import { getNowShowing, getComingSoon, getNews } from '../services/movieService';
import { BACKEND_URL } from '../services/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

const HomeScreen = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation();
  
  const [nowShowing, setNowShowing] = useState<any[]>([]);
  const [comingSoon, setComingSoon] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [nowShowingData, comingSoonData, newsData] = await Promise.all([
        getNowShowing(1, 5),
        getComingSoon(1, 5),
        getNews(1, 3)
      ]);
      
      setNowShowing(nowShowingData.movies || []);
      setComingSoon(comingSoonData.movies || []);
      setNews(newsData.news || []);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const getImageUrl = (url: string) => {
    if (!url) return undefined;
    if (url.startsWith('/uploads')) {
      return `${BACKEND_URL}${url}`;
    }
    return url;
  };

  const renderMovieItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => navigation.navigate('MoviesTab', { screen: 'MovieDetails', params: { movieId: item.id } })}>
      <Card style={[styles.movieCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Cover source={{ uri: getImageUrl(item.posterUrl) }} style={styles.moviePoster} />
        <Card.Content>
          <Title numberOfLines={1} style={styles.movieTitle}>{item.title}</Title>
          <Paragraph numberOfLines={1} style={{ color: theme.colors.onSurfaceVariant }}>
            {item.genre.join(', ')}
          </Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderNewsItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => console.log('Navigate to news detail', item.id)}>
      <Card style={[styles.newsCard, { backgroundColor: theme.colors.surfaceVariant }]}>
        <View style={styles.newsContent}>
          {item.imageUrl && <Image source={{ uri: getImageUrl(item.imageUrl) }} style={styles.newsImage} />}
          <View style={styles.newsTextContainer}>
            <Title numberOfLines={1} style={styles.newsTitle}>{item.title}</Title>
            <Paragraph numberOfLines={2} style={{ color: theme.colors.onSurfaceVariant, fontSize: 12 }}>
              {item.summary}
            </Paragraph>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.section}>
        <Title style={styles.sectionTitle}>{t('home.nowShowing')}</Title>
        <FlatList
          data={nowShowing}
          renderItem={renderMovieItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 20}
          decelerationRate="fast"
          contentContainerStyle={styles.horizontalList}
        />
      </View>

      <View style={styles.section}>
        <Title style={styles.sectionTitle}>{t('home.comingSoon')}</Title>
        <FlatList
          data={comingSoon}
          renderItem={renderMovieItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 20}
          decelerationRate="fast"
          contentContainerStyle={styles.horizontalList}
        />
      </View>

      <View style={styles.section}>
        <Title style={styles.sectionTitle}>{t('home.news')}</Title>
        {news.map(item => (
          <View key={item.id} style={{ marginBottom: 10 }}>
            {renderNewsItem({ item })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  contentContainer: {
    paddingTop: 50,
    paddingBottom: 20,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 15,
    color: '#ffffff',
  },
  horizontalList: {
    paddingHorizontal: 10,
  },
  movieCard: {
    width: CARD_WIDTH,
    marginHorizontal: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  moviePoster: {
    height: CARD_WIDTH * 1.5,
  },
  movieTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  newsCard: {
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  newsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newsImage: {
    width: 80,
    height: 80,
  },
  newsTextContainer: {
    flex: 1,
    padding: 12,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
