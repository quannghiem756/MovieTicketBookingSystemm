import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/I18nContext';
import { createSupportTicket } from '../services/api';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 500 },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const ContactUsModal = ({ open, onClose }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'General Question',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && open) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createSupportTicket(formData);
      setSuccess(true);
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        category: 'General Question',
        message: ''
      });
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || t('contactUs.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={style}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" component="h2">
              {t('contactUs.title')}
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{t('contactUs.success')}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t('contactUs.name')}
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              margin="normal"
              disabled={loading || success}
            />
            <TextField
              fullWidth
              label={t('contactUs.email')}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              margin="normal"
              disabled={loading || success}
            />
            <TextField
              fullWidth
              label={t('contactUs.phone')}
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              margin="normal"
              disabled={loading || success}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="category-label">{t('contactUs.category')}</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={formData.category}
                label={t('contactUs.category')}
                onChange={handleChange}
                disabled={loading || success}
              >
                <MenuItem value="Payment Issue">{t('contactUs.category.payment')}</MenuItem>
                <MenuItem value="Ticket/QR Problem">{t('contactUs.category.ticket')}</MenuItem>
                <MenuItem value="Account">{t('contactUs.category.account')}</MenuItem>
                <MenuItem value="General Question">{t('contactUs.category.general')}</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label={t('contactUs.message')}
              name="message"
              multiline
              rows={4}
              value={formData.message}
              onChange={handleChange}
              required
              margin="normal"
              disabled={loading || success}
            />
            <Box mt={3} display="flex" justifyContent="flex-end">
              <Button onClick={onClose} sx={{ mr: 1 }} disabled={loading}>
                {t('contactUs.cancel')}
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                disabled={loading || success}
              >
                {loading ? t('contactUs.submitting') : t('contactUs.submit')}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
      <Snackbar 
        open={success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {t('contactUs.submitted')}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ContactUsModal;
