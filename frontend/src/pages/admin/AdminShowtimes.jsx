// pages/admin/AdminShowtimes.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useTranslation } from '../../context/I18nContext';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import {
  Add,
  Edit,
  Delete
} from '@mui/icons-material';

const AdminShowtimes = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showtimeToDelete, setShowtimeToDelete] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const showtimesResponse = await api.get('/showtimes');
        const moviesResponse = await api.get('/movies');
        const theatersResponse = await api.get('/theaters');
        
        setShowtimes(showtimesResponse.data);
        setMovies(moviesResponse.data.movies || moviesResponse.data);
        setTheaters(theatersResponse.data);
        setLoading(false);
      } catch (err) {
        setError(t('admin.showtimes.fetchError'));
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteClick = (showtime) => {
    setShowtimeToDelete(showtime);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!showtimeToDelete) return;
    
    try {
      await api.delete(`/showtimes/${showtimeToDelete.id}`);
      setShowtimes(showtimes.filter(showtime => showtime.id !== showtimeToDelete.id));
      setDeleteDialogOpen(false);
      setShowtimeToDelete(null);
    } catch (err) {
      alert(t('admin.showtimes.deleteError'));
      setDeleteDialogOpen(false);
      setShowtimeToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setShowtimeToDelete(null);
  };

  const getMovieTitle = (movieId) => {
    const movie = movies.find(m => m.id === movieId);
    return movie ? movie.title : t('admin.showtimes.unknownMovie');
  };

  const getTheaterName = (theaterId) => {
    const theater = theaters.find(t => t.id === theaterId);
    return theater ? theater.name : t('admin.showtimes.unknownTheater');
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
      <CircularProgress />
    </Box>
  );
  
  if (error) return (
    <Box sx={{ p: 3 }}>
      <Alert severity="error">{t('common.error')}: {error}</Alert>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {t('admin.showtimes.title')}
        </Typography>
        <Button
          component={Link}
          to="/admin/showtimes/new"
          variant="contained"
          startIcon={<Add />}
        >
          {t('admin.showtimes.addNew')}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label={t('admin.showtimes.table.ariaLabel')}>
          <TableHead>
            <TableRow>
              <TableCell>{t('admin.showtimes.table.movie')}</TableCell>
              <TableCell>{t('admin.showtimes.table.date')}</TableCell>
              <TableCell>{t('admin.showtimes.table.time')}</TableCell>
              <TableCell>{t('admin.showtimes.table.theater')}</TableCell>
              <TableCell>{t('admin.showtimes.table.price')}</TableCell>
              <TableCell>{t('admin.showtimes.table.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {showtimes.map((showtime) => (
              <TableRow
                key={showtime.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Typography variant="subtitle1" fontWeight="medium">
                    {getMovieTitle(showtime.movieId)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(showtime.showDate).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {showtime.showTime}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {getTheaterName(showtime.theaterId)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    ${showtime.price}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    to={`/admin/showtimes/${showtime.id}`}
                    variant="outlined"
                    size="small"
                    startIcon={<Edit />}
                    sx={{ mr: 1 }}
                  >
                    {t('admin.showtimes.edit')}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<Delete />}
                    onClick={() => handleDeleteClick(showtime)}
                  >
                    {t('admin.showtimes.delete')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          {t('admin.showtimes.deleteConfirm')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            {showtimeToDelete && `${t('admin.showtimes.deleteMessage')} "${getMovieTitle(showtimeToDelete.movieId)}"?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            {t('admin.showtimes.cancel')}
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            {t('admin.showtimes.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminShowtimes;