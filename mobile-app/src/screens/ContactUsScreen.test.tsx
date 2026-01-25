import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ContactUsScreen from './ContactUsScreen';
import { createTicket } from '../services/supportService';
import { Alert } from 'react-native';

// Mock services
jest.mock('../services/supportService', () => ({
  createTicket: jest.fn(),
}));

// Mock Auth context
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { name: 'Test User', email: 'test@example.com' },
  }),
}));

// Mock I18n context
jest.mock('../context/I18nContext', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock react-native-paper components to avoid hook issues in tests
jest.mock('react-native-paper', () => {
  const RN = require('react-native');
  return {
    Text: ({ children, ...props }: any) => <RN.Text {...props}>{children}</RN.Text>,
    Title: ({ children, ...props }: any) => <RN.Text style={{ fontSize: 20, fontWeight: 'bold' }} {...props}>{children}</RN.Text>,
    HelperText: ({ children, visible, ...props }: any) => visible ? <RN.Text {...props}>{children}</RN.Text> : null,
    Menu: ({ children, visible, anchor }: any) => visible ? <RN.View>{children}</RN.View> : <RN.View>{anchor}</RN.View>,
    TouchableRipple: ({ children, ...props }: any) => <RN.TouchableOpacity {...props}>{children}</RN.TouchableOpacity>,
    useTheme: () => ({
      colors: {
        primary: '#000',
        surface: '#fff',
        outline: '#ccc',
        onSurface: '#000',
        onSurfaceVariant: '#666',
      },
    }),
    TextInput: (props: any) => <RN.TextInput placeholder={props.label} {...props} />,
    Button: ({ children, onPress, loading, disabled }: any) => (
      <RN.TouchableOpacity onPress={onPress} disabled={loading || disabled}>
        <RN.Text>{children}</RN.Text>
      </RN.TouchableOpacity>
    ),
  };
});

// Mock Alert
jest.spyOn(Alert, 'alert');

const mockGoBack = jest.fn();
const mockNavigation = { goBack: mockGoBack };

const renderComponent = () =>
  render(
    <ContactUsScreen navigation={mockNavigation} />
  );

describe('ContactUsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('pre-fills name and email if user is logged in', () => {
    const { getByDisplayValue } = renderComponent();
    expect(getByDisplayValue('Test User')).toBeTruthy();
    expect(getByDisplayValue('test@example.com')).toBeTruthy();
  });

  it('shows error if fields are missing', async () => {
    const { getByText } = renderComponent();
    const submitButton = getByText('contactUs.submit');

    fireEvent.press(submitButton);

    expect(Alert.alert).toHaveBeenCalledWith('contactUs.error', expect.any(String));
    expect(createTicket).not.toHaveBeenCalled();
  });

  it('calls createTicket and shows success alert on valid submission', async () => {
    (createTicket as jest.Mock).mockResolvedValue({ success: true });
    const { getByText, getByPlaceholderText } = renderComponent();

    // Fill in phone and message
    fireEvent.changeText(getByPlaceholderText('contactUs.phone'), '0123456789');
    fireEvent.changeText(getByPlaceholderText('contactUs.message'), 'I have a problem');

    const submitButton = getByText('contactUs.submit');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(createTicket).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        phone: '0123456789',
        category: 'General Question',
        message: 'I have a problem',
      });
      expect(Alert.alert).toHaveBeenCalledWith('contactUs.submitted', expect.any(String), expect.any(Array));
    });
  });
});