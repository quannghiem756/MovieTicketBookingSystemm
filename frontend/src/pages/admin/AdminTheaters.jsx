// pages/admin/AdminTheaters.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  DialogContentText,
  IconButton
} from '@mui/material';
import {
  Add,
  Edit,
  Delete
} from '@mui/icons-material';
import { getTheaters, deleteTheater } from '../../services/api';

const AdminTheaters = () => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [theaterToDelete, setTheaterToDelete] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const response = await getTheaters();
        setTheaters(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(t('common.error'));
        setLoading(false);
      }
    };

    fetchTheaters();
  }, [t]);

  const handleDeleteClick = (theater) => {
    setTheaterToDelete(theater);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!theaterToDelete) return;
    
    try {
      await deleteTheater(theaterToDelete.id);
      setTheaters(theaters.filter(theater => theater.id !== theaterToDelete.id));
      setDeleteDialogOpen(false);
      setTheaterToDelete(null);
    } catch (err) {
      alert(t('admin.theaters.deleteError'));
      setDeleteDialogOpen(false);
      setTheaterToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTheaterToDelete(null);
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
          {t('admin.theaters.title')}
        </Typography>
        <Button
          component={Link}
          to="/admin/theaters/new"
          variant="contained"
          startIcon={<Add />}
        >
          {t('admin.theaters.addNew')}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label={t('admin.theaters.table.ariaLabel')}>
          <TableHead>
            <TableRow>
              <TableCell>{t('admin.theaters.table.name')}</TableCell>
              <TableCell>{t('admin.theaters.table.location')}</TableCell>
              <TableCell>{t('admin.theaters.table.totalSeats')}</TableCell>
              <TableCell>{t('admin.theaters.table.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {theaters.map((theater) => (
              <TableRow
                key={theater.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Typography variant="subtitle1" fontWeight="medium">
                    {theater.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {theater.location}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {theater.totalSeats}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    to={`/admin/theaters/${theater.id}`}
                    variant="outlined"
                    size="small"
                    startIcon={<Edit />}
                    sx={{ mr: 1 }}
                  >
                    {t('admin.theaters.edit')}
                  </Button>
                  <IconButton 
                    onClick={() => handleDeleteClick(theater)}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          {t('admin.theaters.deleteConfirm')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            {theaterToDelete && `${t('admin.theaters.deleteMessage')} "${theaterToDelete.name}"?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            {t('admin.theaters.cancel')}
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            {t('admin.theaters.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminTheaters;