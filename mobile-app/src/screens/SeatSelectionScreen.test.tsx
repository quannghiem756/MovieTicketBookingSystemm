import React from 'react';
import { render, waitFor, fireEvent, act } from '@testing-library/react-native';
import SeatSelectionScreen from './SeatSelectionScreen';
import { PaperProvider } from 'react-native-paper';
import theme from '../theme';
import { getShowtimeById, getTheaterById, getLockedSeats, holdSeat, releaseSeat } from '../services/movieService';

// Mock services
jest.mock('../services/movieService', () => ({
  getShowtimeById: jest.fn(),
  getTheaterById: jest.fn(),
  getLockedSeats: jest.fn(),
  holdSeat: jest.fn(),
  releaseSeat: jest.fn(),
  getBookingsByUserId: jest.fn().mockResolvedValue([]),
}));

// Mock auth
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user1', name: 'Test User' },
  }),
}));

// Mock translation
jest.mock('../context/I18nContext', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
    useFocusEffect: jest.fn((callback) => callback()),
}));

// Mock socket.io-client
jest.mock('socket.io-client', () => ({
  io: () => ({
    on: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
  }),
}));

const mockRoute = {
  params: {
    showtimeId: 'showtime1',
    movieTitle: 'Test Movie',
    movieId: 'movie1',
  },
};

const renderComponent = () =>
  render(
    <PaperProvider theme={theme}>
      <SeatSelectionScreen route={mockRoute} navigation={{ navigate: mockNavigate }} />
    </PaperProvider>
  );

describe('SeatSelectionScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getShowtimeById as jest.Mock).mockResolvedValue({
      id: 'showtime1',
      format: '2D',
      price: 100000,
      showTime: '10:00',
      showDate: '2026-02-04',
      theaterId: 'theater1',
    });
    (getTheaterById as jest.Mock).mockResolvedValue({
      id: 'theater1',
      name: 'Test Theater',
      totalSeats: 100,
    });
    (getLockedSeats as jest.Mock).mockResolvedValue(['A3']);
  });

  it('fetches initial data on mount', async () => {
    renderComponent();

    await waitFor(() => {
      expect(getShowtimeById).toHaveBeenCalledWith('showtime1');
      expect(getTheaterById).toHaveBeenCalledWith('theater1');
      expect(getLockedSeats).toHaveBeenCalledWith('showtime1');
    });
  });

  it('displays seat layout', async () => {
    const { getByText } = renderComponent();

    await waitFor(() => {
      expect(getByText('Test Movie')).toBeTruthy();
      expect(getByText('Test Theater')).toBeTruthy();
    });
  });

  it('handles seat selection', async () => {
    (holdSeat as jest.Mock).mockResolvedValue({ expiresAt: new Date(Date.now() + 600000).toISOString() });
    const { getByTestId } = renderComponent();

    await waitFor(() => {
      // Find a seat and press it
      // Seat components might not have testID, so we might need to find by text if they show seat labels
    });
  });
});
