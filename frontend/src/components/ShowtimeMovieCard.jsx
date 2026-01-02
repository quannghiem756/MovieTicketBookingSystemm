// components/ShowtimeMovieCard.jsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
  Stack,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Skeleton,
  Grid
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/I18nContext';
import { Star, AccessTime, CalendarToday, Movie } from '@mui/icons-material';

const ShowtimeMovieCard = ({ movie }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(null);

  React.useEffect(() => {
    if (movie && movie.showtimes && movie.showtimes.length > 0) {
      const formats = [...new Set(movie.showtimes.map(s => s.format).filter(Boolean))];
      if (formats.length > 0) {
        setSelectedFormat(formats[0]);
      }
    }
  }, [movie]);

  const availableFormats = React.useMemo(() => {
    if (!movie || !movie.showtimes) return [];
    return [...new Set(movie.showtimes.map(s => s.format).filter(Boolean))];
  }, [movie]);

  const filteredShowtimes = React.useMemo(() => {
    if (!movie || !movie.showtimes) return [];
    if (!selectedFormat) return movie.showtimes;
    return movie.showtimes.filter(s => s.format === selectedFormat);
  }, [movie, selectedFormat]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (!movie) {
    return (
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 4,
          overflow: 'hidden'
        }}
      >
        <Skeleton variant="rectangular" height={300} />
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Skeleton height={24} width="80%" sx={{ mb: 1 }} />
          <Skeleton height={18} width="60%" sx={{ mb: 2 }} />
          <Skeleton height={30} />
        </CardContent>
      </Card>
    );
  }

  // Format time from HH:MM string format to display format
  const formatTime = (timeString) => {
    if (!timeString) return '';

    // Handle if timeString is already in HH:MM format
    if (typeof timeString === 'string' && timeString.includes(':')) {
      // Extract just the HH:MM part if there are seconds or other info
      const timeMatch = timeString.match(/\d{1,2}:\d{2}/);
      return timeMatch ? timeMatch[0] : timeString;
    }

    // If timeString is an ISO date string or timestamp, extract time portion
    try {
      const date = new Date(timeString);
      if (isNaN(date.getTime())) {
        return timeString; // Return original if invalid date
      }
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return timeString; // Return original on error
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-12px) scale(1.02)',
          boxShadow: 24,
          '& .movie-overlay': {
            opacity: 1,
          }
        }
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        {!imageLoaded && !imageError && (
          <Skeleton
            variant="rectangular"
            height={isMobile ? 220 : 300}
            sx={{ borderRadius: 0 }}
          />
        )}

        {!imageError ? (
          <CardMedia
            component="img"
            height={isMobile ? 220 : 300}
            image={movie.posterUrl && movie.posterUrl.startsWith('/uploads/')
              ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${movie.posterUrl}`
              : movie.posterUrl || 'https://placehold.co/400x600/1a1a1a/cccccc?text=No+Image'}
            alt={movie.title}
            sx={{
              transition: 'transform 0.4s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
              opacity: imageLoaded ? 1 : 0,
              display: imageLoaded ? 'block' : 'none',
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <Box
            component="img"
            src="https://placehold.co/400x600/1a1a1a/cccccc?text=No+Image"
            alt="Placeholder"
            sx={{
              height: isMobile ? 220 : 300,
              objectFit: 'cover',
              width: '100%'
            }}
          />
        )}

        {/* Overlay on hover */}
        <Box
          className="movie-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 40%, transparent 100%)',
            display: 'flex',
            alignItems: 'flex-end',
            p: 2,
            opacity: 0,
            transition: 'opacity 0.4s ease',
          }}
        >
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={`/movie/${movie.id}`}
            fullWidth
            sx={{
              borderRadius: 3,
              py: 1.5,
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '1rem',
            }}
          >
            {t('movieCard.bookTicket')}
          </Button>
        </Box>

        {/* Rating badge */}
        <Chip
          label={`${movie.rating || 'PG-13'}`}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            backdropFilter: 'blur(10px)',
            fontWeight: 600,
          }}
        />

        {/* Duration badge */}
        {movie.duration && (
          <Chip
            icon={<AccessTime />}
            label={`${movie.duration} ${t('movieCard.mins')}`}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              fontWeight: 500,
            }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography
          variant="h6"
          component="div"
          gutterBottom
          sx={{
            fontWeight: 700,
            minHeight: '60px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 1
          }}
        >
          {movie.title}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: 'center' }}>
          {movie.genre && Array.isArray(movie.genre) && movie.genre.slice(0, 2).map((g, index) => (
            <Chip
              key={index}
              label={g}
              size="small"
              sx={{
                backgroundColor: 'rgba(211, 47, 47, 0.15)',
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 500,
                fontSize: '0.75rem',
              }}
            />
          ))}
        </Stack>

        {movie.director && (
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            <strong>{t('movieCard.director')}:</strong> {movie.director}
          </Typography>
        )}

        {movie.cast && Array.isArray(movie.cast) && movie.cast.length > 0 && (
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: '0.8rem'
            }}
          >
            <strong>{t('movieCard.cast')}:</strong> {movie.cast.slice(0, 3).join(', ')}
          </Typography>
        )}

        {/* Rating display */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Star sx={{ color: '#FFD700', fontSize: '1rem' }} />
          <Typography variant="body2" color="textSecondary">
            {movie.rating || 'PG-13'}
          </Typography>
        </Stack>

        {/* Showtimes section */}
        {movie.showtimes && movie.showtimes.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Movie sx={{ fontSize: '1rem', color: 'textSecondary' }} />
              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                {t('showtimes.availableShowtimes', 'Showtimes:')}
              </Typography>
            </Stack>

            {/* Format Selection Chips */}
            {availableFormats.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
                {availableFormats.map(format => (
                  <Chip
                    key={format}
                    label={format}
                    size="small"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedFormat(format);
                    }}
                    color={selectedFormat === format ? "primary" : "default"}
                    variant={selectedFormat === format ? "filled" : "outlined"}
                    clickable
                  />
                ))}
              </Stack>
            )}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {filteredShowtimes.slice(0, 6).map((showtime, index) => {
                  const isClosed = showtime.status === 'Closed';
                  
                  return (
                    <Chip
                      key={showtime.id || index}
                      label={isClosed ? 'Closed' : formatTime(showtime.showTime)}
                      size="small"
                      component={isClosed ? 'div' : Link}
                      to={isClosed ? undefined : `/book/${movie.id}/${showtime.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      sx={{
                        backgroundColor: isClosed ? 'rgba(117, 117, 117, 0.2)' : 'rgba(33, 150, 243, 0.2)',
                        color: isClosed ? 'text.disabled' : '#2196F3',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        cursor: isClosed ? 'default' : 'pointer',
                        pointerEvents: isClosed ? 'none' : 'auto',
                        '&:hover': {
                          backgroundColor: isClosed ? 'rgba(117, 117, 117, 0.2)' : 'rgba(33, 150, 243, 0.3)',
                        }
                      }}
                    />
                  );
              })}
              {filteredShowtimes.length > 6 && (
                <Chip
                  label={`+${filteredShowtimes.length - 6}`}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(117, 117, 117, 0.2)',
                    color: 'textSecondary',
                    fontWeight: 500,
                    fontSize: '0.75rem'
                  }}
                />
              )}
            </Box>
          </Box>
        )}

        {/* Synopsis for larger screens */}
        <Typography
          variant="body2"
          color="textSecondary"
          paragraph
          sx={{
            display: { xs: 'none', md: 'block' },
            minHeight: '60px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {movie.synopsis}
        </Typography>

        {/* Book button for mobile */}
        <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 'auto', pt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={`/movie/${movie.id}`}
            fullWidth
            sx={{
              borderRadius: 3,
              py: 1.5,
              fontWeight: 700,
              textTransform: 'none',
            }}
          >
            {t('movieCard.bookTicket')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ShowtimeMovieCard;