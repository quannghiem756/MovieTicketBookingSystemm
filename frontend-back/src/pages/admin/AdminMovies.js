import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useTranslation } from '../../contexts/I18nContext';
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
  Pagination,
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

const AdminMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(10); // You can adjust this value
  const [totalMovies, setTotalMovies] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/movies?page=${currentPage}&limit=${moviesPerPage}`);
        setMovies(response.data.movies);
        setTotalMovies(response.data.totalMovies);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
        setError(t('common.error'));
        setLoading(false);
      }
    };

    fetchMovies();
  }, [currentPage, moviesPerPage, t]);

  const handleDeleteClick = (movie) => {
    setMovieToDelete(movie);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!movieToDelete) return;
    
    try {
      await api.delete(`/movies/${movieToDelete.id}`);
      // Re-fetch movies for the current page to ensure correct pagination
      const response = await api.get(`/movies?page=${currentPage}&limit=${moviesPerPage}`);
      setMovies(response.data.movies);
      setTotalMovies(response.data.totalMovies);
      setTotalPages(response.data.totalPages);
      setDeleteDialogOpen(false);
      setMovieToDelete(null);
    } catch (err) {
      alert(t('admin.movies.deleteError'));
      setDeleteDialogOpen(false);
      setMovieToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setMovieToDelete(null);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
      <CircularProgress />
    </Box>
  );
  
  if (error) return (
    <Box sx={{ p: 3 }}>
      <Alert severity="error">{t('common.error')}</Alert>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {t('admin.movies.title')}
        </Typography>
        <Button
          component={Link}
          to="/admin/movies/new"
          variant="contained"
          startIcon={<Add />}
        >
          {t('admin.movies.addNew')}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="movies table">
          <TableHead>
            <TableRow>
              <TableCell>{t('admin.movies.table.title')}</TableCell>
              <TableCell>{t('admin.movies.table.director')}</TableCell>
              <TableCell>{t('admin.movies.table.releaseDate')}</TableCell>
              <TableCell>{t('admin.movies.table.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movies.map((movie) => (
              <TableRow
                key={movie.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Typography variant="subtitle1" fontWeight="medium">
                    {movie.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {movie.director}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(movie.releaseDate).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    to={`/admin/movies/${movie.id}`}
                    variant="outlined"
                    size="small"
                    startIcon={<Edit />}
                    sx={{ mr: 1 }}
                  >
                    {t('admin.movies.edit')}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<Delete />}
                    onClick={() => handleDeleteClick(movie)}
                  >
                    {t('admin.movies.delete')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          {t('admin.movies.deleteConfirm')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            {movieToDelete && `Are you sure you want to delete "${movieToDelete.title}"?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminMovies;