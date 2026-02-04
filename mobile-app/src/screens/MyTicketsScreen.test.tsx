import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import MyTicketsScreen from './MyTicketsScreen';
import { PaperProvider } from 'react-native-paper';
import theme from '../theme';
import authService from '../services/authService';

// Mock services
jest.mock('../services/authService', () => ({
  getBookingHistory: jest.fn(),
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
    locale: 'en',
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

// Mock expo-vector-icons
jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

// Mock qrcode
jest.mock('react-native-qrcode-svg', () => 'QRCode');

const renderComponent = () =>
  render(
    <PaperProvider theme={theme}>
      <MyTicketsScreen />
    </PaperProvider>
  );

describe('MyTicketsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches bookings on mount', async () => {
    (authService.getBookingHistory as jest.Mock).mockResolvedValue([]);
    renderComponent();

    await waitFor(() => {
      expect(authService.getBookingHistory).toHaveBeenCalled();
    });
  });

  it('displays empty state when no tickets', async () => {
    (authService.getBookingHistory as jest.Mock).mockResolvedValue([]);
    const { getByText } = renderComponent();

    await waitFor(() => {
      expect(getByText('tickets.noTickets')).toBeTruthy();
    });
  });

  it('displays tickets when available', async () => {
    (authService.getBookingHistory as jest.Mock).mockResolvedValue([
      {
        id: 'booking1',
        status: 'confirmed',
        movie: { title: 'Test Movie' },
        showtime: { showTime: '10:00', showDate: '2026-02-04' },
        theater: { name: 'Test Theater' },
        seatIds: ['A1', 'A2'],
        totalPrice: 200000,
      },
    ]);

    const { getByText } = renderComponent();

    await waitFor(() => {
      expect(getByText('Test Movie')).toBeTruthy();
      expect(getByText('Test Theater')).toBeTruthy();
    });
  });

  it('opens modal when a ticket is pressed', async () => {
    (authService.getBookingHistory as jest.Mock).mockResolvedValue([
      {
        id: 'booking1',
        status: 'confirmed',
        movie: { title: 'Test Movie' },
        showtime: { showTime: '10:00', showDate: '2026-02-04' },
        theater: { name: 'Test Theater' },
        seatIds: ['A1', 'A2'],
        totalPrice: 200000,
      },
    ]);

    const { getByText, queryByText } = renderComponent();

    await waitFor(() => {
      expect(getByText('tickets.tapToView')).toBeTruthy();
    });

    fireEvent.press(getByText('tickets.tapToView'));

    await waitFor(() => {
        expect(getByText('tickets.seatsLabel')).toBeTruthy();
        expect(getByText('tickets.instruction')).toBeTruthy();
    });
  });
});