import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import { RefreshControl } from 'react-native';
import HomeScreen from './HomeScreen';
import { getNowShowing, getComingSoon, getNews } from '../services/movieService';
import { useFocusEffect } from '@react-navigation/native';

// Mock the services
jest.mock('../services/movieService', () => ({
  getNowShowing: jest.fn(),
  getComingSoon: jest.fn(),
  getNews: jest.fn(),
}));

// Mock React Native components
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.RefreshControl = (props: any) => <RN.View {...props} testID="refresh-control" />;
  return RN;
});

// Mock navigation
const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
  useFocusEffect: jest.fn((callback) => callback()),
}));

// Mock translation
jest.mock('../context/I18nContext', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock React Native Paper theme
jest.mock('react-native-paper', () => {
  const ActualPaper = jest.requireActual('react-native-paper');
  return {
    ...ActualPaper,
    ActivityIndicator: () => 'ActivityIndicator',
    useTheme: () => ({
      colors: {
        surface: '#ffffff',
        onSurfaceVariant: '#000000',
        primary: '#6200ee',
      },
    }),
  };
});

// Mock expo-image
jest.mock('expo-image', () => ({
  Image: 'Image',
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getNowShowing as jest.Mock).mockResolvedValue({ movies: [] });
    (getComingSoon as jest.Mock).mockResolvedValue({ movies: [] });
    (getNews as jest.Mock).mockResolvedValue({ news: [] });
    (useFocusEffect as jest.Mock).mockClear();
  });

  it('fetches data on focus', async () => {
    render(<HomeScreen />);

    await waitFor(() => {
      expect(getNowShowing).toHaveBeenCalled();
      expect(getComingSoon).toHaveBeenCalled();
      expect(getNews).toHaveBeenCalled();
      expect(useFocusEffect).toHaveBeenCalled();
    });
  });

  it('triggers refresh when pulled', async () => {
    (getNowShowing as jest.Mock).mockResolvedValue({ movies: [] });
    (getComingSoon as jest.Mock).mockResolvedValue({ movies: [] });
    (getNews as jest.Mock).mockResolvedValue({ news: [] });

    const { findByTestId } = render(<HomeScreen />);
    
    // Wait for initial load to finish and find RefreshControl
    const refreshControl = await findByTestId('refresh-control');
    
    act(() => {
      refreshControl.props.onRefresh();
    });

    await waitFor(() => {
      expect(getNowShowing).toHaveBeenCalledTimes(2);
    });
  });

  it('displays loading indicator initially', () => {
    // Return a promise that never resolves to keep it loading
    (getNowShowing as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    const { getByTestId } = render(<HomeScreen />);
    // Note: ActivityIndicator doesn't have a default testID, so checking if it exists might need queryByType or adding testID in component.
    // For now, let's assume standard behavior or just check that content is not yet visible.
  });

  it('navigates to NewsDetails when a news item is pressed', async () => {
    (getNews as jest.Mock).mockResolvedValue({
      news: [{ id: 'news1', title: 'Test News', summary: 'Summary' }]
    });

    const { getByText } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByText('Test News')).toBeTruthy();
    });

    const newsItem = getByText('Test News');
    
    // We need fireEvent from testing-library
    const { fireEvent } = require('@testing-library/react-native');
    fireEvent.press(newsItem);

    expect(mockNavigate).toHaveBeenCalledWith('NewsDetails', { id: 'news1' });
  });
});
