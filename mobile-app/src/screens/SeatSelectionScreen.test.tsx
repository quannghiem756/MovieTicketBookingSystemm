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

// Mock useTheme and components
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    useTheme: () => ({
      colors: {
        primary: '#000',
        onSurfaceDisabled: '#ccc',
        outline: '#000',
      },
    }),
    Surface: (props: any) => <View {...props} />,
    ActivityIndicator: (props: any) => <View {...props} />,
    IconButton: (props: any) => <TouchableOpacity {...props} />,
    Title: (props: any) => <Text {...props} />,
    Text: (props: any) => <Text {...props} />,
    Divider: (props: any) => <View {...props} />,
    FAB: (props: any) => <TouchableOpacity {...props} />,
    Button: (props: any) => <TouchableOpacity {...props}><Text>{props.children}</Text></TouchableOpacity>,
  };
});

// Mock custom Button component
jest.mock('../components/Button', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  return (props: any) => (
    <TouchableOpacity onPress={props.onPress} disabled={props.disabled}>
      <Text>{props.children}</Text>
    </TouchableOpacity>
  );
});

// Mock translation
jest.mock('../context/I18nContext', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock booking context
const mockStartTimer = jest.fn();
const mockSetHeldSeats = jest.fn();
let mockHeldSeats: string[] = [];
let mockTimeLeft = 600;

jest.mock('../context/BookingContext', () => ({
  useBooking: () => ({
    timeLeft: mockTimeLeft,
    startTimer: mockStartTimer,
    stopTimer: jest.fn(),
    resetTimer: jest.fn(),
    heldSeats: mockHeldSeats,
    setHeldSeats: mockSetHeldSeats,
    isTimerActive: true,
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
    <SeatSelectionScreen route={mockRoute} navigation={{ navigate: mockNavigate }} />
  );

describe('SeatSelectionScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockHeldSeats = [];
    mockTimeLeft = 600;
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
      seatMap: [
        [
          { id: 'A1', number: '1', row: 'A', type: 'standard' },
          { id: 'A2', number: '2', row: 'A', type: 'standard' },
        ]
      ]
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
      expect(getByText(/Test Theater/)).toBeTruthy();
    });
  });

  it('displays the countdown timer from global state', async () => {
    const { getByText } = renderComponent();

    await waitFor(() => {
      // 600 seconds = 10:00
      expect(getByText('booking.seats.footer.expires')).toBeTruthy();
    });
  });

  it('handles seat selection and starts timer', async () => {
    (holdSeat as jest.Mock).mockResolvedValue({ expiresAt: new Date(Date.now() + 600000).toISOString() });
    const { getByText } = renderComponent();

    await waitFor(() => {
      expect(getByText('1')).toBeTruthy();
    });

    fireEvent.press(getByText('1'));

    await waitFor(() => {
      expect(holdSeat).toHaveBeenCalledWith('showtime1', 'A1');
      expect(mockStartTimer).toHaveBeenCalled();
    });
  });

  it('navigates to checkout when confirm is pressed', async () => {
    mockHeldSeats = ['A1'];
    const { getByText } = renderComponent();

    await waitFor(() => {
      expect(getByText('booking.seats.confirm')).toBeTruthy();
    });

    fireEvent.press(getByText('booking.seats.confirm'));

    expect(mockNavigate).toHaveBeenCalledWith('Checkout', expect.objectContaining({
      showtimeId: 'showtime1',
      selectedSeats: ['A1'],
    }));
  });

  it('handles timer expiration', async () => {
    mockTimeLeft = 0;
    const { rerender } = renderComponent();
    
    // Rerender to trigger effect
    rerender(<SeatSelectionScreen route={mockRoute} navigation={{ navigate: mockNavigate }} />);

    await waitFor(() => {
        expect(mockSetHeldSeats).toHaveBeenCalledWith([]);
    });
  });

  it('handles seat releasing', async () => {
    mockHeldSeats = ['A1'];
    (releaseSeat as jest.Mock).mockResolvedValue({});
    const { getByText } = renderComponent();

    await waitFor(() => {
      expect(getByText('1')).toBeTruthy();
    });

    fireEvent.press(getByText('1'));

    await waitFor(() => {
      expect(releaseSeat).toHaveBeenCalledWith('showtime1', 'A1');
      expect(mockSetHeldSeats).toHaveBeenCalled();
    });
  });

  it('reverts optimistic update when hold seat fails', async () => {
    (holdSeat as jest.Mock).mockRejectedValue({ response: { data: { error: 'Seat already held' } } });
    const { getByText } = renderComponent();

    await waitFor(() => {
      expect(getByText('1')).toBeTruthy();
    });

    fireEvent.press(getByText('1'));

    await waitFor(() => {
      expect(holdSeat).toHaveBeenCalledWith('showtime1', 'A1');
      expect(mockSetHeldSeats).toHaveBeenCalledWith([]); // Revert to empty
    });
  });
});
