import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Container,
  Box,
  Paper,
  Tabs,
  Tab,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
  Skeleton
} from '@mui/material';
import { 
  CalendarToday, 
  AccessTime, 
  LocalMovies,
  ArrowBack,
  Star
} from '@mui/icons-material';
import { getMovieById, getShowtimesByMovieId } from '../services/api';
import { useTranslation } from '../context/I18nContext';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`showtimes-tabpanel-${index}`}
      aria-labelledby={`showtimes-tab-${index}`}
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
    id: `showtimes-tab-${index}`,
    'aria-controls': `showtimes-tabpanel-${index}`,
  };
}

const ShowtimesPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        setLoading(true);
        const [movieResponse, showtimesResponse] = await Promise.all([
          getMovieById(movieId),
          getShowtimesByMovieId(movieId)
        ]);
        setMovie(movieResponse.data);
        setShowtimes(showtimesResponse.data || []);
      } catch (error) {
        console.error('Error fetching showtimes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, [movieId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Group showtimes by date
  const groupShowtimesByDate = () => {
    const grouped = {};
    
    showtimes.forEach(showtime => {
      const date = new Date(showtime.showDate).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(showtime);
    });
    
    return grouped;
  };

  // Group showtimes by format
  const groupShowtimesByFormat = () => {
    const grouped = {};
    
    showtimes.forEach(showtime => {
      const format = showtime.format || 'Standard';
      if (!grouped[format]) {
        grouped[format] = [];
      }
      grouped[format].push(showtime);
    });
    
    return grouped;
  };

  const groupedByDate = groupShowtimesByDate();
  const groupedByFormat = groupShowtimesByFormat();
  const dates = Object.keys(groupedByDate).sort((a, b) => new Date(a) - new Date(b));
  const formats = Object.keys(groupedByFormat);

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
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 4, mb: 4 }} />
        <Skeleton variant="text" height={50} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 3, mb: 3 }} />
        <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 3, mb: 3 }} />
        <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 3, mb: 3 }} />
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
          to={`/movie/${movieId}`} 
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
        height: { xs: 250, md: 350 },
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
          <Box>
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
              <Chip
                icon={<AccessTime />}
                label={`${movie.duration} ${t('movieCard.mins')}`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  fontWeight: 500,
                }}
              />
              
              <Chip
                icon={<Star />}
                label={movie.rating}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  fontWeight: 500,
                }}
              />
              
              <Chip
                icon={<CalendarToday />}
                label={new Date(movie.releaseDate).toLocaleDateString()}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  backdropFilter: 'blur(10px)',
                  fontWeight: 500,
                }}
              />
            </Stack>
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
          <Tab label={t('showtimes.byDate')} {...a11yProps(0)} />
          <Tab label={t('showtimes.byFormat')} {...a11yProps(1)} />
        </Tabs>

        {/* By Date Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
            {t('showtimes.selectDate')}
          </Typography>
          
          {dates.length > 0 ? (
            <Grid container spacing={3}>
              {dates.map((date, index) => {
                const showtimesForDate = groupedByDate[date];
                return (
                  <Grid item key={index} xs={12}>
                    <Paper 
                      sx={{ 
                        p: 3, 
                        borderRadius: 3,
                        border: selectedDate === date ? '2px solid' : '1px solid',
                        borderColor: selectedDate === date ? 'primary.main' : 'rgba(255,255,255,0.1)',
                        backgroundColor: selectedDate === date ? 'rgba(211, 47, 47, 0.05)' : 'transparent'
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        gutterBottom 
                        sx={{ 
                          fontWeight: 700, 
                          mb: 2,
                          color: selectedDate === date ? 'primary.main' : 'inherit'
                        }}
                      >
                        <CalendarToday sx={{ verticalAlign: 'middle', mr: 1 }} />
                        {new Date(date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </Typography>
                      
                      <Grid container spacing={2}>
                        {showtimesForDate.map((showtime) => (
                          <Grid item key={showtime.id}>
                            <Button
                              variant={selectedDate === date ? "contained" : "outlined"}
                              color="primary"
                              startIcon={<AccessTime />}
                              onClick={() => navigate(`/book/${movieId}/${showtime.id}`)}
                              sx={{ 
                                borderRadius: 3, 
                                px: 3, 
                                py: 1.5,
                                fontWeight: 600,
                                textTransform: 'none'
                              }}
                            >
                              {showtime.showTime}
                            </Button>
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Typography variant="body1" align="center" color="text.secondary" sx={{ py: 4 }}>
              {t('showtimes.noShowtimes')}
            </Typography>
          )}
        </TabPanel>

        {/* By Format Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
            {t('showtimes.byFormat')}
          </Typography>
          
          {formats.length > 0 ? (
            <Grid container spacing={3}>
              {formats.map((format, index) => {
                const showtimesForFormat = groupedByFormat[format];
                return (
                  <Grid item key={index} xs={12} md={6}>
                    <Card 
                      sx={{ 
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
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center' }}>
                          <LocalMovies sx={{ mr: 1, color: 'primary.main' }} />
                          {format}
                        </Typography>
                        
                        <Grid container spacing={1}>
                          {showtimesForFormat.map((showtime) => (
                            <Grid item key={showtime.id}>
                              <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<CalendarToday />}
                                onClick={() => navigate(`/book/${movieId}/${showtime.id}`)}
                                sx={{ 
                                  borderRadius: 3, 
                                  px: 2, 
                                  py: 1,
                                  fontWeight: 600,
                                  textTransform: 'none'
                                }}
                              >
                                {new Date(showtime.showDate).toLocaleDateString()} at {showtime.showTime}
                              </Button>
                            </Grid>
                          ))}
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Typography variant="body1" align="center" color="text.secondary" sx={{ py: 4 }}>
              {t('showtimes.noShowtimes')}
            </Typography>
          )}
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default ShowtimesPage;