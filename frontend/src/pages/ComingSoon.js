// pages/ComingSoon.js
import React, { useState, useEffect } from 'react';
import { getComingSoon } from '../services/api';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import { useTranslation } from '../contexts/I18nContext';

const ComingSoon = () => {
  const [movies, setMovies] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await getComingSoon(1, 12); // 12 movies per page
        setMovies(response.data.movies);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages
        });
        setLoading(false);
      } catch (err) {
        setError(t('common.error'));
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handlePageChange = async (page) => {
    try {
      setLoading(true);
      const response = await getComingSoon(page, 12);
      setMovies(response.data.movies);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages
      });
      setLoading(false);
    } catch (err) {
      setError(t('common.error'));
      setLoading(false);
    }
  };

  if (loading && !movies.length) 
    return <div className="text-center py-10 text-xl">{t('common.loading')}</div>;
  if (error) return <div className="text-center py-10 text-xl text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">{t('comingSoon.title')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      <Pagination 
        currentPage={pagination.currentPage} 
        totalPages={pagination.totalPages} 
        onPageChange={handlePageChange} 
      />
    </div>
  );
};

export default ComingSoon;