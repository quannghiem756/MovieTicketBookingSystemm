import React from 'react';
import {
  Typography,
  Button,
  Container,
  Paper,
  Box,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  Stack
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Movie, CalendarToday, AccessTime, ConfirmationNumber, LocationOn } from '@mui/icons-material';
import { useTranslation } from '../context/I18nContext';

const BookingConfirmation = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const bookingData = location.state?.bookingData;

  if (!bookingData) {
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
          <CheckCircle sx={{ fontSize: 60, color: 'error.main', mb: 3 }} />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            {t('booking.confirmation.invalid')}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3, flexWrap: 'wrap' }}>
            <Button 
              variant="outlined" 
              component={Link} 
              to="/"
              sx={{ borderRadius: 3, textTransform: 'none', px: 3 }}
            >
              {t('booking.confirmation.bookMore')}
            </Button>
          </Box>
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
            bgcolor: 'primary.main',
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
            bgcolor: 'success.main',
            opacity: 0.1,
            borderRadius: '0 100% 0 0',
          }}
        />
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 3 }} />
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
              {t('booking.confirmation.title')}
            </Typography>
            <Typography 
              variant="h6" 
              color="textSecondary"
              sx={{ maxWidth: '600px', mx: 'auto' }}
            >
              {t('booking.confirmation.subtitle')}
            </Typography>
          </Box>
          
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
                    {bookingData.movieTitle}
                  </Typography>
                </Box>
                
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {t('booking.confirmation.theater')}
                    </Typography>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOn sx={{ fontSize: '1rem', mr: 1, color: 'primary.main' }} />
                      {bookingData.theaterName}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {t('booking.confirmation.date')}
                    </Typography>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarToday sx={{ fontSize: '1rem', mr: 1, color: 'primary.main' }} />
                      {new Date(bookingData.showDate).toLocaleDateString('en-US', { 
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
                      {bookingData.showTime}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {t('booking.confirmation.seats')}
                    </Typography>
                    <Typography variant="body1">
                      {bookingData.seatIds.join(', ')}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {t('booking.confirmation.total')}
                    </Typography>
                    <Typography variant="h5" color="primary.main" sx={{ fontWeight: 700 }}>
                      ${bookingData.totalPrice.toFixed(2)}
                    </Typography>
                  </Box>
                </Stack>
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
                      label={bookingData.bookingId}
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
                      {new Date(bookingData.bookingDate).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ 
                  mt: 'auto', 
                  p: 3, 
                  borderRadius: 2,
                  bgcolor: 'rgba(211, 47, 47, 0.1)',
                  border: '1px solid rgba(211, 47, 47, 0.2)',
                  textAlign: 'center'
                }}>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    {t('booking.confirmation.qrCodeTitle')}
                  </Typography>
                  <Box sx={{ 
                    width: 120, 
                    height: 120, 
                    mx: 'auto', 
                    bgcolor: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    borderRadius: 1
                  }}>
                    <ConfirmationNumber sx={{ fontSize: 60, color: 'primary.main' }} />
                  </Box>
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                    {t('booking.confirmation.qrCodeSubtitle')}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Box>
          
          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
              {t('booking.confirmation.info')}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                component={Link}
                to="/bookings"
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
                component={Link}
                to="/"
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

            {/* Payment Status - Could be added if needed */}
            <Box sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: 'rgba(76, 175, 80, 0.1)', border: '1px solid rgba(76, 175, 80, 0.2)' }}>
              <Typography variant="body1" color="success.main" sx={{ fontWeight: 600 }}>
                {t('booking.confirmation.bookingConfirmed')}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default BookingConfirmation;