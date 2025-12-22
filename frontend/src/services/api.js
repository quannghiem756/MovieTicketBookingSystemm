// services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Function to process movie data to handle uploaded image URLs
const processMovieData = (data) => {
  if (!data) return data;

  // If we have a movie object with posterUrl
  if (data.posterUrl && data.posterUrl.startsWith('/uploads/')) {
    return {
      ...data,
      // Prepend the full backend URL to the relative upload path
      posterUrl: `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${data.posterUrl}`
    };
  }

  return data;
};

// Function to process an array of movies (for pagination responses or lists)
const processMovieArray = (data) => {
  if (!data) return data;

  // If it's an array of movies
  if (Array.isArray(data)) {
    return data.map(movie => processMovieData(movie));
  }

  // If it's a pagination response (with movies array inside)
  if (data.movies && Array.isArray(data.movies)) {
    return {
      ...data,
      movies: data.movies.map(movie => processMovieData(movie))
    };
  }

  // If it's a single movie response (has data property)
  if (data.data) {
    return {
      ...data,
      data: processMovieData(data.data)
    };
  }

  return data;
};

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

// Response interceptor to handle token refresh and image URL fixes
api.interceptors.response.use(
  (response) => {
    // Process the response data to handle uploaded image URLs
    if (response.config.url.includes('/movies')) {
      response.data = processMovieArray(response.data);
    } else if (response.config.url.match(/\/movies\/\w+$/) && !response.config.url.includes('/showtimes')) {
      // Handle single movie retrieval
      if (response.data && response.data.posterUrl) {
        response.data = processMovieData(response.data);
      }
    } else if (response.config.url.includes('/bookings')) {
      // Handle booking responses that might include movie data with posters
      if (response.data && response.data.movie && response.data.movie.posterUrl) {
        response.data.movie = processMovieData(response.data.movie);
      } else if (response.data && Array.isArray(response.data)) {
        response.data = response.data.map(booking => {
          if (booking.movie && booking.movie.posterUrl) {
            return { ...booking, movie: processMovieData(booking.movie) };
          }
          return booking;
        });
      }
    }

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
export const getShowtimes = (page = 1, limit = 10) => api.get(`/showtimes?page=${page}&limit=${limit}`);
export const getShowtimesByMovieId = (movieId) => api.get(`/showtimes/movie/${movieId}`);
export const getFutureShowtimesByMovieId = (movieId) => api.get(`/showtimes/movie/${movieId}/future`);
export const getShowtimesByDate = (date) => api.get(`/showtimes/date?date=${date}`);
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

// Recommendations API
export const getMovieRecommendations = (query) => api.post('/recommendations', { query });

// News API
export const getNews = (page = 1, limit = 10, search = '') => {
  let url = `/news?page=${page}&limit=${limit}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  return api.get(url);
};
export const getNewsById = (id) => api.get(`/news/${id}`);
export const createNews = (news) => api.post('/news', news);
export const updateNews = (id, news) => api.put(`/news/${id}`, news);
export const deleteNews = (id) => api.delete(`/news/${id}`);

// Admin Dashboard API
export const getDashboardStats = () => api.get('/dashboard/stats');
export const getRecentActivity = () => api.get('/dashboard/recent-activity');
export const getPerformanceStats = () => api.get('/dashboard/performance-stats');

export default api;