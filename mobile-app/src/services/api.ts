import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// Use hostUri to get the local IP address of the packager host during development
const host = Constants.expoConfig?.hostUri?.split(':').shift();
export const API_BASE_URL = host ? `http://${host}:5000/api` : 'http://localhost:5000/api';
export const BACKEND_URL = host ? `http://${host}:5000` : 'http://localhost:5000';

let onAuthFailure: (() => void) | null = null;

export const setOnAuthFailure = (callback: () => void) => {
  onAuthFailure = callback;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const processMovieData = (data: any) => {
  if (!data) return data;
  if (data.posterUrl && data.posterUrl.startsWith('/uploads/')) {
    return {
      ...data,
      posterUrl: `${BACKEND_URL}${data.posterUrl}`
    };
  }
  return data;
};

const processMovieArray = (data: any) => {
  if (!data) return data;
  if (Array.isArray(data)) {
    return data.map(movie => processMovieData(movie));
  }
  if (data.movies && Array.isArray(data.movies)) {
    return {
      ...data,
      movies: data.movies.map((movie: any) => processMovieData(movie))
    };
  }
  return data;
};

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    if (response.config.url?.includes('/movies')) {
      response.data = processMovieArray(response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');

        // Mobile uses refreshToken in body or header as cookies might not work reliably across domains in RN
        const response = await axios.post(`${API_BASE_URL}/users/refresh-token`, { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        await SecureStore.setItemAsync('accessToken', accessToken);
        if (newRefreshToken) {
          await SecureStore.setItemAsync('refreshToken', newRefreshToken);
        }

        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        if (onAuthFailure) onAuthFailure();
        return Promise.reject(refreshError);
      }
    } else if (error.response?.status === 401) {
      // If we already tried to retry and still got 401, logout
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      if (onAuthFailure) onAuthFailure();
    }
    return Promise.reject(error);
  }
);

export default api;
