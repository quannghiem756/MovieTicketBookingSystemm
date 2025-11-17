import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  Divider
} from '@mui/material';
import { 
  PlayArrow, 
  CalendarToday, 
  AccessTime, 
  Star, 
  ArrowBack,
  Movie, 
  Close
} from '@mui/icons-material';
import { getMovieById, getShowtimesByMovieId } from '../services/api';
import { useTranslation } from '../context/I18nContext';
import { formatCurrency } from '../utils/currency';

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

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const [movieResponse, showtimesResponse] = await Promise.all([
          getMovieById(id),
          getShowtimesByMovieId(id)
        ]);
        setMovie(movieResponse.data);
        setShowtimes(showtimesResponse.data || []);
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
            src={movie.posterUrl}
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
                  src={movie.posterUrl}
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
                  <Star sx={{ color: '#FFD700', fontSize: '1.2rem' }} />
                  <Typography variant="h6" color="textSecondary" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    {movie.rating}
                  </Typography>
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
                
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  component={Link}
                  to={`/book/${movie.id}/${showtimes[0]?.id || ''}`}
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
                    }
                  }}
                >
                  {t('movieDetails.bookTicket')}
                </Button>
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
          
          {showtimes && showtimes.length > 0 ? (
            <Grid container spacing={3}>
              {showtimes.map((showtime) => (
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
                        <strong>{t('movieDetails.time')}:</strong> {showtime.showTime}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>{t('movieDetails.format')}:</strong> {showtime.format}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>{t('movieDetails.language')}:</strong> {showtime.language}
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary.main" sx={{ mt: 1 }}>
                        {t('movieDetails.price')}: {formatCurrency(showtime.price)}
                      </Typography>
                    </CardContent>
                    <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                      <Button 
                        variant="contained" 
                        fullWidth
                        component={Link} 
                        to={`/book/${movie.id}/${showtime.id}`}
                        sx={{ 
                          borderRadius: 3,
                          py: 1.5,
                          fontWeight: 700,
                          textTransform: 'none'
                        }}
                      >
                        {t('movieDetails.select')}
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
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
              <PlayArrow sx={{ fontSize: 60, color: 'white' }} />
            </Box>
          </Box>
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