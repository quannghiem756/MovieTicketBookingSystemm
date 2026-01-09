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
