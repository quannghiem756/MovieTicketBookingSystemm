import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Text, Title, useTheme, Paragraph, ActivityIndicator, Divider, List, Chip } from 'react-native-paper';
import { useTranslation } from '../context/I18nContext';
import { getMovieById } from '../services/movieService';
import YoutubePlayer from 'react-native-youtube-iframe';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Button from '../components/Button';

const { width } = Dimensions.get('window');

const MovieDetailsScreen = ({ route, navigation }: any) => {
  const { movieId } = route.params;
  const { t } = useTranslation();
  const theme = useTheme();
  
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    fetchMovie();
  }, [movieId]);

  const fetchMovie = async () => {
    try {
      setLoading(true);
      const data = await getMovieById(movieId);
      setMovie(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      setPlaying(false);
    }
  }, []);

  const extractYoutubeId = (url: string) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.js\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
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
        <Text style={{ color: '#fff' }}>Movie not found</Text>
      </View>
    );
  }

  const youtubeId = extractYoutubeId(movie.trailerUrl);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
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
        <Image source={{ uri: movie.posterUrl }} style={styles.heroPoster} />
      )}

      <View style={styles.infoSection}>
        <Title style={styles.title}>{movie.title}</Title>
        
        <View style={styles.metaRow}>
          <Chip icon="clock-outline" style={styles.chip}>{movie.duration} min</Chip>
          <Chip icon="calendar" style={styles.chip}>{new Date(movie.releaseDate).getFullYear()}</Chip>
          <Chip icon="star" style={styles.chip} selectedColor="#ffc107">{movie.rating || 'N/A'}</Chip>
        </View>

        <View style={styles.genreContainer}>
          {movie.genre.map((g: string) => (
            <Chip key={g} style={styles.genreChip} textStyle={styles.genreText}>{g}</Chip>
          ))}
        </View>

        <Divider style={styles.divider} />

        <Title style={styles.sectionTitle}>Synopsis</Title>
        <Paragraph style={styles.description}>{movie.description}</Paragraph>

        <Divider style={styles.divider} />

        <List.Item
          title="Director"
          description={movie.director}
          left={props => <List.Icon {...props} icon="account-tie" />}
          titleStyle={{ color: theme.colors.onSurface }}
          descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
        />
        <List.Item
          title="Cast"
          description={movie.cast.join(', ')}
          left={props => <List.Icon {...props} icon="account-group" />}
          titleStyle={{ color: theme.colors.onSurface }}
          descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
        />

        <Button
          mode="contained"
          onPress={() => console.log('Navigate to seat selection', movie.id)}
          style={styles.bookButton}
        >
          Book Tickets
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
