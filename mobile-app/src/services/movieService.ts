import api from './api';

export const getNowShowing = async (page = 1, limit = 10) => {
  const response = await api.get(`/movies/now-showing?page=${page}&limit=${limit}`);
  return response.data;
};

export const getComingSoon = async (page = 1, limit = 10) => {
  const response = await api.get(`/movies/coming-soon?page=${page}&limit=${limit}`);
  return response.data;
};

export const getNews = async (page = 1, limit = 5) => {
  const response = await api.get(`/news/published?page=${page}&limit=${limit}`);
  return response.data;
};

/**
 * Fetches a specific news article by its ID.
 * 
 * @param {string} id - The ID of the news article to fetch.
 * @returns {Promise<any>} The news article data.
 */
export const getNewsById = async (id: string) => {
  const response = await api.get(`/news/${id}`);
  return response.data;
};

export const getMovies = async (page = 1, limit = 10, search = '', format = '') => {
  let url = `/movies?page=${page}&limit=${limit}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (format) url += `&format=${encodeURIComponent(format)}`;
  
  const response = await api.get(url);
  return response.data;
};

export const getMovieById = async (id: string) => {
  const response = await api.get(`/movies/${id}`);
  return response.data;
};

export const getShowtimeById = async (id: string) => {
  const response = await api.get(`/showtimes/${id}`);
  return response.data;
};

export const getTheaterById = async (id: string) => {
  const response = await api.get(`/theaters/${id}`);
  return response.data;
};

export const getFutureShowtimesByMovieId = async (movieId: string) => {
  const response = await api.get(`/showtimes/movie/${movieId}/future`);
  return response.data;
};

export const holdSeat = async (showtimeId: string, seatId: string) => {
  const response = await api.post('/bookings/hold', { showtimeId, seatId });
  return response.data;
};

export const releaseSeat = async (showtimeId: string, seatId: string) => {
  const response = await api.post('/bookings/release', { showtimeId, seatId });
  return response.data;
};

export const getLockedSeats = async (showtimeId: string) => {
  const response = await api.get(`/bookings/locked-seats/${showtimeId}`);
  return response.data;
};

export const createBooking = async (bookingData: any) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

export const getBookingById = async (id: string) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};

export const getBookingsByUserId = async (userId: string) => {
  const response = await api.get(`/bookings/user/${userId}`);
  return response.data;
};

export const validateCoupon = async (code: string, orderTotal: number, movieId: string) => {
  const response = await api.post('/coupons/validate', { code, orderTotal, movieId });
  return response.data;
};

export const createMomoPayment = async (bookingId: string, redirectUrl?: string) => {
  const response = await api.post(`/payments/create-momo/${bookingId}`, { redirectUrl });
  return response.data;
};

export const getMovieRecommendations = async (query: string) => {
  const response = await api.post('/recommendations', { query });
  return response.data;
};
