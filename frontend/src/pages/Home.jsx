import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Box,
  Container,
  Paper,
  CircularProgress,
  Button,
  Chip,
  Divider,
  Card,
  CardMedia,
  CardContent,
  useTheme,
  useMediaQuery,
  Skeleton
} from '@mui/material';
import { PlayArrow, ArrowForward } from '@mui/icons-material';
import MovieCard from '../components/MovieCard';
import { getNowShowing, getComingSoon } from '../services/api';
import { useTranslation } from '../context/I18nContext';

const HeroSection = ({ movie }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: 400, sm: 500, md: 600 },
        borderRadius: 4,
        overflow: 'hidden',
        mb: 8,
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
      }}
    >
      {movie?.posterUrl && (
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
            filter: 'brightness(0.7)',
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
        <Box sx={{ maxWidth: { xs: '100%', md: '60%' } }}>
          <Chip
            label={movie?.rating || 'PG-13'}
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              mb: 2,
              height: 'auto',
              '& .MuiChip-label': {
                px: 1.5,
                py: 0.5,
              }
            }}
          />
          <Typography
            variant={isMobile ? 'h3' : 'h2'}
            component="h1"
            gutterBottom
            sx={{
              color: 'white',
              fontWeight: 700,
              textShadow: '0 2px 10px rgba(0,0,0,0.8)',
              mb: 2
            }}
          >
            {movie?.title || t('home.heroTitle')}
          </Typography>
          <Typography
            variant="h6"
            color="textSecondary"
            sx={{
              color: 'rgba(255,255,255,0.85)',
              mb: 3,
              textShadow: '0 1px 5px rgba(0,0,0,0.8)',
              display: { xs: 'none', md: 'block' }
            }}
          >
            {movie?.synopsis || t('home.heroSubtitle')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<PlayArrow />}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.5,
                fontWeight: 600
              }}
            >
              {t('home.watchTrailer')}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                borderColor: 'rgba(255,255,255,0.3)',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }
              }}
              href={movie ? `/movie/${movie.id}` : '#'}
            >
              {t('home.bookTicket')}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const SectionTitle = ({ title, subtitle }) => (
  <Box sx={{ mb: 6, textAlign: { xs: 'center', md: 'left' } }}>
    <Typography
      variant="h3"
      component="h2"
      sx={{
        fontWeight: 700,
        mb: 1,
        background: 'linear-gradient(90deg, #ffffff 0%, #b3b3b3 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {title}
    </Typography>
    {subtitle && (
      <Typography
        variant="h6"
        color="textSecondary"
        sx={{ opacity: 0.7 }}
      >
        {subtitle}
      </Typography>
    )}
  </Box>
);

const Home = () => {
  const [nowShowing, setNowShowing] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [nowShowingResponse, comingSoonResponse] = await Promise.allSettled([
          getNowShowing(1, 8),
          getComingSoon(1, 8)
        ]);

        if (nowShowingResponse.status === 'fulfilled') {
          setNowShowing(nowShowingResponse.value.data?.movies || []);
        } else {
          console.error('Error fetching now showing movies:', nowShowingResponse.reason);
          setNowShowing([]);
        }

        if (comingSoonResponse.status === 'fulfilled') {
          setComingSoon(comingSoonResponse.value.data?.movies || []);
        } else {
          console.error('Error fetching coming soon movies:', comingSoonResponse.reason);
          setComingSoon([]);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
        setNowShowing([]);
        setComingSoon([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading && (!nowShowing.length && !comingSoon.length)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <HeroSection movie={nowShowing[0]} />

      {/* Now Showing Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <SectionTitle
          title={t('home.nowShowing')}
          subtitle={t('home.nowShowingSubtitle')}
        />

        {loading ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {[...Array(4)].map((_, index) => (
              <Box key={index} sx={{ flex: '1 1 calc(25% - 12px)', minWidth: 250, maxWidth: 'calc(25% - 12px)' }}>
                <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 4 }} />
              </Box>
            ))}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {Array.isArray(nowShowing) && nowShowing.slice(0, 8).map((movie) => (
              <Box
                key={movie.id}
                sx={{
                  flex: '1 1 calc(25% - 24px)', // <-- Correct math for 32px gap
                  maxWidth: 'calc(25% - 24px)', // <-- Must match
                  minWidth: 220 // <-- Lower this so it doesn't wrap so early
                }}
              >
                <MovieCard movie={movie} />
              </Box>
            ))}
            {nowShowing.length === 0 && (
              <Box sx={{ width: '100%' }}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h6" color="textSecondary">
                    {t('home.noMovies')}
                  </Typography>
                </Paper>
              </Box>
            )}
          </Box>
        )}
      </Container>

      {/* Divider */}
      <Divider
        sx={{
          my: 6,
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: '1px'
        }}
      />

      {/* Coming Soon Section */}
      <Container maxWidth="lg">
        <SectionTitle
          title={t('home.comingSoon')}
          subtitle={t('home.comingSoonSubtitle')}
        />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {Array.isArray(comingSoon) && comingSoon.slice(0, 8).map((movie) => (
            <Box key={movie.id} sx={{ flex: '1 1 calc(25% - 12px)', minWidth: 250, maxWidth: 'calc(25% - 12px)' }}>
              <MovieCard movie={movie} />
            </Box>
          ))}
          {comingSoon.length === 0 && !loading && (
            <Box sx={{ width: '100%' }}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="textSecondary">
                  {t('home.noComingSoon')}
                </Typography>
              </Paper>
            </Box>
          )}
        </Box>
      </Container>
    </Container>
  );
};

export default Home;