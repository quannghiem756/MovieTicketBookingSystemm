import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import MovieDetailsScreen from './MovieDetailsScreen';
import { PaperProvider } from 'react-native-paper';
import theme from '../theme';
import { getMovieById, getShowtimesByMovieId } from '../services/movieService';

// Mock services
jest.mock('../services/movieService', () => ({
  getMovieById: jest.fn(),
  getShowtimesByMovieId: jest.fn(),
}));

// Mock translation
jest.mock('../context/I18nContext', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    locale: 'en',
  }),
}));

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

const mockRoute = {
  params: {
    movieId: 'movie1',
  },
};

const renderComponent = () =>
  render(
    <PaperProvider theme={theme}>
      <MovieDetailsScreen route={mockRoute} navigation={{ navigate: mockNavigate }} />
    </PaperProvider>
  );

describe('MovieDetailsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches movie data on mount', async () => {
    (getMovieById as jest.Mock).mockResolvedValue({
      id: 'movie1',
      title: 'Test Movie',
      description: 'Test Description',
      poster: 'poster.jpg',
      duration: 120,
      rating: 'PG-13',
      genre: 'Action',
    });
    (getShowtimesByMovieId as jest.Mock).mockResolvedValue({ showtimes: [] });

    renderComponent();

    await waitFor(() => {
      expect(getMovieById).toHaveBeenCalledWith('movie1');
      expect(getShowtimesByMovieId).toHaveBeenCalledWith('movie1');
    });
  });

  it('displays movie details', async () => {
    (getMovieById as jest.Mock).mockResolvedValue({
      id: 'movie1',
      title: 'Test Movie',
      description: 'Test Description',
      poster: 'poster.jpg',
      duration: 120,
      rating: 'PG-13',
      genre: 'Action',
    });
    (getShowtimesByMovieId as jest.Mock).mockResolvedValue({ showtimes: [] });

    const { getByText } = renderComponent();

    await waitFor(() => {
      expect(getByText('Test Movie')).toBeTruthy();
      expect(getByText('Test Description')).toBeTruthy();
    });
  });
});
