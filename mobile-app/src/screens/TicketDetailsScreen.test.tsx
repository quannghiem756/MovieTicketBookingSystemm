import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TicketDetailsScreen from './TicketDetailsScreen';
import { getTicketByToken, replyToTicket } from '../services/supportService';
import { Alert } from 'react-native';

// Mock services
jest.mock('../services/supportService', () => ({
  getTicketByToken: jest.fn(),
  replyToTicket: jest.fn(),
}));

// Mock navigation/route
jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({
    params: { token: 'test-token' },
  }),
  useNavigation: () => ({
    goBack: jest.fn(),
  }),
}));

// Mock I18n context
jest.mock('../context/I18nContext', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock internal components
jest.mock('../components/Input', () => {
  const RN = require('react-native');
  return (props: any) => <RN.TextInput placeholder={props.placeholder || props.label} {...props} />;
});

jest.mock('../components/Button', () => {
  const RN = require('react-native');
  return ({ children, onPress }: any) => (
    <RN.TouchableOpacity onPress={onPress}>
      <RN.Text>{children}</RN.Text>
    </RN.TouchableOpacity>
  );
});

// Mock react-native-paper components to avoid hook issues in tests
jest.mock('react-native-paper', () => {
  const RN = require('react-native');
  return {
    Text: ({ children, ...props }: any) => <RN.Text {...props}>{children}</RN.Text>,
    Title: ({ children, ...props }: any) => <RN.Text style={{ fontSize: 20, fontWeight: 'bold' }} {...props}>{children}</RN.Text>,
    ActivityIndicator: (props: any) => <RN.ActivityIndicator {...props} />,
    IconButton: ({ icon, onPress }: any) => (
      <RN.TouchableOpacity onPress={onPress}>
        <RN.Text>{icon}</RN.Text>
      </RN.TouchableOpacity>
    ),
    Surface: ({ children, ...props }: any) => <RN.View {...props}>{children}</RN.View>,
    Divider: () => <RN.View />,
    useTheme: () => ({
      colors: {
        primary: '#000',
        surface: '#fff',
        outline: '#ccc',
        onSurface: '#000',
        onSurfaceVariant: '#666',
        error: '#f00',
      },
    }),
  };
});

// Mock RenderHTML
jest.mock('react-native-render-html', () => {
  const RN = require('react-native');
  return (props: any) => <RN.Text>{props.source.html}</RN.Text>;
});

// Mock Alert
jest.spyOn(Alert, 'alert');

const renderComponent = () => render(<TicketDetailsScreen />);

describe('TicketDetailsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and displays ticket details', async () => {
    const mockTicket = {
      subject: 'Help me',
      category: 'Account',
      status: 'Open',
      message: 'My original message',
      created_at: new Date().toISOString(),
    };
    const mockComments = [
      { _id: '1', content: 'Staff reply', senderRole: 'Staff', createdAt: new Date().toISOString() },
    ];

    (getTicketByToken as jest.Mock).mockResolvedValue({ ticket: mockTicket, comments: mockComments });

    const { getByText } = renderComponent();

    await waitFor(() => {
      expect(getTicketByToken).toHaveBeenCalledWith('test-token');
      expect(getByText('Help me')).toBeTruthy();
      expect(getByText('My original message')).toBeTruthy();
      expect(getByText('Staff reply')).toBeTruthy();
    });
  });

  it('handles reply submission', async () => {
    const mockTicket = { subject: 'Help', category: 'Account', status: 'Open', message: 'Msg', created_at: new Date().toISOString() };
    (getTicketByToken as jest.Mock).mockResolvedValue({ ticket: mockTicket, comments: [] });
    (replyToTicket as jest.Mock).mockResolvedValue({ success: true });

    const { getByPlaceholderText, getByText } = renderComponent();

    await waitFor(() => expect(getByText('Help')).toBeTruthy());

    const input = getByPlaceholderText('contactUs.replyPlaceholder');
    fireEvent.changeText(input, 'My reply');
    
    // Find send icon button
    const sendButton = getByText('send');
    fireEvent.press(sendButton);

    await waitFor(() => {
      expect(replyToTicket).toHaveBeenCalledWith('test-token', 'My reply');
      expect(getTicketByToken).toHaveBeenCalledTimes(2);
    });
  });
});