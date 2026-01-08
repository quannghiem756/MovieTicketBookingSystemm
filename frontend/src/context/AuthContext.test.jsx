
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import authService from '../services/authService';

// Mock authService
jest.mock('../services/authService');
// Mock api
jest.mock('../services/api', () => ({
    defaults: { headers: { common: {} } },
    interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } }
}));

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

describe('AuthContext', () => {
    it('should return the full response object on failed login', async () => {
        const mockError = {
            response: {
                status: 403,
                data: { error: 'Email not verified' }
            }
        };
        authService.login.mockRejectedValue(mockError);

        const { result } = renderHook(() => useAuth(), { wrapper });

        let loginResult;
        await act(async () => {
            loginResult = await result.current.login('test@test.com', 'password');
        });

        expect(loginResult.success).toBe(false);
        expect(loginResult.response).toBeDefined();
        expect(loginResult.response.status).toBe(403);
    });
});
