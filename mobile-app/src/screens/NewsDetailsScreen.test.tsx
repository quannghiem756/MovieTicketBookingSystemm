import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import NewsDetailsScreen from './NewsDetailsScreen';
import * as movieService from '../services/movieService';

// Mock navigation and route
const mockRoute = {
  params: { id: 'news1' }
};
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

jest.mock('@react-navigation/native', () => ({
  useRoute: () => mockRoute,
  useNavigation: () => mockNavigation,
}));

jest.mock('../services/movieService');

jest.mock('../context/I18nContext', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: any = {
        'news.details': 'News Details',
        'news.noNews': 'No news details found',
        'common.error': 'An error occurred',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock react-native-paper components to avoid theme issues in tests
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text: RNText } = require('react-native');
  
  const Text = (props: any) => React.createElement(RNText, props);
  const ActivityIndicator = (props: any) => React.createElement(View, props);
  const Surface = (props: any) => React.createElement(View, props);
  
  return {
    Text,
    ActivityIndicator,
    Surface,
    useTheme: () => ({
      colors: {
        primary: 'blue',
        error: 'red',
      }
    }),
  };
});

describe('NewsDetailsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', async () => {
    (movieService.getNewsById as jest.Mock).mockReturnValue(new Promise(() => {})); 
    render(<NewsDetailsScreen />);
    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders news details correctly after fetching', async () => {
    const mockNews = {
      id: 'news1',
      title: 'Exciting News',
      content: '<p>This is some content</p>',
      publishDate: '2026-01-11T10:00:00Z',
      category: 'Promotion',
      featuredImage: '/uploads/news.jpg'
    };
    (movieService.getNewsById as jest.Mock).mockResolvedValue(mockNews);

    render(<NewsDetailsScreen />);

    await waitFor(() => {
      expect(screen.getByText('Exciting News')).toBeTruthy();
      expect(screen.getByText('Promotion')).toBeTruthy();
    });
  });

  it('renders error state when fetch fails', async () => {
    (movieService.getNewsById as jest.Mock).mockRejectedValue(new Error('Failed to load'));
    render(<NewsDetailsScreen />);

    await waitFor(() => {
      expect(screen.getByText('An error occurred')).toBeTruthy();
    });
  });
});
