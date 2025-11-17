import React, { useState, useEffect } from 'react';
import { getBookingsByUserId } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/I18nContext';
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardMedia,
  Button,
  Divider,
  Stack,
  useTheme,
  useMediaQuery,
  Avatar
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Movie, 
  AccessTime, 
  CalendarToday, 
  ConfirmationNumber, 
  LocalCafe, 
  LocalPlay, 
  ArrowForward,
  Event,
  Schedule
} from '@mui/icons-material';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await getBookingsByUserId(user.id);
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        setError(t('common.error'));
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  if (loading) 
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
    
  if (error) 
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper 
          sx={{ 
            p: { xs: 3, md: 6 }, 
            borderRadius: 4,
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(30,30,30,0.7)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            {t('common.error')}
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            {error}
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{ borderRadius: 3, textTransform: 'none', px: 4, py: 1.5 }}
          >
            {t('common.retry')}
          </Button>
        </Paper>
      </Container>
    );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h3" 
          component="h1"
          sx={{ 
            fontWeight: 800, 
            mb: 2,
            background: 'linear-gradient(90deg, #ffffff 0%, #b3b3b3 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {t('bookings.title')}
        </Typography>
        <Typography variant="h6" color="textSecondary">
          {t('bookings.subtitle')}
        </Typography>
      </Box>
      
      {bookings.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {bookings.map(booking => (
            <Box key={booking.id} sx={{ flex: '1 1 auto' }}>
              <Card 
                sx={{ 
                  borderRadius: 4,
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(30,30,30,0.7)',
                  backdropFilter: 'blur(10px)',
                  overflow: 'hidden',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'center' }}>
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      flex: { xs: '0 0 100%', md: '0 0 16.666%' },
                      width: { xs: '100%', md: 'auto' },
                      maxWidth: { md: '16.666%' }
                    }}>
                      <Box sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '2px solid rgba(255,255,255,0.2)',
                        mx: 'auto'
                      }}>
                        <Box
                          component="img"
                          src={booking.movie?.posterUrl || 'https://placehold.co/80x80/1a1a1a/cccccc?text=Movie'}
                          alt={booking.movie?.title || 'Booking'}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                    </Box>

                    <Box sx={{
                      flex: { xs: '0 0 100%', md: '0 0 33.333%' },
                      width: { xs: '100%', md: 'auto' },
                      maxWidth: { md: '33.333%' },
                      order: { xs: 1, md: 'unset' }
                    }}>
                      <Typography
                        variant="h5"
                        component="h3"
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {booking.movie?.title || t('bookings.movieTitle')}
                      </Typography>

                      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                        <Chip
                          icon={<Movie />}
                          label={booking.movie?.format || booking.movie?.genre?.[0] || 'Standard'}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(211, 47, 47, 0.2)',
                            color: 'white',
                            backdropFilter: 'blur(10px)',
                            fontWeight: 500,
                          }}
                        />
                        <Chip
                          label={booking.movie?.rating || 'PG-13'}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            backdropFilter: 'blur(10px)',
                            fontWeight: 500,
                          }}
                        />
                      </Stack>
                    </Box>

                    <Box sx={{
                      flex: { xs: '0 0 100%', md: '0 0 25%' },
                      width: { xs: '100%', md: 'auto' },
                      maxWidth: { md: '10%' },
                      order: { xs: 2, md: 'unset' }
                    }}>
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarToday sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
                          <Typography variant="body1">
                            {new Date(booking.showtime?.showDate || booking.showDate).toLocaleDateString()}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Schedule sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
                          <Typography variant="body1">
                            {booking.showtime?.showTime || booking.showTime}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocalCafe sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
                          <Typography variant="body1">
                            {booking.theater?.name || booking.theaterName || t('bookings.theater')}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>

                    <Box sx={{
                      flex: { xs: '0 0 100%', md: '0 0 16.666%' },
                      width: { xs: '100%', md: 'auto' },
                      maxWidth: { md: '16.666%' },
                      textAlign: { xs: 'left', md: 'center' },
                      order: { xs: 3, md: 'unset' }
                    }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                        ${booking.totalPrice?.toFixed(2) || booking.totalPrice}
                      </Typography>
                      <Chip
                        label={
                          booking.status === 'confirmed' ? t('bookings.status.confirmed') :
                          booking.status === 'pending' ? t('bookings.status.pending') :
                          booking.status === 'cancelled' ? t('bookings.status.cancelled') :
                          booking.status
                        }
                        color={
                          booking.status === 'confirmed' ? 'success' :
                          booking.status === 'pending' ? 'warning' :
                          'error'
                        }
                        size="small"
                        sx={{
                          mb: 1,
                          fontWeight: 600
                        }}
                      />
                      <Typography variant="body2" color="textSecondary">
                        {t('bookings.seats')} {booking.seatIds?.join(', ') || booking.seats?.join(', ') || t('bookings.unknownSeats')}
                      </Typography>
                    </Box>

                    <Box sx={{
                      flex: { xs: '0 0 100%', md: '0 0 8.333%' },
                      width: { xs: '100%', md: 'auto' },
                      maxWidth: { md: '8.333%' },
                      textAlign: { xs: 'left', md: 'center' },
                      display: 'flex',
                      justifyContent: { xs: 'flex-start', md: 'center' },
                      alignItems: 'center',
                      order: { xs: 4, md: 'unset' },
                      mt: { xs: 2, md: 0 }
                    }}>
                      <Button
                        variant="outlined"
                        size="small"
                        endIcon={<ArrowForward />}
                        component={RouterLink}
                        to={`/bookings/${booking.id}`}
                        sx={{
                          borderRadius: 3,
                          textTransform: 'none',
                          fontWeight: 600,
                          borderColor: 'rgba(255,255,255,0.3)',
                          color: 'white',
                          minWidth: 'auto',
                          px: 1.5,
                          py: 0.5,
                          '&:hover': {
                            borderColor: 'white',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                          }
                        }}
                      >
                        {t('bookings.view')}
                      </Button>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" color="textSecondary">
                        {t('bookings.bookingId')}: {booking.id}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {t('bookings.bookingDate')}: {new Date(booking.bookingDate).toLocaleString()}
                      </Typography>
                    </Box>
                    <Avatar 
                      sx={{ 
                        bgcolor: 'primary.main',
                        width: 40,
                        height: 40
                      }}
                    >
                      <ConfirmationNumber />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      ) : (
        <Paper 
          sx={{ 
            p: { xs: 4, md: 8 }, 
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(30,30,30,0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4
          }}
        >
          <Movie sx={{ fontSize: 80, color: 'primary.main', mb: 3 }} />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            {t('bookings.noBookingsTitle')}
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ mb: 3 }}>
            {t('bookings.noBookingsSubtitle')}
          </Typography>
          <Button
            variant="contained"
            href="/"
            sx={{ 
              borderRadius: 3, 
              px: 4, 
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none'
            }}
          >
            {t('bookings.startBooking')}
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default BookingsPage;