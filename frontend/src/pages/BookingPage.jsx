import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
  Skeleton,
  TextField
} from '@mui/material';
import {
  ArrowBack,
  Info,
  LocalCafe,
  AccessibilityNew,
  AccessibleForward,
  Warning,
  ShoppingCart,
  Done,
  Timer
} from '@mui/icons-material';
import { io } from 'socket.io-client';
import { 
  getMovieById, 
  getShowtimeById, 
  getTheaterById, 
  createBooking, 
  createMomoPayment,
  holdSeat,
  releaseSeat,
  getLockedSeats,
  getBookingsByUserId,
  validateCoupon
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/I18nContext';
import { formatCurrency } from '../utils/currency';

// Initialize socket outside component to avoid multiple connections
const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');

const BookingPage = () => {
  const { movieId, showtimeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [movie, setMovie] = useState(null);
  const [showtime, setShowtime] = useState(null);
  const [theater, setTheater] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [lockedSeats, setLockedSeats] = useState([]); // Seats locked by others
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('momo'); // Default to MoMo
  const [timeLeft, setTimeLeft] = useState(null); // Timer in seconds
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const timerRef = useRef(null);

  // For this example, we'll create a more detailed seat map
  // In a real application, this would come from the theater data
  const [seatMap, setSeatMap] = useState([]);

  useEffect(() => {
    // Join showtime room
    socket.emit('join_showtime', showtimeId);

    // Listen for seat updates
    const handleSeatHeld = ({ seatId, userId }) => {
      // If it's not me holding the seat, add to lockedSeats
      if (!user || userId !== user.id) {
        setLockedSeats(prev => [...prev, seatId]);
      }
    };

    const handleSeatReleased = ({ seatId }) => {
      setLockedSeats(prev => prev.filter(id => id !== seatId));
    };

    const handleSeatConfirmed = ({ seatId }) => {
       setLockedSeats(prev => [...prev, seatId]);
    };

    socket.on('seat_held', handleSeatHeld);
    socket.on('seat_released', handleSeatReleased);
    socket.on('seat_confirmed', handleSeatConfirmed);

    return () => {
      socket.emit('leave_showtime', showtimeId);
      socket.off('seat_held', handleSeatHeld);
      socket.off('seat_released', handleSeatReleased);
      socket.off('seat_confirmed', handleSeatConfirmed);
    };
  }, [showtimeId, user]);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setLoading(true);

        // Fetch movie and showtime data
        const [movieResponse, showtimeResponse] = await Promise.all([
          getMovieById(movieId),
          getShowtimeById(showtimeId)
        ]);

        setMovie(movieResponse.data);
        setShowtime(showtimeResponse.data);

        // Fetch theater data
        const theaterResponse = await getTheaterById(showtimeResponse.data.theaterId);
        setTheater(theaterResponse.data);
        
        // Fetch locked seats
        try {
          const lockedResponse = await getLockedSeats(showtimeId);
          setLockedSeats(lockedResponse.data || []);
        } catch (e) {
          console.error("Failed to fetch locked seats", e);
        }

        // Check if user already has held seats for this showtime to restore session
        if (user) {
          try {
            const userBookingsRes = await getBookingsByUserId(user.id);
            const userBookings = userBookingsRes.data;
            const activeHold = userBookings.find(b => 
              b.showtimeId === showtimeId && 
              (b.status === 'held' || b.status === 'pending') &&
              (!b.expiresAt || new Date(b.expiresAt) > new Date())
            );

            if (activeHold) {
              setSelectedSeats(activeHold.seatIds);
              if (activeHold.expiresAt) {
                const diff = Math.floor((new Date(activeHold.expiresAt) - new Date()) / 1000);
                if (diff > 0) setTimeLeft(diff);
              }
            }
          } catch (e) {
            console.error("Failed to restore user session", e);
          }
        }

        // Create seat map from theater data
        if (theaterResponse.data.seatMap) {
          setSeatMap(theaterResponse.data.seatMap);
        } else {
          // Fallback to creating a seat map if not in the database
          const rows = 8;
          const seatsPerRow = 10;
          const map = [];
          for (let r = 0; r < rows; r++) {
            const row = [];
            for (let s = 0; s < seatsPerRow; s++) {
              row.push({
                id: `${String.fromCharCode(65 + r)}${s + 1}`,
                row: String.fromCharCode(65 + r),
                number: s + 1,
                type: 'standard', // Default to standard type
                isAvailable: true, 
                isSelected: false
              });
            }
            map.push(row);
          }
          setSeatMap(map);
        }
      } catch (err) {
        setError(t('common.error'));
        console.error('Error fetching booking data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [movieId, showtimeId, user]);

  // Timer effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) {
      if (timeLeft === 0) {
         // Timer expired
         setError(t('booking.sessionExpired'));
         setSelectedSeats([]);
         setTimeLeft(null);
         // Refresh locked seats to ensure consistent state
         getLockedSeats(showtimeId).then(res => setLockedSeats(res.data || [])).catch(console.error);
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeft, showtimeId]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getSeatPrice = (seatId) => {
    const seat = seatMap.flat().find(s => s.id === seatId);
    const basePrice = showtime?.price || 0;

    if (!seat) return basePrice;

    switch (seat.type) {
      case 'vip':
        return basePrice * 1.5; // VIP seats cost 50% more
      case 'double':
        return basePrice * 1.2; // Double seats cost 20% more
      case 'standard':
      default:
        return basePrice;
    }
  };

  useEffect(() => {
    // Calculate total price when selected seats change
    let total = 0;
    selectedSeats.forEach(seatId => {
      total += getSeatPrice(seatId);
    });
    setTotalPrice(total);
  }, [selectedSeats, showtime, seatMap]);

  const handleSeatClick = async (seatId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const isSelected = selectedSeats.includes(seatId);

    try {
      if (isSelected) {
        // Release seat
        // Optimistic update for UI speed
        const newSelected = selectedSeats.filter(id => id !== seatId);
        setSelectedSeats(newSelected);
        if (newSelected.length === 0) setTimeLeft(null);

        await releaseSeat(showtimeId, seatId);
      } else {
        // Check limits
        if (selectedSeats.length >= 8) {
          setError(t('booking.maxSeatsSelected'));
          return;
        }

        // Hold seat
        // Optimistic update
        const originalSeats = [...selectedSeats];
        setSelectedSeats([...selectedSeats, seatId]);

        try {
          const res = await holdSeat(showtimeId, seatId);
          if (res.data && res.data.expiresAt) {
             // Sync timer
             const diff = Math.floor((new Date(res.data.expiresAt) - new Date()) / 1000);
             setTimeLeft(diff);
          } else {
             // Fallback timer if not provided
             if (!timeLeft) setTimeLeft(600);
          }
        } catch (err) {
          // Revert if failed
          setSelectedSeats(originalSeats);
          setError(err.response?.data?.error || t('booking.seatUnavailable'));
          // Refresh locked seats to show the one that caused error
          const lockedResponse = await getLockedSeats(showtimeId);
          setLockedSeats(lockedResponse.data || []);
        }
      }
    } catch (err) {
      console.error("Seat action failed", err);
    }
  };

  const getSeatStatus = (seat) => {
    // Check if locked by others (lockedSeats includes my own seats if I have a booking)
    // But selectedSeats tracks my local selection.
    
    // If it's in selectedSeats, it's 'selected'.
    if (selectedSeats.includes(seat.id)) return 'selected';
    
    // If it's in lockedSeats BUT NOT in selectedSeats, it's 'unavailable'.
    // (We filter out my own seats from lockedSeats via socket logic, but initial load includes them)
    // However, since we fetch lockedSeats from server which includes ALL pending/confirmed,
    // we need to know WHICH of those are mine if we want to be perfect.
    // BUT: selectedSeats is the source of truth for "My Selection". 
    // If I hold a seat, it is in selectedSeats AND lockedSeats.
    // So the logic `if (lockedSeats.includes(seat.id)) return 'unavailable'` works fine 
    // because `selectedSeats` check comes FIRST.
    if (lockedSeats.includes(seat.id)) return 'unavailable';
    
    if (!seat.isAvailable) return 'unavailable'; // Theater map hard availability
    
    return 'available';
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    
    setValidatingCoupon(true);
    setError(null);
    try {
      const response = await validateCoupon(couponCode, totalPrice, movieId);
      setAppliedCoupon(response.data);
      setCouponCode('');
    } catch (err) {
      setError(err.response?.data?.message || t('common.error'));
      setAppliedCoupon(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      setError(t('booking.selectSeats'));
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setBookingLoading(true);
      const bookingData = {
        userId: user.id,
        showtimeId,
        movieId,
        seatIds: selectedSeats,
        totalPrice,
        paymentMethod, // Add payment method to booking data
        couponCode: appliedCoupon?.code
      };

      const response = await createBooking(bookingData);

      if (paymentMethod === 'momo') {
        // Redirect to MoMo for payment
        const paymentResponse = await createMomoPayment(response.data.id);
        const paymentUrl = paymentResponse.data.data;

        // Redirect to MoMo
        window.location.href = paymentUrl;
      } else if (paymentMethod === 'cash') {
        // For cash payment, navigate directly to confirmation
        navigate('/booking/confirmation', {
          state: {
            bookingData: {
              bookingId: response.data.id,
              movieTitle: movie.title,
              theaterName: theater?.name || `Theater ${showtime.theaterId}`,
              showDate: showtime.showDate,
              showTime: showtime.showTime,
              seatIds: selectedSeats,
              totalPrice: totalPrice,
              bookingDate: response.data.bookingDate
            }
          }
        });
      } else {
        // Default to MoMo if unknown payment method
        const paymentResponse = await createMomoPayment(response.data.id);
        const paymentUrl = paymentResponse.data.data;

        // Redirect to MoMo
        window.location.href = paymentUrl;
      }
    } catch (err) {
      setError(t('booking.error'));
      console.error('Booking error:', err);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading)
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 3 }}>
          <Button
            onClick={() => navigate(-1)}
            startIcon={<ArrowBack />}
            variant="outlined"
            sx={{ borderRadius: 3, textTransform: 'none' }}
          >
            {t('common.back')}
          </Button>
        </Box>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 4, mb: 4 }} />
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 4, mb: 4 }} />
        <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 4 }} />
      </Container>
    );

  if (error && !movie && !showtime && !timeLeft) // Only show full page error if critical data missing
    return (
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );

  if (!movie || !showtime)
    return (
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Alert severity="error">{t('common.movieNotFound')}</Alert>
        </Box>
      </Container>
    );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Button
          onClick={() => navigate(-1)}
          startIcon={<ArrowBack />}
          variant="outlined"
          sx={{ borderRadius: 3, textTransform: 'none' }}
        >
          {t('common.back')}
        </Button>
        
        {timeLeft > 0 && (
           <Chip 
             icon={<Timer />} 
             label={`${t('booking.timeLeft') || 'Time Left'}: ${formatTime(timeLeft)}`} 
             color={timeLeft < 60 ? 'error' : 'primary'}
             sx={{ fontWeight: 'bold', fontSize: '1rem', px: 2, py: 2.5, borderRadius: 2 }}
           />
        )}
      </Box>

      {/* Movie and showtime info */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(30,30,30,0.7)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'center', width: '100%' }}>
          <Box
            sx={{
              width: { xs: '100%', md: '16.666%' },
              display: 'flex',
              justifyContent: { xs: 'center', md: 'flex-start' },
              mb: { xs: 2, md: 0 }
            }}
          >
            <Box
              component="img"
              src={movie.posterUrl && movie.posterUrl.startsWith('/uploads/')
                ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${movie.posterUrl}`
                : movie.posterUrl || 'https://placehold.co/300x450/1a1a1a/cccccc?text=No+Image'}
              alt={movie.title}
              sx={{ width: '100%', borderRadius: 2, boxShadow: 2 }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: 800 }}>
              {movie.title}
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              sx={{ mb: 2 }}
            >
              <Chip
                icon={<Info />}
                label={`${showtime.format} | ${showtime.language}`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(211, 47, 47, 0.2)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  fontWeight: 500,
                }}
              />

              <Chip
                label={`${new Date(showtime.showDate).toDateString()} at ${showtime.showTime}`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  fontWeight: 500,
                }}
              />

              <Chip
                label={`${t('booking.price')}: ${formatCurrency(showtime.price)}`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(76, 175, 80, 0.2)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  fontWeight: 500,
                }}
              />
            </Stack>

            <Typography variant="body1" color="textSecondary">
              {t('booking.selectedSeats')}: {selectedSeats.length} ({t('booking.total')}: {formatCurrency(totalPrice)})
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Seat selection */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 4,
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(30,30,30,0.7)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Typography
          variant="h5"
          component="h3"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 3,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <AccessibilityNew sx={{ mr: 1, color: 'primary.main' }} />
          {t('booking.selectSeats')}
        </Typography>

        {/* Screen */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{
            display: 'inline-block',
            bgcolor: 'grey.800',
            color: 'white',
            px: 6,
            py: 1.5,
            borderRadius: '12px 12px 0 0',
            mb: 1,
            fontWeight: 700,
            fontSize: '1.2rem',
            boxShadow: 2
          }}>
            {t('booking.screen')}
          </Box>
          <Box sx={{
            width: '100%',
            height: '20px',
            bgcolor: 'rgba(128,128,128,0.3)',
            borderRadius: '0 0 12px 12px',
            boxShadow: 3
          }} />
        </Box>

        {/* Seat map */}
        <Grid container justifyContent="center" alignItems="center" sx={{ mb: 3 }}>
          <Grid item>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex_start',
              overflowX: 'auto',
              py: 2
            }}>
              {seatMap.map((row, rowIndex) => (
                <Box key={rowIndex} sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  mb: 1.5,
                  width: '100%',
                  minWidth: 'max-content'
                }}>
                  <Box sx={{
                    minWidth: '40px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}>
                    {String.fromCharCode(65 + rowIndex)}
                  </Box>
                  {row.map((seat) => {
                    // Handle space type seats as invisible elements
                    if (seat.type === 'space') {
                      return (
                        <Box
                          key={seat.id}
                          sx={{
                            width: 36,
                            mx: 0.5,
                            visibility: 'hidden'
                          }}
                        />
                      );
                    }
                    const status = getSeatStatus(seat);
                    let bgColor = 'grey.700';
                    let borderColor = 'divider';
                    let textColor = 'text.primary';

                    if (status === 'selected') {
                      bgColor = 'success.main';
                      borderColor = 'success.main';
                      textColor = 'white';
                    } else if (status === 'unavailable') {
                      bgColor = 'grey.600';
                      borderColor = 'grey.600';
                    } else if (status === 'available' && seat.type === 'vip') {
                      bgColor = 'error.main'; // VIP seat color
                    } else if (status === 'available' && seat.type === 'double') {
                      bgColor = 'warning.main'; // Double seat color
                    }

                    return (
                      <Tooltip
                        title={status === 'unavailable' ? t('booking.seatUnavailable') : seat.id}
                        key={seat.id}
                      >
                        <Box
                          onClick={() => status !== 'unavailable' && handleSeatClick(seat.id)}
                          sx={{
                            width: 36,
                            height: 36,
                            mx: 0.5,
                            borderRadius: 1,
                            bgcolor: bgColor,
                            borderColor: borderColor,
                            border: '2px solid',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: status !== 'unavailable' ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s',
                            '&:hover': {
                              transform: status !== 'unavailable' ? 'scale(1.1)' : 'none',
                              bgcolor: status === 'selected'
                                ? 'success.dark'
                                : status === 'unavailable'
                                  ? 'grey.600'
                                  : seat.type === 'vip'
                                    ? '#E65100'
                                    : 'grey.500',
                            },
                            position: 'relative'
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 'bold',
                              color: textColor,
                              fontSize: '0.7rem'
                            }}
                          >
                            {seat.number}
                          </Typography>
                          {seat.type === 'vip' && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: -4,
                                right: -4,
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor: 'error.main',
                                border: '1px solid white'
                              }}
                            />
                          )}
                          {seat.type === 'double' && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: -4,
                                right: -4,
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor: 'warning.main',
                                border: '1px solid white'
                              }}
                            />
                          )}
                        </Box>
                      </Tooltip>
                    );
                  })}
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Seat legend */}
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 3, mt: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{
              width: 24,
              height: 24,
              borderRadius: 1,
              bgcolor: 'grey.700',
              border: '2px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.primary' }}>1</Typography>
            </Box>
            <Typography variant="body2">{t('booking.available')}</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{
              width: 24,
              height: 24,
              borderRadius: 1,
              bgcolor: 'success.main',
              border: '2px solid',
              borderColor: 'success.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Done sx={{ fontSize: '1rem', color: 'white' }} />
            </Box>
            <Typography variant="body2">{t('booking.selected')}</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{
              width: 24,
              height: 24,
              borderRadius: 1,
              bgcolor: 'grey.600',
              border: '2px solid',
              borderColor: 'grey.600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.primary' }}>X</Typography>
            </Box>
            <Typography variant="body2">{t('booking.unavailable')}</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{
              width: 24,
              height: 24,
              borderRadius: 1,
              bgcolor: 'primary.main',
              border: '2px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'white' }}>S</Typography>
            </Box>
            <Typography variant="body2">{t('booking.standard')}</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{
              width: 24,
              height: 24,
              borderRadius: 1,
              bgcolor: 'warning.main',
              border: '2px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'white' }}>D</Typography>
              <Box
                sx={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'warning.main',
                  border: '1px solid white'
                }}
              />
            </Box>
            <Typography variant="body2">{t('booking.double')}</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{
              width: 24,
              height: 24,
              borderRadius: 1,
              bgcolor: 'error.main',
              border: '2px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'white' }}>V</Typography>
              <Box
                sx={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'error.main',
                  border: '1px solid white'
                }}
              />
            </Box>
            <Typography variant="body2">{t('booking.vip')}</Typography>
          </Stack>
        </Box>
      </Paper>

      {/* Booking summary */}
      <Paper
        sx={{
          p: 4,
          borderRadius: 4,
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(30,30,30,0.7)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Typography
          variant="h5"
          component="h3"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 3,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <ShoppingCart sx={{ mr: 1, color: 'primary.main' }} />
          {t('booking.summary')}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Booking Summary Section */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 66.66%' } }}>
            <Paper
              sx={{
                p: 4,
                borderRadius: 4,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(30,30,30,0.7)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Stack spacing={2} sx={{ mb: 2 }}>
                <Box>
                  <Typography variant="body1" color="textSecondary">
                    <strong>{t('booking.selectedSeats')}:</strong>
                    {selectedSeats.length > 0 ? selectedSeats.join(', ') : t('booking.noSeatsSelected')}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body1" color="textSecondary">
                    <strong>{t('booking.numberOfSeats')}:</strong> {selectedSeats.length}
                  </Typography>
                </Box>

                {selectedSeats.length > 0 && (
                  <Box>
                    <Typography variant="body1" color="textSecondary">
                      <strong>{t('booking.seatPrice')}:</strong>
                      {selectedSeats.map((seatId, index) => {
                        const seat = seatMap.flat().find(s => s.id === seatId);
                        const seatPrice = getSeatPrice(seatId);
                        return (
                          <div key={seatId}>
                            {t('booking.seatTranslation')} {seatId} ({seat?.type || 'standard'}): {formatCurrency(seatPrice)}
                          </div>
                        );
                      })}
                      <div>
                        <strong>Total:</strong> {formatCurrency(totalPrice)}
                      </div>
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Paper>
          </Box>

          {/* Payment Method and Total Section */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 33.33%' } }}>
            <Paper
              sx={{
                p: 4,
                borderRadius: 4,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(30,30,30,0.7)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" component="div" sx={{ fontWeight: 700, mb: 1 }}>
                  {t('booking.total')}:
                </Typography>
                
                {appliedCoupon ? (
                  <>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        textDecoration: 'line-through', 
                        color: 'text.secondary',
                        mb: 0.5 
                      }}
                    >
                      {formatCurrency(totalPrice)}
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                      {formatCurrency(Math.max(0, totalPrice - appliedCoupon.discountAmount))}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Chip 
                        label={`${t('booking.discount')}: -${formatCurrency(appliedCoupon.discountAmount)} (${appliedCoupon.code})`}
                        color="success"
                        onDelete={handleRemoveCoupon}
                        size="small"
                      />
                    </Box>
                  </>
                ) : (
                  <Typography variant="h4" component="div" sx={{ fontWeight: 800, color: 'primary.main', mb: 2 }}>
                    {formatCurrency(totalPrice)}
                  </Typography>
                )}
              </Box>

              {/* Promo Code Input */}
              {!appliedCoupon && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    {t('booking.promoCode')}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="e.g. SAVE10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                    <Button 
                      variant="outlined" 
                      onClick={handleApplyCoupon}
                      disabled={!couponCode || validatingCoupon}
                      sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                      {validatingCoupon ? <CircularProgress size={20} /> : t('booking.apply')}
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Payment Method Selection */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  {t('booking.paymentMethod')}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    variant={paymentMethod === 'momo' ? 'contained' : 'outlined'}
                    onClick={() => setPaymentMethod('momo')}
                    sx={{
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      px: 2,
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: 'none'
                    }}
                  >
                    <Box component="img" src="https://mcdn.coolmate.me/image/October2024/mceclip1_171.png" alt="MoMo" sx={{ height: 24, mr: 1 }} />
                    Ví điện tử MoMo
                  </Button>
                  <Button
                    variant={paymentMethod === 'cash' ? 'contained' : 'outlined'}
                    onClick={() => setPaymentMethod('cash')}
                    sx={{
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      px: 2,
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: 'none'
                    }}
                  >
                    <LocalCafe sx={{ mr: 1 }} />
                    {t('booking.cash')}
                  </Button>
                </Box>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
              )}

              <Button
                variant="contained"
                color="primary"
                onClick={handleBooking}
                disabled={bookingLoading || selectedSeats.length === 0}
                startIcon={bookingLoading ? <CircularProgress size={20} /> : <Done />}
                sx={{
                  py: 2,
                  borderRadius: 3,
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  width: '100%'
                }}
              >
                {bookingLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    {t('booking.processing')}
                  </Box>
                ) : (
                  `${t('booking.confirmBooking')}`
                )}
              </Button>
            </Paper>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default BookingPage;