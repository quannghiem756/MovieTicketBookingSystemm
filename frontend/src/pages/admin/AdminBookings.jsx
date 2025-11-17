// pages/admin/AdminBookings.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../context/I18nContext';
import api from '../../services/api';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  HourglassEmpty
} from '@mui/icons-material';
import { formatCurrency } from '../../utils/currency';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [bookingToAction, setBookingToAction] = useState(null);
  const [actionType, setActionType] = useState(''); // 'confirm' or 'cancel'
  const { t } = useTranslation();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings');
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        setError(t('admin.bookings.fetchError'));
        setLoading(false);
      }
    };

    fetchBookings();
  }, [t]);

  const handleActionClick = (booking, action) => {
    setBookingToAction(booking);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const handleActionConfirm = async () => {
    if (!bookingToAction) return;
    
    try {
      if (actionType === 'confirm') {
        await api.put(`/bookings/${bookingToAction.id}/confirm`);
        setBookings(bookings.map(booking => 
          booking.id === bookingToAction.id ? {...booking, status: 'confirmed'} : booking
        ));
      } else if (actionType === 'cancel') {
        await api.put(`/bookings/${bookingToAction.id}/cancel`);
        setBookings(bookings.map(booking => 
          booking.id === bookingToAction.id ? {...booking, status: 'cancelled'} : booking
        ));
      }
      setActionDialogOpen(false);
      setBookingToAction(null);
      setActionType('');
    } catch (err) {
      alert(t('admin.bookings.actionError', { action: actionType }));
      setActionDialogOpen(false);
      setBookingToAction(null);
      setActionType('');
    }
  };

  const handleActionCancel = () => {
    setActionDialogOpen(false);
    setBookingToAction(null);
    setActionType('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle />;
      case 'pending': return <HourglassEmpty />;
      case 'cancelled': return <Cancel />;
      default: return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return t('bookings.status.confirmed');
      case 'pending': return t('bookings.status.pending');
      case 'cancelled': return t('bookings.status.cancelled');
      default: return status;
    }
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
          {t('admin.bookings.title')}
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label={t('admin.bookings.table.ariaLabel')}>
          <TableHead>
            <TableRow>
              <TableCell>{t('admin.bookings.table.bookingId')}</TableCell>
              <TableCell>{t('admin.bookings.table.user')}</TableCell>
              <TableCell>{t('admin.bookings.table.showtime')}</TableCell>
              <TableCell>{t('admin.bookings.table.date')}</TableCell>
              <TableCell>{t('admin.bookings.table.totalPrice')}</TableCell>
              <TableCell>{t('admin.bookings.table.status')}</TableCell>
              <TableCell>{t('admin.bookings.table.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow
                key={booking.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Typography variant="subtitle1" fontWeight="medium">
                    #{booking.id.substring(0, 8)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {t('admin.bookings.user')} {booking.userId.substring(0, 8)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {t('admin.bookings.showtime')} {booking.showtimeId.substring(0, 8)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {formatCurrency(booking.totalPrice)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    icon={getStatusIcon(booking.status)}
                    label={getStatusText(booking.status)} 
                    color={getStatusColor(booking.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {booking.status === 'pending' && (
                    <>
                      <Button
                        variant="outlined"
                        color="success"
                        size="small"
                        startIcon={<CheckCircle />}
                        onClick={() => handleActionClick(booking, 'confirm')}
                        sx={{ mr: 1 }}
                      >
                        {t('admin.bookings.confirm')}
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<Cancel />}
                        onClick={() => handleActionClick(booking, 'cancel')}
                      >
                        {t('admin.bookings.cancel')}
                      </Button>
                    </>
                  )}
                  {booking.status === 'confirmed' && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<Cancel />}
                      onClick={() => handleActionClick(booking, 'cancel')}
                    >
                      {t('admin.bookings.cancel')}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Confirmation Dialog */}
      <Dialog
        open={actionDialogOpen}
        onClose={handleActionCancel}
        aria-labelledby="action-dialog-title"
        aria-describedby="action-dialog-description"
      >
        <DialogTitle id="action-dialog-title">
          {actionType === 'confirm' ? t('admin.bookings.confirmConfirm') : t('admin.bookings.cancelConfirm')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="action-dialog-description">
            {bookingToAction && `${t('admin.bookings.actionMessage')} ${actionType} ${t('admin.bookings.booking')} #${bookingToAction.id.substring(0, 8)}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleActionCancel} color="primary">
            {t('admin.bookings.dialogCancel')}
          </Button>
          <Button 
            onClick={handleActionConfirm} 
            color={actionType === 'confirm' ? 'success' : 'error'} 
            variant="contained"
            startIcon={actionType === 'confirm' ? <CheckCircle /> : <Cancel />}
          >
            {actionType === 'confirm' ? t('admin.bookings.confirm') : t('admin.bookings.cancel')} {t('admin.bookings.booking')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminBookings;