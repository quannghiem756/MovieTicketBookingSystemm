import React from 'react';
import { render, screen } from '@testing-library/react-native';
import AppNavigator from './AppNavigator';
import { PaperProvider } from 'react-native-paper';
import theme from '../theme';

// Mock navigation
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    NavigationContainer: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

describe('AppNavigator', () => {
  it('renders all tabs correctly', () => {
    // We wrap in PaperProvider because components might use useTheme
    const component = (
      <PaperProvider theme={theme}>
        <AppNavigator />
      </PaperProvider>
    );

    render(component);

    // Check for Tab names
    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('Movies')).toBeTruthy();
    expect(screen.getByText('My Tickets')).toBeTruthy();
    expect(screen.getByText('Profile')).toBeTruthy();
  });
});
