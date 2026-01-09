import api from './api';
import * as SecureStore from 'expo-secure-store';

class AuthService {
  async login(credentials: any) {
    const response = await api.post('/users/login', credentials);
    return response.data;
  }

  async googleLogin(idToken: string) {
    const response = await api.post('/users/google-login', { idToken });
    return response.data;
  }

  async register(userData: any) {
    const response = await api.post('/users', userData);
    return response.data;
  }

  async verifyRegistration(email: string, otp: string) {
    const response = await api.post('/users/verify-registration', { email, otp });
    return response.data;
  }

  async resendVerificationOTP(email: string) {
    const response = await api.post('/users/resend-verification-otp', { email });
    return response.data;
  }

  async forgotPassword(email: string) {
    const response = await api.post('/users/forgot-password', { email });
    return response.data;
  }

  async resetPassword(data: any) {
    const response = await api.post('/users/reset-password', data);
    return response.data;
  }

  async logout() {
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    return api.post('/users/logout', { refreshToken });
  }

  async getCurrentUser(id: string) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  }

  async updateProfile(id: string, userData: any) {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  }

  async getBookingHistory(userId: string) {
    const response = await api.get(`/bookings/user/${userId}`);
    return response.data;
  }
}

export default new AuthService();
