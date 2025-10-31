// pages/admin/MovieForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
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
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Edit,
  Delete,
  Add as AddIcon
} from '@mui/icons-material';
import { getTheaters, getShowtimesByMovieId, createShowtime, updateShowtime, deleteShowtime } from '../../services/api';

const MovieForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    title: '',
    director: '',
    cast: '',
    synopsis: '',
    duration: '',
    genre: '',
    rating: '',
    posterUrl: '',
    trailerUrl: '',
    releaseDate: '',
    endDate: ''
  });

  const [showtimes, setShowtimes] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [showtimeForm, setShowtimeForm] = useState({
    theaterId: '',
    showDate: '',
    showTime: '',
    format: '',
    language: '',
    price: ''
  });
  const [showtimeFormOpen, setShowtimeFormOpen] = useState(false);
  const [editingShowtimeId, setEditingShowtimeId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showtimeToDelete, setShowtimeToDelete] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchMovie();
      fetchShowtimes();
    }
    fetchTheaters();
  }, [id]);

  const fetchMovie = async () => {
    try {
      const response = await api.get(`/movies/${id}`);
      const movie = response.data;
      setFormData({
        title: movie.title || '',
        director: movie.director || '',
        cast: movie.cast ? movie.cast.join(', ') : '',
        synopsis: movie.synopsis || '',
        duration: movie.duration || '',
        genre: movie.genre ? movie.genre.join(', ') : '',
        rating: movie.rating || '',
        posterUrl: movie.posterUrl || '',
        trailerUrl: movie.trailerUrl || '',
        releaseDate: movie.releaseDate ? new Date(movie.releaseDate).toISOString().split('T')[0] : '',
        endDate: movie.endDate ? new Date(movie.endDate).toISOString().split('T')[0] : ''
      });
    } catch (err) {
      setError(t('common.error'));
    }
  };

  const fetchShowtimes = async () => {
    try {
      const response = await getShowtimesByMovieId(id);
      setShowtimes(response.data);
    } catch (err) {
      console.error('Failed to fetch showtimes:', err);
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

  const handleShowtimeFormChange = (e) => {
    setShowtimeForm({
      ...showtimeForm,
      [e.target.name]: e.target.value
    });
  };

  const openShowtimeForm = (showtime = null) => {
    if (showtime) {
      // Editing existing showtime
      setShowtimeForm({
        theaterId: showtime.theaterId || '',
        showDate: showtime.showDate ? new Date(showtime.showDate).toISOString().split('T')[0] : '',
        showTime: showtime.showTime || '',
        format: showtime.format || '',
        language: showtime.language || '',
        price: showtime.price || ''
      });
      setEditingShowtimeId(showtime.id);
    } else {
      // Creating new showtime
      setShowtimeForm({
        theaterId: '',
        showDate: '',
        showTime: '',
        format: '',
        language: '',
        price: ''
      });
      setEditingShowtimeId(null);
    }
    setShowtimeFormOpen(true);
  };

  const closeShowtimeForm = () => {
    setShowtimeFormOpen(false);
    setEditingShowtimeId(null);
  };

  const handleShowtimeSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const showtimeData = {
        ...showtimeForm,
        movieId: id,
        price: parseFloat(showtimeForm.price) || 0
      };
      
      if (editingShowtimeId) {
        // Update existing showtime
        await updateShowtime(editingShowtimeId, showtimeData);
      } else {
        // Create new showtime
        await createShowtime(showtimeData);
      }
      
      // Refresh showtimes
      await fetchShowtimes();
      closeShowtimeForm();
    } catch (err) {
      setError('Failed to save showtime: ' + err.message);
    }
  };

  const handleDeleteShowtimeClick = (showtime) => {
    setShowtimeToDelete(showtime);
    setDeleteDialogOpen(true);
  };

  const handleDeleteShowtimeConfirm = async () => {
    if (!showtimeToDelete) return;
    
    try {
      await deleteShowtime(showtimeToDelete.id);
      await fetchShowtimes();
      setDeleteDialogOpen(false);
      setShowtimeToDelete(null);
    } catch (err) {
      setError('Failed to delete showtime: ' + err.message);
      setDeleteDialogOpen(false);
      setShowtimeToDelete(null);
    }
  };

  const handleDeleteShowtimeCancel = () => {
    setDeleteDialogOpen(false);
    setShowtimeToDelete(null);
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
      const movieData = {
        ...formData,
        cast: formData.cast.split(',').map(item => item.trim()).filter(item => item),
        genre: formData.genre.split(',').map(item => item.trim()).filter(item => item),
        duration: parseInt(formData.duration) || 0
      };

      if (isEdit) {
        await api.put(`/movies/${id}`, movieData);
      } else {
        await api.post('/movies', movieData);
      }

      navigate('/admin/movies');
    } catch (err) {
      setError(t('admin.movieForm.error') + ' ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: '1024px', mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEdit ? t('admin.movieForm.editTitle') : t('admin.movieForm.addTitle')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mx: 'auto', mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  label={t('admin.movieForm.title')}
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  label={t('admin.movieForm.director')}
                  name="director"
                  value={formData.director}
                  onChange={handleChange}
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={12}>
              <FormControl fullWidth sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  label={t('admin.movieForm.cast')}
                  name="cast"
                  value={formData.cast}
                  onChange={handleChange}
                  placeholder="Actor 1, Actor 2, Actor 3"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3} >
              <FormControl fullWidth sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('admin.movieForm.duration')}
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3} >
              <FormControl fullWidth sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  label={t('admin.movieForm.genre')}
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  placeholder="Action, Adventure, Sci-Fi"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth sx={{ width: "100%", minWidth:120 }}>
                <InputLabel>{t('admin.movieForm.rating')}</InputLabel>
                <Select
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  label={t('admin.movieForm.rating')}
                >
                  <MenuItem value="G">G</MenuItem>
                  <MenuItem value="PG">PG</MenuItem>
                  <MenuItem value="PG-13">PG-13</MenuItem>
                  <MenuItem value="R">R</MenuItem>
                  <MenuItem value="NC-17">NC-17</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  type="date"
                  label={t('admin.movieForm.releaseDate')}
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  type="date"
                  label={t('admin.movieForm.endDate')}
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label={t('admin.movieForm.synopsis')}
                  name="synopsis"
                  value={formData.synopsis}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  label={t('admin.movieForm.posterUrl')}
                  name="posterUrl"
                  value={formData.posterUrl}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  label={t('admin.movieForm.trailerUrl')}
                  name="trailerUrl"
                  value={formData.trailerUrl}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/admin/movies')}
            >
              {t('admin.movieForm.cancel')}
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <Save />}
              disabled={loading}
            >
              {loading ? t('admin.movieForm.saving') : t('admin.movieForm.save')}
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Showtimes Section - Only show when editing a movie */}
      {isEdit && (
        <Paper sx={{ p: 3, mx: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2">
              {t('admin.movieForm.showtimesTitle')}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => openShowtimeForm()}
            >
              {t('admin.movieForm.addShowtime')}
            </Button>
          </Box>

          {showtimes.length > 0 ? (
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="showtimes table">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('admin.movieForm.showtimeDate')}</TableCell>
                    <TableCell>{t('admin.movieForm.showtimeTime')}</TableCell>
                    <TableCell>{t('admin.movieForm.showtimeTheater')}</TableCell>
                    <TableCell>{t('admin.movieForm.showtimeFormat')}</TableCell>
                    <TableCell>{t('admin.movieForm.showtimeLanguage')}</TableCell>
                    <TableCell>{t('admin.movieForm.showtimePrice')}</TableCell>
                    <TableCell>{t('admin.movieForm.showtimeActions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {showtimes.map((showtime) => (
                    <TableRow
                      key={showtime.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>
                        {showtime.showDate ? new Date(showtime.showDate).toLocaleDateString() : ''}
                      </TableCell>
                      <TableCell>{showtime.showTime}</TableCell>
                      <TableCell>{t('admin.movieForm.theater')} {showtime.theaterId}</TableCell>
                      <TableCell>{showtime.format}</TableCell>
                      <TableCell>{showtime.language}</TableCell>
                      <TableCell>${showtime.price}</TableCell>
                      <TableCell>
                        <IconButton 
                          onClick={() => openShowtimeForm(showtime)}
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleDeleteShowtimeClick(showtime)}
                          size="small"
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
              {t('admin.movieForm.noShowtimes')}
            </Typography>
          )}
        </Paper>
      )}

      {/* Showtime Form Dialog */}
      <Dialog open={showtimeFormOpen} onClose={closeShowtimeForm} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingShowtimeId ? t('admin.movieForm.editShowtime') : t('admin.movieForm.addShowtime')}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleShowtimeSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required sx={{minWidth:120}}>
                  <InputLabel>{t('admin.movieForm.theater')}</InputLabel>
                  <Select
                    name="theaterId"
                    value={showtimeForm.theaterId}
                    onChange={handleShowtimeFormChange}
                    label={t('admin.movieForm.theater')}
                  >
                    <MenuItem value="">
                      <em>{t('admin.movieForm.selectTheater')}</em>
                    </MenuItem>
                    {theaters.map((theater) => (
                      <MenuItem key={theater.id} value={theater.id}>
                        {theater.name} ({theater.location})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label={t('admin.movieForm.showtimeDate')}
                  name="showDate"
                  value={showtimeForm.showDate}
                  onChange={handleShowtimeFormChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('admin.movieForm.showtimeTime')}
                  name="showTime"
                  value={showtimeForm.showTime}
                  onChange={handleShowtimeFormChange}
                  placeholder="e.g., 7:30 PM"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('admin.movieForm.showtimeFormat')}
                  name="format"
                  value={showtimeForm.format}
                  onChange={handleShowtimeFormChange}
                  placeholder="e.g., 2D, 3D, IMAX"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('admin.movieForm.showtimeLanguage')}
                  name="language"
                  value={showtimeForm.language}
                  onChange={handleShowtimeFormChange}
                  placeholder="e.g., English, Spanish"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label={t('admin.movieForm.showtimePrice')}
                  name="price"
                  value={showtimeForm.price}
                  onChange={handleShowtimeFormChange}
                  step="0.01"
                  InputProps={{
                    inputProps: { min: 0 }
                  }}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeShowtimeForm}>{t('admin.movieForm.cancel')}</Button>
          <Button 
            variant="contained" 
            onClick={handleShowtimeSubmit}
            startIcon={loading ? <CircularProgress size={20} /> : <Save />}
            disabled={loading}
          >
            {loading ? t('admin.movieForm.saving') : t('admin.movieForm.save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteShowtimeCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          {t('admin.movieForm.deleteShowtimeConfirm')}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {showtimeToDelete && `${t('admin.movieForm.deleteShowtimeMessage')} "${new Date(showtimeToDelete.showDate).toLocaleDateString()} ${showtimeToDelete.showTime}"?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteShowtimeCancel} color="primary">
            {t('admin.movieForm.cancel')}
          </Button>
          <Button onClick={handleDeleteShowtimeConfirm} color="error" variant="contained">
            {t('admin.movieForm.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MovieForm;