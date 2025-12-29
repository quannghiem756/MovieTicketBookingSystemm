// frontend/src/services/authService.js
import api, { googleLogin as apiGoogleLogin, logoutUser } from './api';

class AuthService {
  async login(email, password) {
    return api.post('/users/login', { email, password });
  }

  async googleLogin(idToken) {
    return apiGoogleLogin(idToken);
  }

  async logout() {
    return logoutUser();
  }

  async refreshToken() {
    return api.post('/users/refresh-token');
  }

  async register(userData) {
    return api.post('/users', userData);
  }

  async getUserById(id) {
    return api.get(`/users/${id}`);
  }

  async updateUser(id, userData) {
    return api.put(`/users/${id}`, userData);
  }

  async getUsers() {
    return api.get('/users');
  }

  async deleteUser(id) {
    return api.delete(`/users/${id}`);
  }
}

export default new AuthService();
