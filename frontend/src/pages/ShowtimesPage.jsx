// pages/ShowtimesPage.jsx
import React, { useState, useEffect } from 'react';
import { getNowShowing, getComingSoon, getShowtimesByDate } from '../services/api';
import ShowtimeMovieCard from '../components/ShowtimeMovieCard';
import Pagination from '../components/Pagination';
import { useTranslation } from '../context/I18nContext';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Button,
  Paper
} from '@mui/material';

const ShowtimesPage = () => {
  const [movies, setMovies] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const { t } = useTranslation();

  // Generate next 7 days for date filtering
  useEffect(() => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    setAvailableDates(dates);
    setSelectedDate(today); // Default to today
  }, []);

  // Fetch showtimes for the selected date
  useEffect(() => {
    if (selectedDate) {
      fetchShowtimesByDate();
    }
  }, [selectedDate]);

  const fetchShowtimesByDate = async () => {
    try {
      setLoading(true);
      setError(null);

      // Format date to YYYY-MM-DD
      const dateStr = selectedDate.toISOString().split('T')[0];

      const response = await getShowtimesByDate(dateStr, true);
      const showtimes = response.data || [];

      // Group showtimes by movie ID and create unique movie entries
      const showtimesByMovie = {};
      showtimes.forEach(showtime => {
        const movieId = showtime.movieId;
        if (!showtimesByMovie[movieId]) {
          showtimesByMovie[movieId] = {
            ...showtime.movie, // Include movie details
            showtimes: []
          };
        }
        showtimesByMovie[movieId].showtimes.push(showtime);
      });

      // Convert to array and set movies
      const moviesWithShowtimes = Object.values(showtimesByMovie);
      setMovies(moviesWithShowtimes);
      setPagination({
        currentPage: 1,
        totalPages: Math.ceil(moviesWithShowtimes.length / 12) || 1
      });
      setLoading(false);
    } catch (err) {
      setError(t('common.error'));
      setLoading(false);
    }
  };

  const handlePageChange = async (page) => {
    // In this implementation, we're not making additional API calls for pagination
    // since we already have all the movies. We just update the pagination state.
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  if (loading && movies.length === 0)
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

  // Calculate which movies to display based on current page
  const itemsPerPage = 12;
  const startIndex = (pagination.currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedMovies = movies.slice(startIndex, endIndex);
  console.log('Displayed Movies:', displayedMovies);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        {t('showtimes.title', 'Showtimes')}
      </Typography>

      {/* Date Filter Buttons */}
      <Paper elevation={3} sx={{ p: 2, mb: 4, borderRadius: 3, backgroundColor: 'background.paper' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', overflowX: 'auto', gap: 1, pb: 1, alignItems: 'center', width: '100%' }}>
          {availableDates.map((date, index) => (
            <Button
              key={index}
              variant={selectedDate && date.toDateString() === selectedDate.toDateString() ? 'contained' : 'outlined'}
              onClick={() => handleDateSelect(date)}
              sx={{
                whiteSpace: 'nowrap',
                minWidth: 80,
                px: 2,
                py: 1.5,
                borderRadius: 3,
                borderWidth: 2,
                borderStyle: 'solid',
                borderColor: selectedDate && date.toDateString() === selectedDate.toDateString()
                  ? 'primary.main'
                  : 'divider',
                boxShadow: selectedDate && date.toDateString() === selectedDate.toDateString()
                  ? 3
                  : 0,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: selectedDate && date.toDateString() === selectedDate.toDateString()
                    ? 'scale(1.05)'
                    : 'scale(1.02)',
                  boxShadow: 4,
                },
                ...(selectedDate && date.toDateString() === selectedDate.toDateString()
                  ? {
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      }
                    }
                  : {
                      bgcolor: 'background.default',
                      color: 'text.primary'
                    })
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" sx={{ display: 'block', fontSize: '0.75rem' }}>
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                  {date.getDate()}
                </Typography>
              </Box>
            </Button>
          ))}
        </Box>
      </Paper>

      {/* Movies Display */}
      {displayedMovies.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h6" color="textSecondary">
            {t('showtimes.noMoviesOnDate', 'No movies available for the selected date')}
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            {/* Left Column */}
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
              {displayedMovies
                .filter((_, index) => index % 2 === 0) // Even indices (0, 2, 4, ...)
                .map(movie => (
                  <Box key={movie.id} sx={{ mb: 4 }}>
                    <ShowtimeMovieCard movie={movie} />
                  </Box>
                ))}
            </Box>
            {/* Right Column */}
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
              {displayedMovies
                .filter((_, index) => index % 2 === 1) // Odd indices (1, 3, 5, ...)
                .map(movie => (
                  <Box key={movie.id} sx={{ mb: 4 }}>
                    <ShowtimeMovieCard movie={movie} />
                  </Box>
                ))}
            </Box>
          </Box>
          {pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default ShowtimesPage;