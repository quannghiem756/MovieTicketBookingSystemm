import { renderHook, act } from '@testing-library/react-native';
import { AuthProvider, useAuth } from './AuthContext';
import authService from '../services/authService';
import * as SecureStore from 'expo-secure-store';
import React from 'react';

jest.mock('../services/authService');
jest.mock('expo-secure-store');

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default values', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Initial loading state
    expect(result.current.loading).toBe(true);
  });

  it('logs in successfully', async () => {
    const mockUser = { id: '1', email: 'test@test.com' };
    (authService.login as jest.Mock).mockResolvedValue({
      user: mockUser,
      accessToken: 'access',
      refreshToken: 'refresh'
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const loginResult = await result.current.login({ email: 'test@test.com', password: 'password' });
      expect(loginResult.success).toBe(true);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('accessToken', 'access');
  });
});
