import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  Typography,
  Button,
  Container,
  Paper,
  Box,
  Chip,
  useTheme,
  useMediaQuery,
  Alert
} from '@mui/material';
import { CheckCircle, Cancel, Movie, AccessTime, LocationOn, CalendarToday, ConfirmationNumber } from '@mui/icons-material';
import { getBookingById } from '../services/api';
import { useTranslation } from '../context/I18nContext';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get parameters from payment response (MoMo only)
  const momoCode = searchParams.get('resultCode');
  const paymentMethod = searchParams.get('paymentMethod') || 'momo'; // Default to momo

  // Determine success based on payment method
  const code = momoCode;
  const isSuccess = paymentMethod === 'momo'
    ? momoCode === '0'
    : true; // For cash payments, we consider them successful

  // Check if booking ID comes from the URL parameter or the payment system parameter
  const bookingId = searchParams.get('bookingId');

  useEffect(() => {
    const fetchBooking = async () => {
      if (bookingId) {
        try {
          const response = await getBookingById(bookingId);
          setBooking(response.data);
        } catch (err) {
          setError(t('common.error'));
          console.error('Error fetching booking:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);


  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
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
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {t('common.loading')}
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        sx={{
          p: { xs: 3, md: 6 },
          borderRadius: 4,
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(30,30,30,0.7)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 150,
            height: 150,
            bgcolor: isSuccess ? 'success.main' : 'error.main',
            opacity: 0.1,
            borderRadius: '0 0 0 100%',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 100,
            height: 100,
            bgcolor: isSuccess ? 'primary.main' : 'error.main',
            opacity: 0.1,
            borderRadius: '0 100% 0 0',
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            {isSuccess ? (
              <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
            ) : (
              <Cancel sx={{ fontSize: 80, color: 'error.main', mb: 3 }} />
            )}

            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 800,
                mb: 2,
                background: `linear-gradient(90deg, ${isSuccess ? '#4caf50' : '#f44336'} 0%, ${isSuccess ? '#81c784' : '#e57373'} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {isSuccess
                ? t('booking.confirmation.title')
                : t('payment.result.failedTitle')}
            </Typography>

            <Typography
              variant="h6"
              color="textSecondary"
              sx={{ maxWidth: '600px', mx: 'auto' }}
            >
              {isSuccess
                ? t('booking.confirmation.subtitle')
                : t('payment.result.failedSubtitle')}
            </Typography>
          </Box>

          {booking && (
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(20,20,20,0.5)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Movie sx={{ color: 'primary.main', mr: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {booking.movie?.title || t('payment.result.movieNotAvailable')}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        {t('booking.confirmation.theater')}
                      </Typography>
                      <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOn sx={{ fontSize: '1rem', mr: 1, color: 'primary.main' }} />
                        {booking.theater?.name || booking.theaterName || t('payment.result.theaterNotAvailable')}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        {t('booking.confirmation.date')}
                      </Typography>
                      <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarToday sx={{ fontSize: '1rem', mr: 1, color: 'primary.main' }} />
                        {new Date(booking.showtime?.showDate || booking.showDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        {t('booking.confirmation.time')}
                      </Typography>
                      <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTime sx={{ fontSize: '1rem', mr: 1, color: 'primary.main' }} />
                        {booking.showtime?.showTime || booking.showTime}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        {t('booking.confirmation.seats')}
                      </Typography>
                      <Typography variant="body1">
                        {booking.seatIds?.join(', ') || booking.seats?.join(', ') || t('payment.result.seatsNotAvailable')}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        {t('booking.confirmation.total')}
                      </Typography>
                      <Typography variant="h5" color="primary.main" sx={{ fontWeight: 700 }}>
                        ${booking.totalPrice?.toFixed(2) || booking.totalPrice}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>

              <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(20,20,20,0.5)',
                    backdropFilter: 'blur(10px)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {t('booking.confirmation.bookingDetails')}
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        {t('booking.confirmation.bookingId')}
                      </Typography>
                      <Chip
                        label={booking.id || bookingId}
                        sx={{
                          mt: 1,
                          borderRadius: 2,
                          fontWeight: 600,
                          fontSize: '0.9rem'
                        }}
                        variant="outlined"
                      />
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        {t('booking.confirmation.bookingDate')}
                      </Typography>
                      <Typography variant="body1">
                        {new Date(booking.bookingDate).toLocaleString()}
                      </Typography>
                    </Box>

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        {t('booking.confirmation.paymentMethod')}
                      </Typography>
                      <Typography variant="body1">
                        {paymentMethod === 'momo' ? t('booking.momo') :
                         paymentMethod === 'cash' ? t('booking.cash') :
                         paymentMethod}
                      </Typography>
                    </Box>
                  </Box>

                  {isSuccess && booking.validationToken && (
                    <Box sx={{ mt: 2, mb: 3, textAlign: 'center' }}>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                        {t('bookings.details.qrCodeTitle')}
                      </Typography>
                      <Box sx={{
                        p: 1.5,
                        bgcolor: 'white',
                        display: 'inline-block',
                        borderRadius: 2,
                        lineHeight: 0
                      }}>
                        <QRCodeSVG
                          value={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/bookings/validate?token=${booking.validationToken}`}
                          size={120}
                        />
                      </Box>
                    </Box>
                  )}
                </Paper>
              </Box>
            </Box>
          )}

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/bookings')}
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                  px: 4,
                  py: 1.5
                }}
              >
                {t('booking.confirmation.viewBookings')}
              </Button>

              <Button
                variant="contained"
                onClick={() => navigate('/')}
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                  px: 4,
                  py: 1.5
                }}
              >
                {t('booking.confirmation.bookMore')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentResult;