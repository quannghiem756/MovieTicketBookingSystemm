import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import {
  ArrowBack,
  Save
} from '@mui/icons-material';
import { getMovies, getTheaters, getShowtimeById, createShowtime, updateShowtime } from '../../services/api';

const ShowtimeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    movieId: '',
    theaterId: '',
    showDate: '',
    showTime: '',
    format: '',
    language: '',
    price: ''
  });

  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMovies();
    fetchTheaters();
    if (isEdit) {
      fetchShowtime();
    }
  }, [id]);

  const fetchMovies = async () => {
    try {
      const response = await getMovies();
      setMovies(response.data);
    } catch (err) {
      console.error('Failed to fetch movies:', err);
    }
  };

  const fetchTheaters = async () => {
    try {
      const response = await getTheaters();
      setTheaters(response.data);
    } catch (err) {
      console.error('Failed to fetch theaters:', err);
    }
  };

  const fetchShowtime = async () => {
    try {
      const response = await getShowtimeById(id);
      const showtime = response.data;
      setFormData({
        movieId: showtime.movieId || '',
        theaterId: showtime.theaterId || '',
        showDate: showtime.showDate ? new Date(showtime.showDate).toISOString().split('T')[0] : '',
        showTime: showtime.showTime || '',
        format: showtime.format || '',
        language: showtime.language || '',
        price: showtime.price || ''
      });
    } catch (err) {
      setError('Failed to fetch showtime');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Prepare data for submission
      const showtimeData = {
        ...formData,
        price: parseFloat(formData.price) || 0
      };

      if (isEdit) {
        await updateShowtime(id, showtimeData);
      } else {
        await createShowtime(showtimeData);
      }

      navigate('/admin/showtimes');
    } catch (err) {
      setError('Failed to save showtime: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: '1024px', mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEdit ? 'Edit Showtime' : 'Add New Showtime'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mx: 'auto' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Movie</InputLabel>
                <Select
                  name="movieId"
                  value={formData.movieId}
                  onChange={handleChange}
                  label="Movie"
                >
                  <MenuItem value="">
                    <em>Select a movie</em>
                  </MenuItem>
                  {movies.map((movie) => (
                    <MenuItem key={movie.id} value={movie.id}>
                      {movie.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Theater</InputLabel>
                <Select
                  name="theaterId"
                  value={formData.theaterId}
                  onChange={handleChange}
                  label="Theater"
                >
                  <MenuItem value="">
                    <em>Select a theater</em>
                  </MenuItem>
                  {theaters.map((theater) => (
                    <MenuItem key={theater.id} value={theater.id}>
                      {theater.name} ({theater.location})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Show Date"
                name="showDate"
                value={formData.showDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Show Time"
                name="showTime"
                value={formData.showTime}
                onChange={handleChange}
                placeholder="e.g., 7:30 PM"
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Format"
                name="format"
                value={formData.format}
                onChange={handleChange}
                placeholder="e.g., 2D, 3D, IMAX"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                placeholder="e.g., English, Spanish"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Price ($)"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                InputProps={{
                  inputProps: { min: 0 }
                }}
                required
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/admin/showtimes')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <Save />}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Showtime'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ShowtimeForm;