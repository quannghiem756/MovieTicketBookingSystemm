// pages/admin/ShowtimeForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../context/I18nContext';
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
  const { t } = useTranslation();

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
      setMovies(response.data.movies || response.data);
    } catch (err) {
      console.error(t('admin.showtimeForm.fetchMoviesError'), err);
    }
  };

  const fetchTheaters = async () => {
    try {
      const response = await getTheaters();
      setTheaters(response.data);
    } catch (err) {
      console.error(t('admin.showtimeForm.fetchTheatersError'), err);
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
      setError(t('admin.showtimeForm.fetchError'));
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
      setError(t('admin.showtimeForm.saveError') + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: '1024px', mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEdit ? t('admin.showtimeForm.editTitle') : t('admin.showtimeForm.addTitle')}
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
              <FormControl fullWidth required sx={{minWidth: 120}}>
                <InputLabel>{t('admin.showtimeForm.movie')}</InputLabel>
                <Select
                  name="movieId"
                  value={formData.movieId}
                  onChange={handleChange}
                  label={t('admin.showtimeForm.movie')}
                >
                  <MenuItem value="">
                    <em>{t('admin.showtimeForm.selectMovie')}</em>
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
              <FormControl fullWidth required sx={{minWidth: 150}}>
                <InputLabel>{t('admin.showtimeForm.theater')}</InputLabel>
                <Select
                  name="theaterId"
                  value={formData.theaterId}
                  onChange={handleChange}
                  label={t('admin.showtimeForm.theater')}
                >
                  <MenuItem value="">
                    <em>{t('admin.showtimeForm.selectTheater')}</em>
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
                label={t('admin.showtimeForm.showDate')}
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
                label={t('admin.showtimeForm.showTime')}
                name="showTime"
                value={formData.showTime}
                onChange={handleChange}
                placeholder={t('admin.showtimeForm.timePlaceholder')}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('admin.showtimeForm.format')}
                name="format"
                value={formData.format}
                onChange={handleChange}
                placeholder={t('admin.showtimeForm.formatPlaceholder')}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('admin.showtimeForm.language')}
                name="language"
                value={formData.language}
                onChange={handleChange}
                placeholder={t('admin.showtimeForm.languagePlaceholder')}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label={t('admin.showtimeForm.price')}
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
              {t('admin.showtimeForm.cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <Save />}
              disabled={loading}
            >
              {loading ? t('admin.showtimeForm.saving') : t('admin.showtimeForm.save')}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default ShowtimeForm;