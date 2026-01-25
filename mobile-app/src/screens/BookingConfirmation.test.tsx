import React from 'react';
import { render, screen } from '@testing-library/react-native';
import BookingConfirmation from './BookingConfirmation';
import { PaperProvider } from 'react-native-paper';
import theme from '../theme';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
    useRoute: () => ({
      params: {
        bookingData: {
          bookingId: 'BK123456',
          movieTitle: 'Test Movie',
          theaterName: 'Test Theater',
          showDate: '2026-01-20',
          showTime: '10:00 AM',
          seatIds: ['A1', 'A2'],
          totalPrice: 200000,
          bookingDate: '2026-01-10T15:00:00Z',
          validationToken: 'token123'
        }
      }
    }),
  };
});

// Mock I18nContext
jest.mock('../context/I18nContext', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    locale: 'en',
  }),
}));

// Mock react-native-qrcode-svg
jest.mock('react-native-qrcode-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  return (props: any) => React.createElement(View, props);
});

describe('BookingConfirmation Screen', () => {
  it('renders booking details correctly', () => {
    render(
      <PaperProvider theme={theme}>
        <BookingConfirmation />
      </PaperProvider>
    );

    expect(screen.getByText('Test Movie')).toBeTruthy();
    expect(screen.getByText('Test Theater')).toBeTruthy();
    expect(screen.getByText('A1, A2')).toBeTruthy();
  });
});
