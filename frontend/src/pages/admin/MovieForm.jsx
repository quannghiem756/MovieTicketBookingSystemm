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
  IconButton,
  Pagination,
  Stack
} from '@mui/material';
import {
  ArrowBack,
  Save,
  Edit,
  Delete,
  Add as AddIcon
} from '@mui/icons-material';
import { getTheaters, getShowtimesByMovieId, createShowtime, updateShowtime, deleteShowtime } from '../../services/api';
import { formatCurrency } from '../../utils/currency';

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
    posterFile: null,  // Changed from posterUrl to posterFile
    posterUrl: '',     // For displaying current image when editing
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

  // Pagination state for showtimes
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Number of showtimes per page

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
      // Reset to first page when showtimes are updated
      setPage(1);
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
      // Page is reset to 1 in fetchShowtimes
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
      // Page is reset to 1 in fetchShowtimes
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
      // Prepare data for submission - use FormData for file upload
      const formDataToSend = new FormData();

      // Add all other fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('director', formData.director);
      formDataToSend.append('synopsis', formData.synopsis);
      formDataToSend.append('duration', parseInt(formData.duration) || 0);
      formDataToSend.append('rating', formData.rating);
      formDataToSend.append('trailerUrl', formData.trailerUrl);
      formDataToSend.append('releaseDate', formData.releaseDate);
      formDataToSend.append('endDate', formData.endDate);

      // Add cast and genre as arrays
      const castArray = formData.cast.split(',').map(item => item.trim()).filter(item => item);
      const genreArray = formData.genre.split(',').map(item => item.trim()).filter(item => item);

      formDataToSend.append('cast', JSON.stringify(castArray));
      formDataToSend.append('genre', JSON.stringify(genreArray));

      // Add image file if selected
      if (formData.posterFile) {
        formDataToSend.append('poster', formData.posterFile);
      } else if (isEdit && formData.posterUrl) {
        // If editing and no new file selected, keep the existing URL
        formDataToSend.append('posterUrl', formData.posterUrl);
      }

      if (isEdit) {
        await api.put(`/movies/${id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await api.post('/movies', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
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
            </Box>

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

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
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
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
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
            </Box>

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

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
              <FormControl fullWidth sx={{ width: "100%" }}>
                {/* Image Upload Section */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    {t('admin.movieForm.posterImage')}
                  </Typography>
                  <input
                    accept="image/*"
                    id="poster-upload"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setFormData({
                          ...formData,
                          posterFile: file,
                          posterUrl: URL.createObjectURL(file) // Preview the selected image
                        });
                      }
                    }}
                  />
                  <label htmlFor="poster-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      sx={{ mb: 1 }}
                    >
                      {t('admin.movieForm.selectImage')}
                    </Button>
                  </label>
                  {formData.posterUrl && !formData.posterFile && !formData.posterUrl.startsWith('/uploads/') && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {t('admin.movieForm.currentImage')}: {formData.posterUrl.split('/').pop()}
                    </Typography>
                  )}
                  {formData.posterFile && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {t('admin.movieForm.selectedFile')}: {formData.posterFile.name}
                    </Typography>
                  )}
                  {formData.posterUrl && (
                    <Box sx={{ mt: 1 }}>
                      <img
                        src={formData.posterUrl && formData.posterUrl.startsWith('/uploads/')
                          ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${formData.posterUrl}`
                          : formData.posterUrl}
                        alt={t('admin.movieForm.posterPreview')}
                        style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                    </Box>
                  )}
                </Box>
              </FormControl>

              <FormControl fullWidth sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  label={t('admin.movieForm.trailerUrl')}
                  name="trailerUrl"
                  value={formData.trailerUrl}
                  onChange={handleChange}
                />
              </FormControl>
            </Box>
          </Box>

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
            <Box>
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
                    {showtimes
                      .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                      .map((showtime) => (
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
                          <TableCell>{formatCurrency(showtime.price)}</TableCell>
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
              <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Pagination Controls */}
                <Pagination
                  count={Math.ceil(showtimes.length / rowsPerPage)}
                  page={page}
                  onChange={(event, value) => setPage(value)}
                  color="primary"
                />
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    {t('admin.movieForm.rowsPerPage')}:
                  </Typography>
                  <Select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setPage(1); // Reset to first page when changing rows per page
                    }}
                    size="small"
                    sx={{ width: 80 }}
                  >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                  </Select>
                </Box>
              </Box>
            </Box>
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
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
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                <TextField
                  fullWidth
                  label={t('admin.movieForm.showtimeTime')}
                  name="showTime"
                  value={showtimeForm.showTime}
                  onChange={handleShowtimeFormChange}
                  placeholder="e.g., 7:30 PM"
                  required
                />
                <TextField
                  fullWidth
                  label={t('admin.movieForm.showtimeFormat')}
                  name="format"
                  value={showtimeForm.format}
                  onChange={handleShowtimeFormChange}
                  placeholder="e.g., 2D, 3D, IMAX"
                />
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                <TextField
                  fullWidth
                  label={t('admin.movieForm.showtimeLanguage')}
                  name="language"
                  value={showtimeForm.language}
                  onChange={handleShowtimeFormChange}
                  placeholder="e.g., English, Spanish"
                />
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
              </Box>
            </Box>
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