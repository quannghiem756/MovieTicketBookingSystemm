import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../context/I18nContext';
import {
  getCoupons,
  deleteCoupon,
  getMovies
} from '../../services/api';
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
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Chip
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Refresh
} from '@mui/icons-material';
import CouponForm from './components/CouponForm';

const AdminCoupons = () => {
  const { t } = useTranslation();
  const [coupons, setCoupons] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const response = await getCoupons();
      setCoupons(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching coupons:', err);
      setError(t('admin.showtimes.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  const fetchMovies = async () => {
    try {
      // Fetch enough movies for the selection list
      const response = await getMovies(1, 100);
      setMovies(response.data.movies || []);
    } catch (err) {
      console.error('Error fetching movies:', err);
    }
  };

  useEffect(() => {
    fetchCoupons();
    fetchMovies();
  }, [t]);

  const handleDeleteClick = (coupon) => {
    setCouponToDelete(coupon);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!couponToDelete) return;
    try {
      await deleteCoupon(couponToDelete.id);
      setCoupons(coupons.filter(c => c.id !== couponToDelete.id));
      setDeleteDialogOpen(false);
      setCouponToDelete(null);
    } catch (err) {
      console.error('Error deleting coupon:', err);
      alert(t('admin.coupons.deleteError'));
    }
  };

  const handleEditClick = (coupon) => {
    setEditingCoupon(coupon);
    setFormOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingCoupon(null);
    setFormOpen(true);
  };

  const handleFormClose = (refresh = false) => {
    setFormOpen(false);
    setEditingCoupon(null);
    if (refresh) {
      fetchCoupons();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading && coupons.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {t('admin.coupons.title')}
        </Typography>
        <Box>
          <IconButton onClick={fetchCoupons} sx={{ mr: 1 }}>
            <Refresh />
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleAddNewClick}
          >
            {t('admin.coupons.addNew')}
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>{t('admin.coupons.table.code')}</TableCell>
              <TableCell>{t('admin.coupons.table.type')}</TableCell>
              <TableCell>{t('admin.coupons.table.value')}</TableCell>
              <TableCell>{t('admin.coupons.table.validity')}</TableCell>
              <TableCell>{t('admin.coupons.table.usage')}</TableCell>
              <TableCell align="right">{t('admin.coupons.table.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No coupons found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {coupon.code}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={coupon.type === 'PERCENTAGE' ? t('admin.coupons.percentage') : t('admin.coupons.fixed')} 
                      size="small"
                      color={coupon.type === 'PERCENTAGE' ? 'secondary' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    {coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : `${coupon.value.toLocaleString()} VND`}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {coupon.currentUsage} / {coupon.usageLimit || '∞'}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={t('admin.coupons.edit')}>
                      <IconButton onClick={() => handleEditClick(coupon)} color="primary">
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('admin.coupons.delete')}>
                      <IconButton onClick={() => handleDeleteClick(coupon)} color="error">
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>{t('admin.coupons.deleteConfirm')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('admin.coupons.deleteMessage')} "{couponToDelete?.code}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>{t('admin.coupons.cancel')}</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            {t('admin.coupons.delete')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Coupon Form Modal */}
      {formOpen && (
        <CouponForm
          open={formOpen}
          onClose={handleFormClose}
          coupon={editingCoupon}
          movies={movies}
        />
      )}
    </Box>
  );
};

export default AdminCoupons;
