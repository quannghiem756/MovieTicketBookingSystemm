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

export const getMovies = async (page = 1, limit = 10, search = '', format = '') => {
  let url = `/movies?page=${page}&limit=${limit}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  // Backend support for format filtering might need to be verified, but assuming query param
  if (format) url += `&format=${encodeURIComponent(format)}`;
  
  const response = await api.get(url);
  return response.data;
};

export const getMovieById = async (id: string) => {
  const response = await api.get(`/movies/${id}`);
  return response.data;
};