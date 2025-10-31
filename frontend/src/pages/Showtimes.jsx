import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Container,
  Box,
  Paper,
  Chip
} from '@mui/material';
import { movieService, showtimeService } from '../services/api';

const Showtimes = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        if (movieId) {
          const movieData = await movieService.getById(movieId);
          setMovie(movieData);
          
          const showtimeData = await showtimeService.getByMovieId(movieId);
          setShowtimes(showtimeData);
        }
      } catch (error) {
        console.error('Error fetching showtimes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, [movieId]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" align="center">Loading showtimes...</Typography>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" align="center">Movie not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
        <Typography variant="h3" gutterBottom fontWeight="bold">
          {movie.title}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          {movie.genre?.map((genre, index) => (
            <Chip 
              key={index} 
              label={genre} 
              sx={{ mr: 1, mb: 1 }} 
              variant="outlined"
            />
          ))}
        </Box>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          {movie.duration} min • {movie.rating}
        </Typography>
      </Paper>
      
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
          Select Showtime
        </Typography>
        
        {showtimes && showtimes.length > 0 ? (
          <Grid container spacing={3}>
            {showtimes.map((showtime) => (
              <Grid item key={showtime._id} xs={12} sm={6} md={4}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {new Date(showtime.showDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {showtime.showTime}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Format: {showtime.format}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Language: {showtime.language}
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" color="primary.main" gutterBottom>
                      Price: ${showtime.price.toFixed(2)}
                    </Typography>
                  </CardContent>
                  <Box sx={{ p: 2 }}>
                    <Button 
                      variant="contained" 
                      fullWidth
                      component={Link} 
                      to={`/seats/${showtime._id}`}
                    >
                      Select Seats
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" align="center" color="text.secondary" sx={{ py: 4 }}>
            No showtimes available for this movie.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Showtimes;