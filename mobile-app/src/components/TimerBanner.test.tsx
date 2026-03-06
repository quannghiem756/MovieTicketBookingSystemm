import React from 'react';
import { render } from '@testing-library/react-native';
import TimerBanner from './TimerBanner';
import { useBooking } from '../context/BookingContext';
import { useTranslation } from '../context/I18nContext';

// Mock useBooking
jest.mock('../context/BookingContext', () => ({
  useBooking: jest.fn(),
}));

// Mock useTranslation
jest.mock('../context/I18nContext', () => ({
  useTranslation: () => ({
    t: (key: string, params?: any) => {
        if (params && params.time) return `${key} ${params.time}`;
        return key;
    },
  }),
}));

// Mock react-native-paper
jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    Surface: (props: any) => <View {...props} />,
    Text: (props: any) => <Text {...props} />,
    useTheme: () => ({
      colors: {
        primary: '#000',
      },
    }),
  };
});

describe('TimerBanner', () => {
  it('renders nothing when timer is not active', () => {
    (useBooking as jest.Mock).mockReturnValue({
      timeLeft: 0,
      isTimerActive: false,
    });

    const { toJSON } = render(<TimerBanner />);
    expect(toJSON()).toBeNull();
  });

  it('renders correctly when timer is active', () => {
    (useBooking as jest.Mock).mockReturnValue({
      timeLeft: 125, // 2:05
      isTimerActive: true,
    });

    const { getByText } = render(<TimerBanner />);
    expect(getByText('booking.seats.footer.expires 2:05')).toBeTruthy();
  });

  it('formats time correctly for single digits', () => {
    (useBooking as jest.Mock).mockReturnValue({
      timeLeft: 65, // 1:05
      isTimerActive: true,
    });

    const { getByText } = render(<TimerBanner />);
    expect(getByText(/1:05/)).toBeTruthy();
  });
});
