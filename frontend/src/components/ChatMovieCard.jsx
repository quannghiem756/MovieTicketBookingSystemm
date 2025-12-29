import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Stack,
  Skeleton,
  Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/I18nContext';
import { ConfirmationNumber } from '@mui/icons-material';

const ChatMovieCard = ({ movie }) => {
  const { t } = useTranslation();
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

  const formatTime = (timeString) => {
    if (!timeString) return '';
    if (typeof timeString === 'string' && timeString.includes(':')) {
      const timeMatch = timeString.match(/\d{1,2}:\d{2}/);
      return timeMatch ? timeMatch[0] : timeString;
    }
    try {
      const date = new Date(timeString);
      if (isNaN(date.getTime())) return timeString;
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return timeString;
    }
  };

  if (!movie) return null;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: 'rgba(40, 40, 40, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 8
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        {!imageLoaded && !imageError && (
          <Skeleton variant="rectangular" height={140} />
        )}
        <CardMedia
          component="img"
          height="140"
          image={movie.posterUrl && movie.posterUrl.startsWith('/uploads/')
            ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${movie.posterUrl}`
            : movie.posterUrl || 'https://placehold.co/400x600/1a1a1a/cccccc?text=No+Image'}
          alt={movie.title}
          sx={{
            display: imageLoaded ? 'block' : 'none',
            objectFit: 'cover'
          }}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
        {imageError && (
          <Box sx={{ height: 140, bgcolor: 'grey.900', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>No Image</Typography>
          </Box>
        )}
        
        {/* Rating Badge */}
        <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
          <Chip
            label={movie.rating || 'PG-13'}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.65rem',
              bgcolor: 'rgba(0,0,0,0.6)',
              color: 'white',
              backdropFilter: 'blur(4px)',
              fontWeight: 700
            }}
          />
        </Box>
      </Box>

      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            lineHeight: 1.2,
            mb: 0.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.4em',
            fontSize: '0.8rem'
          }}
        >
          {movie.title}
        </Typography>

        {/* Format Selection */}
        {availableFormats.length > 0 && (
          <Stack direction="row" spacing={0.5} sx={{ mb: 1, flexWrap: 'wrap' }}>
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
                sx={{
                  height: 18,
                  fontSize: '0.6rem',
                  cursor: 'pointer'
                }}
              />
            ))}
          </Stack>
        )}

        {/* Showtimes */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
          {filteredShowtimes.slice(0, 4).map((showtime, index) => (
            <Chip
              key={showtime.id || index}
              label={formatTime(showtime.showTime)}
              size="small"
              component={Link}
              to={`/book/${movie.id}/${showtime.id}`}
              clickable
              sx={{
                height: 20,
                fontSize: '0.65rem',
                bgcolor: 'rgba(33, 150, 243, 0.1)',
                color: '#2196F3',
                border: '1px solid rgba(33, 150, 243, 0.3)',
                '&:hover': {
                  bgcolor: 'rgba(33, 150, 243, 0.2)'
                }
              }}
            />
          ))}
          {filteredShowtimes.length > 4 && (
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6rem', alignSelf: 'center' }}>
              +{filteredShowtimes.length - 4}
            </Typography>
          )}
        </Box>

        <Box sx={{ mt: 'auto' }}>
          <Button
            variant="contained"
            fullWidth
            size="small"
            component={Link}
            to={`/movie/${movie.id}`}
            startIcon={<ConfirmationNumber sx={{ fontSize: '0.8rem !important' }} />}
            sx={{
              fontSize: '0.7rem',
              py: 0.5,
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 700
            }}
          >
            {t('movieCard.bookTicket')}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ChatMovieCard;
