import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Text, Searchbar, Chip, useTheme, ActivityIndicator, Paragraph } from 'react-native-paper';
import { useTranslation } from '../context/I18nContext';
import { useChatbot } from '../context/ChatbotContext';
import { getMovies } from '../services/movieService';
import { API_BASE_URL } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const MoviesScreen = () => {
  const { t } = useTranslation();
  const { openChatbot } = useChatbot();
  const theme = useTheme();
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchMovies(1, searchQuery, selectedFormat);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedFormat]);

  const fetchMovies = async (pageNumber: number, search: string, format: string | null) => {
    try {
      setLoading(true);
      const data = await getMovies(pageNumber, 10, search, format || '');
      
      if (pageNumber === 1) {
        setMovies(data.movies || []);
      } else {
        setMovies(prev => [...prev, ...(data.movies || [])]);
      }
      
      setHasMore(data.currentPage < data.totalPages);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMovies(nextPage, searchQuery, selectedFormat);
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return undefined;
    if (url.startsWith('/uploads')) {
      return `${API_BASE_URL}${url}`;
    }
    return url;
  };

  const renderMovieItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}>
      <Card
        style={[styles.movieCard, { backgroundColor: theme.colors.surface }]}
        coverUrl={getImageUrl(item.posterUrl)}
        title={item.title}
        subtitle={item.genre.join(', ')}
      />
    </TouchableOpacity>
  );

  const renderZeroResults = () => (
    <View style={styles.zeroResultsContainer}>
      <MaterialCommunityIcons name="sparkles" size={48} color={theme.colors.primary} />
      <Text style={styles.zeroResultsText}>{t('movies.noResults')}</Text>
      <Paragraph style={styles.zeroResultsSubtext}>
        Can't find what you're looking for? Let our AI assistant help you find the perfect movie! ✨
      </Paragraph>
      <Button 
        mode="contained" 
        onPress={openChatbot}
        icon="robot"
        style={styles.chatbotButton}
      >
        Ask AI Assistant
      </Button>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder={t('movies.searchPlaceholder')}
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          placeholderTextColor={theme.colors.onSurfaceVariant}
          iconColor={theme.colors.onSurfaceVariant}
          inputStyle={{ color: theme.colors.onSurface }}
        />
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>{t('movies.formats')}:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['2D', '3D', 'IMAX'].map(format => (
              <Chip
                key={format}
                selected={selectedFormat === format}
                onPress={() => setSelectedFormat(selectedFormat === format ? null : format)}
                style={styles.chip}
                selectedColor={theme.colors.onPrimary}
                showSelectedOverlay
              >
                {format}
              </Chip>
            ))}
          </ScrollView>
        </View>
      </View>

      <FlatList
        data={movies}
        renderItem={renderMovieItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator color={theme.colors.primary} /> : null}
        ListEmptyComponent={!loading ? renderZeroResults : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  header: {
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingTop: 60,
  },
  searchBar: {
    backgroundColor: '#333',
    borderRadius: 8,
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    marginRight: 10,
    color: '#b3b3b3',
  },
  chip: {
    marginRight: 8,
    backgroundColor: '#333',
  },
  listContent: {
    padding: 8,
  },
  row: {
    justifyContent: 'space-between',
  },
  movieCard: {
    width: (width - 32) / 2,
    marginBottom: 16,
  },
  zeroResultsContainer: {
    alignItems: 'center',
    marginTop: 50,
    padding: 20,
  },
  zeroResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ffffff',
  },
  zeroResultsSubtext: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#b3b3b3',
  },
  chatbotButton: {
    marginTop: 10,
  },
});

export default MoviesScreen;
