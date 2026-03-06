import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import CheckoutScreen from './CheckoutScreen';
import { useBooking } from '../context/BookingContext';
import { useTranslation } from '../context/I18nContext';

// Mock services
jest.mock('../services/movieService', () => ({
  createBooking: jest.fn(),
  validateCoupon: jest.fn(),
  createMomoPayment: jest.fn(),
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
  const { View, Text, TouchableOpacity, TextInput } = require('react-native');
  return {
    useTheme: () => ({
      colors: {
        primary: '#000',
      },
    }),
    Surface: (props: any) => <View {...props} />,
    ActivityIndicator: (props: any) => <View {...props} />,
    IconButton: (props: any) => <TouchableOpacity {...props} />,
    Title: (props: any) => <Text {...props} />,
    Text: (props: any) => <Text {...props} />,
    Divider: (props: any) => <View {...props} />,
    Card: Object.assign(
        (props: any) => <View {...props} />,
        { Content: (props: any) => <View {...props} /> }
    ),
    TextInput: (props: any) => <TextInput {...props} />,
    List: {
        Item: (props: any) => <View {...props} />,
        Icon: (props: any) => <View {...props} />,
    },
  };
});

// Mock translation
jest.mock('../context/I18nContext', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    locale: 'en',
  }),
}));

// Mock booking context
let mockTimeLeft = 600;
let mockIsTimerActive = true;
jest.mock('../context/BookingContext', () => ({
  useBooking: () => ({
    timeLeft: mockTimeLeft,
    isTimerActive: mockIsTimerActive,
  }),
}));

// Mock components
jest.mock('../components/TimerBanner', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return () => <Text>TimerBanner Mock</Text>;
});

jest.mock('../components/Button', () => {
  const React = require('react');
  const { TouchableOpacity, Text } = require('react-native');
  return (props: any) => (
    <TouchableOpacity onPress={props.onPress} disabled={props.disabled}>
      <Text>{props.children}</Text>
    </TouchableOpacity>
  );
});

// Mock navigation
const mockGoBack = jest.fn();
const mockRoute = {
  params: {
    showtimeId: 'showtime1',
    selectedSeats: ['A1', 'A2'],
    movieTitle: 'Test Movie',
    pricePerSeat: 100000,
    showTime: '10:00',
    showDate: '2026-02-04',
    theaterName: 'Test Theater',
    movieId: 'movie1',
  },
};

const renderComponent = () =>
  render(
    <CheckoutScreen route={mockRoute} navigation={{ goBack: mockGoBack }} />
  );

describe('CheckoutScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTimeLeft = 600;
    mockIsTimerActive = true;
  });

  it('renders correctly', () => {
    const { getByText } = renderComponent();
    expect(getByText('booking.checkout.title')).toBeTruthy();
    expect(getByText('Test Movie')).toBeTruthy();
  });

  it('displays TimerBanner', () => {
    const { getByText } = renderComponent();
    expect(getByText('TimerBanner Mock')).toBeTruthy();
  });

  it('redirects back when timer reaches zero', async () => {
    mockTimeLeft = 0;
    const { rerender } = renderComponent();

    // Rerender to trigger useEffect
    rerender(<CheckoutScreen route={mockRoute} navigation={{ goBack: mockGoBack }} />);

    await waitFor(() => {
      expect(mockGoBack).toHaveBeenCalled();
    });
  });
});
