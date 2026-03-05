import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Grid,
  Container,
  Box,
  Chip,
  Paper,
  Tabs,
  Tab,
  Card,
  CardMedia,
  CardContent,
  Avatar,
  Stack,
  Rating,
  Skeleton,
  Fab,
  useTheme,
  useMediaQuery,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Checkbox,
  FormControlLabel,
  Alert
} from '@mui/material';
import {
  PlayArrow,
  CalendarToday,
  AccessTime,
  Star,
  ArrowBack,
  Movie,
  Close,
  Warning
} from '@mui/icons-material';
import RatingBadge from '../components/RatingBadge';
import { getMovieById, getShowtimesByMovieId, getFutureShowtimesByMovieId } from '../services/api';
import { useTranslation } from '../context/I18nContext';
import { formatCurrency } from '../utils/currency';
import { useAuth } from '../context/AuthContext';
import { calculateAge, canBookMovie } from '../utils/dateUtils';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`movie-details-tabpanel-${index}`}
      aria-labelledby={`movie-details-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `movie-details-tab-${index}`,
    'aria-controls': `movie-details-tabpanel-${index}`,
  };
}

// Helper function to extract YouTube video ID from URL
const extractYouTubeVideoId = (url) => {
  if (!url) return '';

  // Regular expressions for different YouTube URL formats
  const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^#&?]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : '';
};

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('all');
  const { t, language } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Age restriction state
  const [guardianDialogOpen, setGuardianDialogOpen] = useState(false);
  const [pendingBookingPath, setPendingBookingPath] = useState('');
  const [guardianConfirmed, setGuardianConfirmed] = useState(false);

  const userAge = user ? calculateAge(user.dateOfBirth) : 0;
  const canBook = user ? canBookMovie(userAge, movie?.rating) : true;
  const isGuardianRequired = user && movie?.rating === 'K' && userAge < 13;

  const handleBookClick = (e, path) => {
    if (!user) return; // Allow guest to proceed (to login)

    if (!canBook) {
      e.preventDefault();
      return;
    }

    if (isGuardianRequired) {
      e.preventDefault();
      setPendingBookingPath(path);
      setGuardianDialogOpen(true);
    }
    // Otherwise proceed normally
  };

  const handleGuardianConfirm = () => {
    setGuardianDialogOpen(false);
    setGuardianConfirmed(false); // Reset for next time
    navigate(pendingBookingPath);
  };

  const handleGuardianCancel = () => {
    setGuardianDialogOpen(false);
    setGuardianConfirmed(false);
    setPendingBookingPath('');
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const [movieResponse, futureShowtimesResponse] = await Promise.all([
          getMovieById(id),
          getFutureShowtimesByMovieId(id)  // Use the new API to only get future showtimes
        ]);
        setMovie(movieResponse.data);

        const allFetchedShowtimes = futureShowtimesResponse.data || [];
        setShowtimes(allFetchedShowtimes);

        if (allFetchedShowtimes.length > 0) {
          const dates = allFetchedShowtimes.map(st => new Date(st.showDate).toLocaleDateString('en-CA'));
          const earliest = dates.sort()[0];
          setSelectedDate(new Date(earliest));
        } else {
          setSelectedDate(null);
        }
        setSelectedFormat('all');
       
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovieDetails();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredShowtimes = showtimes.filter(st => {
    const showDateStr = new Date(st.showDate).toLocaleDateString('en-CA');
    const selectedDateStr = selectedDate ? selectedDate.toLocaleDateString('en-CA') : null;
    
    const matchesDate = !selectedDateStr || showDateStr === selectedDateStr;
    const matchesFormat = selectedFormat === 'all' || st.format === selectedFormat;
    
    return matchesDate && matchesFormat;
  });

  const formatOptions = Array.from(new Set(showtimes.map(st => st.format))).sort();
  const dateOptions = Array.from(new Set(showtimes.map(st => new Date(st.showDate).toLocaleDateString('en-CA')))).sort();

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 3 }}>
          <Button
            component={Link}
            to="/"
            startIcon={<ArrowBack />}
            variant="outlined"
            sx={{ borderRadius: 3, textTransform: 'none' }}
          >
            {t('common.back')}
          </Button>
        </Box>
        <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 4, mb: 4 }} />
        <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="text" height={24} sx={{ mb: 3, width: '50%' }} />
        <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 3, mb: 4, width: '20%' }} />
        <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} sx={{ mb: 1, width: '70%' }} />
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" align="center">{t('common.movieNotFound')}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 3 }}>
        <Button
          component={Link}
          to="/"
          startIcon={<ArrowBack />}
          variant="outlined"
          sx={{ borderRadius: 3, textTransform: 'none' }}
        >
          {t('common.back')}
        </Button>
      </Box>

      {/* Movie Header */}
      <Box sx={{
        position: 'relative',
        borderRadius: 4,
        overflow: 'hidden',
        mb: 4,
        height: { xs: 400, md: 500 },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.1) 70%, transparent 100%)',
          zIndex: 1,
        }
      }}>
        {movie.posterUrl && (
          <Box
            component="img"
            src={movie.posterUrl.startsWith('/uploads/')
              ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${movie.posterUrl}`
              : movie.posterUrl}
            alt={movie.title}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.6)',
            }}
          />
        )}

        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            zIndex: 2,
            p: { xs: 3, md: 6 },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: 4, width: '100%' }}>
            {/* Movie Poster */}
            <Box sx={{
              flexShrink: 0,
              width: { xs: 120, md: 180 },
              height: { xs: 160, md: 240 },
              borderRadius: 2,
              overflow: 'hidden',
              border: '3px solid rgba(255,255,255,0.2)',
              boxShadow: 10
            }}>
              {movie.posterUrl && (
                <Box
                  component="img"
                  src={movie.posterUrl.startsWith('/uploads/')
                    ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${movie.posterUrl}`
                    : movie.posterUrl}
                  alt={movie.title}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              )}
            </Box>

            {/* Movie Info */}
            <Box sx={{ flex: 1, mb: { xs: 2, md: 0 } }}>
              <Typography
                variant={isMobile ? "h4" : "h2"}
                component="h1"
                gutterBottom
                sx={{
                  color: 'white',
                  fontWeight: 800,
                  textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                  mb: 1
                }}
              >
                {movie.title}
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                flexWrap="wrap"
                sx={{ mb: 2 }}
              >
                <Stack direction="row" alignItems="center" spacing={1}>
                  <AccessTime sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
                  <Typography variant="h6" color="textSecondary" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    {movie.duration} {t('movieCard.mins')}
                  </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                  <RatingBadge rating={movie.rating} />
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1}>
                  <CalendarToday sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
                  <Typography variant="h6" color="textSecondary" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    {new Date(movie.releaseDate).toLocaleDateString()}
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction="row" flexWrap="wrap" spacing={1} sx={{ mb: 3 }}>
                {movie.genre?.map((g, index) => (
                  <Chip
                    key={index}
                    label={g}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      fontWeight: 500,
                    }}
                  />
                ))}
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<PlayArrow />}
                  onClick={() => setTrailerOpen(true)}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    py: 1.5,
                    fontWeight: 700,
                    textTransform: 'none',
                    minWidth: 180,
                    mb: { xs: 1, sm: 0 }
                  }}
                >
                  {t('movieDetails.watchTrailer')}
                </Button>

                <Tooltip title={!canBook ? t('rating.restriction.tooltip', { age: movie.rating === 'C18' ? 18 : movie.rating === 'C16' ? 16 : 13 }) : ''}>
                  <span>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="large"
                      component={Link}
                      to={showtimes.length > 0 ? `/book/${movie.id}/${showtimes[0].id}` : '#'}
                      disabled={!canBook || showtimes.length === 0}
                      onClick={(e) => handleBookClick(e, `/book/${movie.id}/${showtimes[0]?.id}`)}
                      sx={{
                        borderRadius: 3,
                        px: 3,
                        py: 1.5,
                        fontWeight: 700,
                        textTransform: 'none',
                        minWidth: 180,
                        borderColor: 'rgba(255,255,255,0.3)',
                        color: 'white',
                        '&:hover': {
                          borderColor: 'white',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                        },
                        '&.Mui-disabled': {
                          borderColor: 'rgba(255,255,255,0.1)',
                          color: 'rgba(255,255,255,0.3)'
                        }
                      }}
                    >
                      {t('movieDetails.bookTicket')}
                    </Button>
                  </span>
                </Tooltip>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Tabs */}
      <Paper
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)',
          mb: 4
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
            },
            '& .Mui-selected': {
              color: 'primary.main',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'primary.main',
            }
          }}
        >
          <Tab label={t('movieDetails.overview')} {...a11yProps(0)} />
          <Tab label={t('movieDetails.showtimes')} {...a11yProps(1)} />
          <Tab label={t('movieDetails.cast')} {...a11yProps(2)} />
        </Tabs>

        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
            {t('movieDetails.synopsis')}
          </Typography>
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
            {movie.synopsis}
          </Typography>

          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
                {t('movieDetails.director')}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {movie.director}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
                {t('movieDetails.releaseDate')}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {new Date(movie.releaseDate).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Showtimes Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
            {t('movieDetails.availableShowtimes')}
          </Typography>

          {/* Filters Section */}
          <Box sx={{
            mb: 3,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            px: { xs: 0, md: 2 }
          }}>
            {/* Date Filter */}
            <FormControl
              variant="outlined"
              sx={{
                minWidth: 200,
                maxWidth: 300
              }}
            >
              <InputLabel id="select-date-label">
                {t('movieDetails.selectDate')}
              </InputLabel>
              <Select
                labelId="select-date-label"
                value={selectedDate ? selectedDate.toLocaleDateString('en-CA') : 'all'}
                label={t('movieDetails.selectDate')}
                onChange={(e) => {
                  if (e.target.value === 'all') {
                    setSelectedDate(null);
                  } else {
                    const date = new Date(e.target.value);
                    setSelectedDate(date);
                  }
                }}
              >
                <MenuItem value="all">{t('common.all')}</MenuItem>
                {dateOptions.map(date => (
                    <MenuItem key={date} value={date}>
                      {new Date(date).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            {/* Format Filter */}
            <FormControl
              variant="outlined"
              sx={{
                minWidth: 200,
                maxWidth: 300
              }}
            >
              <InputLabel id="select-format-label">
                {t('movieDetails.selectFormat')}
              </InputLabel>
              <Select
                labelId="select-format-label"
                value={selectedFormat}
                label={t('movieDetails.selectFormat')}
                onChange={(e) => setSelectedFormat(e.target.value)}
              >
                <MenuItem value="all">{t('common.all')}</MenuItem>
                {formatOptions.map(format => (
                  <MenuItem key={format} value={format}>
                    {format}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {filteredShowtimes && filteredShowtimes.length > 0 ? (
            <Grid container spacing={3}>
              {filteredShowtimes.map((showtime) => {
                const isClosed = showtime.status === 'Closed';
                return (
                <Grid item key={showtime.id} xs={12} sm={6} md={4}>
                  <Card sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 3
                    }
                  }}>
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                        <CalendarToday sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {new Date(showtime.showDate).toLocaleDateString()}
                        </Typography>
                      </Stack>

                      <Typography variant="body1" gutterBottom>
                        <strong>{t('movieDetails.time')}</strong> {showtime.showTime}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>{t('movieDetails.format')}</strong> {showtime.format}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>{t('movieDetails.language')}</strong> {showtime.language}
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ mt: 1 }}>
                        {t('movieDetails.price')}: {formatCurrency(showtime.price)}
                      </Typography>
                    </CardContent>
                    <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                      <Tooltip title={!canBook ? t('rating.restriction.tooltip', { age: movie.rating === 'C18' ? 18 : movie.rating === 'C16' ? 16 : 13 }) : ''}>
                        <span>
                          <Button
                            variant="contained"
                            fullWidth
                            component={isClosed ? 'button' : Link}
                            to={isClosed ? undefined : `/book/${movie.id}/${showtime.id}`}
                            disabled={!canBook || isClosed}
                            onClick={(e) => {
                                if (isClosed) return;
                                handleBookClick(e, `/book/${movie.id}/${showtime.id}`);
                            }}
                            sx={{
                              borderRadius: 3,
                              py: 1.5,
                              fontWeight: 700,
                              textTransform: 'none'
                            }}
                          >
                            {isClosed ? 'Closed' : t('movieDetails.select')}
                          </Button>
                        </span>
                      </Tooltip>
                    </Box>
                  </Card>
                </Grid>
              );
              })}
            </Grid>
          ) : (
            <Typography variant="body1" align="center" color="text.secondary" sx={{ py: 4 }}>
              {t('movieDetails.noShowtimes')}
            </Typography>
          )}
        </TabPanel>

        {/* Cast Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
            {t('movieDetails.cast')}
          </Typography>

          <Grid container spacing={3}>
            {movie.cast && Array.isArray(movie.cast) && movie.cast.map((actor, index) => (
              <Grid item key={index} xs={6} sm={4} md={3}>
                <Card sx={{
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 3
                  }
                }}>
                  <Box sx={{
                    height: 150,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        fontSize: '2rem',
                        bgcolor: 'primary.main'
                      }}
                    >
                      {actor.charAt(0).toUpperCase()}
                    </Avatar>
                  </Box>
                  <CardContent>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {actor}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('movieDetails.actor')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Paper>

      {/* Guardian Confirmation Dialog */}
      <Dialog
        open={guardianDialogOpen}
        onClose={handleGuardianCancel}
        PaperProps={{
          sx: { borderRadius: 4, p: 1 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'warning.main' }}>
          <Warning /> {t('rating.warning.title')}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph dangerouslySetInnerHTML={{ __html: t('rating.warning.k_message') }} />
          <Alert severity="warning" sx={{ mb: 2 }}>
            {t('rating.warning.k_alert')}
          </Alert>
          <FormControlLabel
            control={
              <Checkbox
                checked={guardianConfirmed}
                onChange={(e) => setGuardianConfirmed(e.target.checked)}
              />
            }
            label={t('rating.warning.confirm_guardian')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleGuardianCancel} sx={{ color: 'text.secondary' }}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleGuardianConfirm} 
            variant="contained" 
            color="primary"
            disabled={!guardianConfirmed}
          >
            {t('rating.warning.confirm_proceed')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Trailer Dialog */}
      <Dialog
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'rgba(30,30,30,0.95)',
            backdropFilter: 'blur(10px)',
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {movie.title} - {t('movieDetails.trailer')}
          </Typography>
          <IconButton onClick={() => setTrailerOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {movie && movie.trailerUrl ? (
            <Box sx={{ width: '100%', position: 'relative', paddingBottom: '56.25%' /* 16:9 Aspect Ratio */ }}>
              <iframe
                src={`https://www.youtube.com/embed/${extractYouTubeVideoId(movie.trailerUrl)}`}
                title="Movie Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px'
                }}
              />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
              <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(0,0,0,0.5)',
                borderRadius: 2
              }}>
                <Typography variant="h6" color="text.secondary">
                  {t('common.movieNotFound')} - {t('movieDetails.trailer')}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTrailerOpen(false)} sx={{ borderRadius: 3, textTransform: 'none' }}>
            {t('common.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MovieDetails;