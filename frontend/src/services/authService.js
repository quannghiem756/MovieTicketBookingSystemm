// frontend/src/services/authService.js
import api from './api';

class AuthService {
  async login(email, password) {
    return api.post('/users/login', { email, password });
  }

  async refreshToken(refreshToken) {
    return api.post('/users/refresh-token', { refreshToken });
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
}

const authService = new AuthService();
export default authService;