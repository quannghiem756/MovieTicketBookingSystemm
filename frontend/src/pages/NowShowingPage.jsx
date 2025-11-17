// pages/NowShowingPage.jsx
import React, { useState, useEffect } from 'react';
import { getNowShowing } from '../services/api';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import { useTranslation } from '../context/I18nContext';
import {
  Container,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';

const NowShowingPage = () => {
  const [movies, setMovies] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await getNowShowing(1, 12); // 12 movies per page
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
      const response = await getNowShowing(page, 12);
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
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
    
  if (error) 
    return (
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Box>
      </Container>
    );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        {t('nowShowing.title')}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {/* Left Column */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
          {movies
            .filter((_, index) => index % 2 === 0) // Even indices (0, 2, 4, ...)
            .map(movie => (
              <Box key={movie.id} sx={{ mb: 4 }}>
                <MovieCard movie={movie} />
              </Box>
            ))}
        </Box>
        {/* Right Column */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
          {movies
            .filter((_, index) => index % 2 === 1) // Odd indices (1, 3, 5, ...)
            .map(movie => (
              <Box key={movie.id} sx={{ mb: 4 }}>
                <MovieCard movie={movie} />
              </Box>
            ))}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination 
          currentPage={pagination.currentPage} 
          totalPages={pagination.totalPages} 
          onPageChange={handlePageChange} 
        />
      </Box>
    </Container>
  );
};

export default NowShowingPage;