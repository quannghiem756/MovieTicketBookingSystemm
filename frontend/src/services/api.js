// services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${API_BASE_URL}/users/refresh-token`, {
          refreshToken
        });

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Movies API
export const getMovies = (page = 1, limit = 10) => api.get(`/movies?page=${page}&limit=${limit}`);
export const getNowShowing = (page = 1, limit = 10) => api.get(`/movies/now-showing?page=${page}&limit=${limit}`);
export const getComingSoon = (page = 1, limit = 10) => api.get(`/movies/coming-soon?page=${page}&limit=${limit}`);
export const getMovieById = (id) => api.get(`/movies/${id}`);
export const createMovie = (movie) => api.post('/movies', movie);
export const updateMovie = (id, movie) => api.put(`/movies/${id}`, movie);
export const deleteMovie = (id) => api.delete(`/movies/${id}`);

// Showtimes API
export const getShowtimesByMovieId = (movieId) => api.get(`/showtimes/movie/${movieId}`);
export const getShowtimeById = (id) => api.get(`/showtimes/${id}`);
export const createShowtime = (showtime) => api.post('/showtimes', showtime);
export const updateShowtime = (id, showtime) => api.put(`/showtimes/${id}`, showtime);
export const deleteShowtime = (id) => api.delete(`/showtimes/${id}`);

// Theaters API
export const getTheaters = () => api.get('/theaters');
export const getTheaterById = (id) => api.get(`/theaters/${id}`);
export const createTheater = (theater) => api.post('/theaters', theater);
export const updateTheater = (id, theater) => api.put(`/theaters/${id}`, theater);
export const deleteTheater = (id) => api.delete(`/theaters/${id}`);

// Bookings API
export const getBookingsByUserId = (userId) => api.get(`/bookings/user/${userId}`);
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const createBooking = (booking) => api.post('/bookings', booking);
export const confirmBooking = (id) => api.put(`/bookings/${id}/confirm`);
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`);

// Payment API
export const createMomoPayment = (bookingId) => api.post(`/payments/create-momo/${bookingId}`);

// Users API
export const createUser = (user) => api.post('/users', user);
export const loginUser = (credentials) => api.post('/users/login', credentials);
export const getUserById = (id) => api.get(`/users/${id}`);
export const getUserByEmail = (email) => api.get(`/users/email/${email}`);
export const updateUser = (id, user) => api.put(`/users/${id}`, user);
export const deleteUser = (id) => api.delete(`/users/${id}`);

export default api;