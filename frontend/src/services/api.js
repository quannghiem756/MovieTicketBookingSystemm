// services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Movies API
export const getMovies = () => api.get('/movies');
export const getNowShowing = () => api.get('/movies/now-showing');
export const getComingSoon = () => api.get('/movies/coming-soon');
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

// Bookings API
export const getBookingsByUserId = (userId) => api.get(`/bookings/user/${userId}`);
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const createBooking = (booking) => api.post('/bookings', booking);
export const confirmBooking = (id) => api.put(`/bookings/${id}/confirm`);
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`);

// Users API
export const createUser = (user) => api.post('/users', user);
export const loginUser = (credentials) => api.post('/users/login', credentials);
export const getUserById = (id) => api.get(`/users/${id}`);
export const getUserByEmail = (email) => api.get(`/users/email/${email}`);
export const updateUser = (id, user) => api.put(`/users/${id}`, user);
export const deleteUser = (id) => api.delete(`/users/${id}`);

export default api;