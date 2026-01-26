import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Title, useTheme, Paragraph, ActivityIndicator, Divider, List, Chip } from 'react-native-paper';
import { useTranslation } from '../context/I18nContext';
import { getMovieById, getFutureShowtimesByMovieId } from '../services/movieService';
import { API_BASE_URL } from '../services/api';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Button from '../components/Button';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');

const MovieDetailsScreen = ({ route, navigation }: any) => {
  const { movieId } = route.params;
  const { t, locale } = useTranslation();
  const theme = useTheme();
  
  const [movie, setMovie] = useState<any>(null);
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [selectedShowtime, setSelectedShowtime] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMovie = useCallback(async () => {
    try {
      const data = await getMovieById(movieId);
      setMovie(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  }, [movieId]);

  const fetchShowtimes = useCallback(async () => {
    try {
      const data = await getFutureShowtimesByMovieId(movieId);
      setShowtimes(data);
    } catch (error) {
      console.error('Error fetching showtimes:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [movieId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMovie();
    fetchShowtimes();
  }, [fetchMovie, fetchShowtimes]);

  useFocusEffect(
    useCallback(() => {
      fetchMovie();
      fetchShowtimes();
    }, [fetchMovie, fetchShowtimes])
  );

  const getImageUrl = (url: string) => {
    if (!url) return undefined;
    if (url.startsWith('/uploads')) {
      return `${API_BASE_URL}${url}`;
    }
    return url;
  };

  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      setPlaying(false);
    }
  }, []);

  const handleBook = () => {
    if (!selectedShowtime) {
      return;
    }
    navigation.navigate('SeatSelection', { 
      showtimeId: selectedShowtime.id,
      movieTitle: movie.title,
      movieId: movie.id
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{ color: '#fff' }}>{t('movies.notFound')}</Text>
      </View>
    );
  }

  const youtubeId = movie.trailerUrl ? movie.trailerUrl.match(/(?:youtu\.be\/|youtube\.js\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)?.[1] : null;

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {youtubeId ? (
        <View style={styles.trailerContainer}>
          <YoutubePlayer
            height={width * 0.5625}
            play={playing}
            videoId={youtubeId}
            onChangeState={onStateChange}
          />
        </View>
      ) : (
        <Image 
          source={{ uri: getImageUrl(movie.posterUrl) }} 
          style={styles.heroPoster} 
          contentFit="cover"
          transition={300}
        />
      )}

      <View style={styles.infoSection}>
        <Title style={styles.title}>{movie.title}</Title>
        
        <View style={styles.metaRow}>
          <Chip icon="clock-outline" style={styles.chip}>{movie.duration} {t('movies.durationUnit')}</Chip>
          <Chip icon="calendar" style={styles.chip}>{new Date(movie.releaseDate).getFullYear()}</Chip>
          <Chip icon="star" style={styles.chip} selectedColor="#ffc107">{movie.rating || 'N/A'}</Chip>
        </View>

        <View style={styles.genreContainer}>
          {movie.genre.map((g: string) => (
            <Chip key={g} style={styles.genreChip} textStyle={styles.genreText}>{g}</Chip>
          ))}
        </View>

        <Divider style={styles.divider} />

        <Title style={styles.sectionTitle}>{t('movies.showtimes')}</Title>
        <View style={styles.showtimeContainer}>
          {showtimes.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {showtimes.map((st) => (
                <TouchableOpacity
                  key={st.id}
                  style={[
                    styles.showtimeItem,
                    selectedShowtime?.id === st.id && styles.selectedShowtime,
                    { borderColor: theme.colors.outline }
                  ]}
                  onPress={() => setSelectedShowtime(st)}
                >
                  <Text style={[styles.showtimeDate, selectedShowtime?.id === st.id && styles.selectedText]}>
                    {new Date(st.showDate).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-GB', { day: '2-digit', month: '2-digit' })}
                  </Text>
                  <Text style={[styles.showtimeTime, selectedShowtime?.id === st.id && styles.selectedText]}>
                    {st.showTime}
                  </Text>
                  <Text style={[styles.showtimeFormat, selectedShowtime?.id === st.id && styles.selectedText]}>
                    {st.format}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <Text style={{ color: '#666' }}>{t('movies.noShowtimes')}</Text>
          )}
        </View>

        <Divider style={styles.divider} />

        <Title style={styles.sectionTitle}>{t('movies.synopsis')}</Title>
        <Paragraph style={styles.description}>{movie.description}</Paragraph>

        <Divider style={styles.divider} />

        <List.Item
          title={t('movies.director')}
          description={movie.director}
          left={props => <List.Icon {...props} icon="account-tie" />}
          titleStyle={{ color: theme.colors.onSurface }}
          descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
        />
        <List.Item
          title={t('movies.cast')}
          description={movie.cast.join(', ')}
          left={props => <List.Icon {...props} icon="account-group" />}
          titleStyle={{ color: theme.colors.onSurface }}
          descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
        />

        <Button
          mode="contained"
          onPress={handleBook}
          disabled={!selectedShowtime}
          style={styles.bookButton}
        >
          {selectedShowtime ? t('movies.bookFor', { time: selectedShowtime.showTime }) : t('movies.selectShowtime')}
        </Button>
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
    paddingBottom: 40,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  trailerContainer: {
    width: '100%',
  },
  heroPoster: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  infoSection: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#ffffff',
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#1e1e1e',
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  genreChip: {
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: 'transparent',
    borderColor: '#d32f2f',
    borderWidth: 1,
  },
  genreText: {
    fontSize: 12,
    color: '#d32f2f',
  },
  showtimeContainer: {
    marginVertical: 10,
  },
  showtimeItem: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 10,
    alignItems: 'center',
    minWidth: 80,
  },
  selectedShowtime: {
    backgroundColor: '#d32f2f',
    borderColor: '#d32f2f',
  },
  showtimeDate: {
    fontSize: 12,
    color: '#b3b3b3',
  },
  showtimeTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 2,
  },
  showtimeFormat: {
    fontSize: 10,
    color: '#b3b3b3',
  },
  selectedText: {
    color: '#fff',
  },
  divider: {
    marginVertical: 20,
    backgroundColor: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ffffff',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#b3b3b3',
  },
  bookButton: {
    marginTop: 30,
    paddingVertical: 8,
  },
});

export default MovieDetailsScreen;
