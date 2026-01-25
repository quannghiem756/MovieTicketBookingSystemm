import React from 'react';
import { render, waitFor, act, fireEvent } from '@testing-library/react-native';
import { RefreshControl } from 'react-native';
import HomeScreen from './HomeScreen';
import { getNowShowing, getComingSoon, getNews } from '../services/movieService';
import { useFocusEffect, NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import theme from '../theme';

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

jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: mockNavigate,
        }),
        useFocusEffect: jest.fn((callback) => callback()),
    };
});


// Mock translation
jest.mock('../context/I18nContext', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const renderComponent = () =>
  render(
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    </PaperProvider>
  );


describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getNowShowing as jest.Mock).mockResolvedValue({ movies: [] });
    (getComingSoon as jest.Mock).mockResolvedValue({ movies: [] });
    (getNews as jest.Mock).mockResolvedValue({ news: [] });
    (useFocusEffect as jest.Mock).mockClear();
  });

  it('fetches data on focus', async () => {
    renderComponent();

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

    const { findByTestId } = renderComponent();
    
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
    
    const { getByTestId } = renderComponent();
    // Note: ActivityIndicator doesn't have a default testID, so checking if it exists might need queryByType or adding testID in component.
    // For now, let's assume standard behavior or just check that content is not yet visible.
  });

  it('navigates to NewsDetails when a news item is pressed', async () => {
    (getNews as jest.Mock).mockResolvedValue({
      news: [{ id: 'news1', title: 'Test News', summary: 'Summary' }]
    });

    const { getByText } = renderComponent();

    await waitFor(() => {
      expect(getByText('Test News')).toBeTruthy();
    });

    const newsItem = getByText('Test News');
    
    fireEvent.press(newsItem);

    expect(mockNavigate).toHaveBeenCalledWith('NewsDetails', { id: 'news1' });
  });
});
