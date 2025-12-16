import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getBookingById } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/I18nContext';
import { formatCurrency } from '../utils/currency';
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
import {
  Movie,
  AccessTime,
  CalendarToday,
  LocationOn,
  ConfirmationNumber,
  LocalCafe,
  Event,
  Schedule,
  ArrowBack,
  Info,
  Chair,
  AttachMoney
} from '@mui/icons-material';

const BookingDetailsPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const response = await getBookingById(bookingId);
        setBooking(response.data);
        setLoading(false);
      } catch (err) {
        setError(t('common.error'));
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
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
            onClick={handleBack}
            sx={{ borderRadius: 3, textTransform: 'none', px: 4, py: 1.5 }}
          >
            {t('common.back')}
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!booking) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
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
            {t('bookings.bookingNotFound')}
          </Typography>
          <Button
            variant="contained"
            onClick={handleBack}
            sx={{ borderRadius: 3, textTransform: 'none', px: 4, py: 1.5, mt: 2 }}
          >
            {t('common.back')}
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{
            mb: 2,
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 600,
            color: 'text.primary'
          }}
        >
          {t('common.back')}
        </Button>

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
          {t('bookings.details.title')}
        </Typography>

        <Typography variant="h6" color="textSecondary">
          {t('bookings.details.subtitle')}
        </Typography>
      </Box>

      {/* Movie Information Card - Full Width */}
      <Box sx={{ mb: 4 }}>
        <Card
          sx={{
            borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(30,30,30,0.7)',
            backdropFilter: 'blur(10px)',
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
              <Box sx={{
                width: { xs: '100%', md: 120 },
                height: 160,
                borderRadius: 2,
                overflow: 'hidden',
                border: '2px solid rgba(255,255,255,0.2)',
              }}>
                <Box
                  component="img"
                  src={booking.movie?.posterUrl && booking.movie.posterUrl.startsWith('/uploads/')
                ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${booking.movie.posterUrl}`
                : booking.movie?.posterUrl || 'https://placehold.co/120x160/1a1a1a/cccccc?text=Movie'}
                  alt={booking.movie?.title || 'Booking'}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h4"
                  component="h2"
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

                <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<Movie />}
                    label={booking.movie?.format || booking.movie?.genre?.[0] || t('bookings.details.standard')}
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

                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  <strong>{t('bookings.details.director')}:</strong> {booking.movie?.director || t('bookings.details.notAvailable')}
                </Typography>

                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  <strong>{t('bookings.details.cast')}:</strong> {booking.movie?.cast?.join(', ') || t('bookings.details.notAvailable')}
                </Typography>

                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  <strong>{t('bookings.details.duration')}:</strong> {booking.movie?.duration ? `${booking.movie.duration} ${t('bookings.details.minutes')}` : t('bookings.details.notAvailable')}
                </Typography>

                <Typography variant="body1">
                  {booking.movie?.synopsis || t('bookings.details.noSynopsis')}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Ticket Information and QR Code Section - Two Equal Halves */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {/* Booking Information Card */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
          <Card
            sx={{
              borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(30,30,30,0.7)',
              backdropFilter: 'blur(10px)',
              overflow: 'hidden',
              height: '100%'
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    width: 56,
                    height: 56,
                    mr: 2
                  }}
                >
                  <ConfirmationNumber />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {t('bookings.details.bookingInfo')}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {t('bookings.details.id')}: {booking.id}
                  </Typography>
                </Box>
              </Box>

              <Stack spacing={2} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
                  <Typography variant="body1">
                    <strong>{t('bookings.details.date')}:</strong> {new Date(booking.showtime?.showDate || booking.showDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Schedule sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
                  <Typography variant="body1">
                    <strong>{t('bookings.details.time')}:</strong> {booking.showtime?.showTime || booking.showTime}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
                  <Typography variant="body1">
                    <strong>{t('bookings.details.theater')}:</strong> {booking.theater?.name || booking.theaterName || t('bookings.details.notAvailable')}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalCafe sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
                  <Typography variant="body1">
                    <strong>{t('bookings.details.location')}:</strong> {booking.theater?.location || t('bookings.details.notAvailable')}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chair sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
                  <Typography variant="body1">
                    <strong>{t('bookings.details.seats')}:</strong> {booking.seatIds?.join(', ') || booking.seats?.join(', ') || t('bookings.details.notAvailable')}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoney sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
                  <Typography variant="body1">
                    <strong>{t('bookings.details.total')}:</strong> {formatCurrency(booking.totalPrice || 0)}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
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
                  size="medium"
                  sx={{
                    fontWeight: 600,
                    fontSize: '1rem',
                    px: 2,
                    py: 0.5
                  }}
                />

                <Typography variant="body2" color="textSecondary">
                  {t('bookings.details.bookingDate')}: {new Date(booking.bookingDate).toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* QR Code Card */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
          <Card
            sx={{
              borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(30,30,30,0.7)',
              backdropFilter: 'blur(10px)',
              overflow: 'hidden',
              textAlign: 'center'
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 3 }}>
                {t('bookings.details.qrCodeTitle')}
              </Typography>

              <Box sx={{
                width: { xs: 150, md: 200 },
                height: { xs: 150, md: 200 },
                mx: 'auto',
                bgcolor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                mb: 2
              }}>
                <ConfirmationNumber sx={{ fontSize: { xs: 80, md: 120 }, color: 'primary.main' }} />
              </Box>

              <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                {t('bookings.details.qrCodeSubtitle')}
              </Typography>

              <Typography variant="caption" color="textSecondary">
                {t('bookings.details.qrCodeHint')}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default BookingDetailsPage;