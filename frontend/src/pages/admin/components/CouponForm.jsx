import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '../../../context/I18nContext';
import {
  createCoupon,
  updateCoupon
} from '../../../services/api';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Box,
  Typography,
  Alert,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const CouponForm = ({ open, onClose, coupon, movies }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    code: '',
    type: 'PERCENTAGE',
    value: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usageLimit: '',
    userUsageLimit: 1,
    minOrderValue: 0,
    applicableMovieIds: []
  });

  useEffect(() => {
    if (coupon) {
      setFormData({
        code: coupon.code || '',
        type: coupon.type || 'PERCENTAGE',
        value: coupon.value || 0,
        startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().split('T')[0] : '',
        endDate: coupon.endDate ? new Date(coupon.endDate).toISOString().split('T')[0] : '',
        usageLimit: coupon.usageLimit !== null ? coupon.usageLimit : '',
        userUsageLimit: coupon.userUsageLimit !== null ? coupon.userUsageLimit : '',
        minOrderValue: coupon.minOrderValue || 0,
        applicableMovieIds: coupon.applicableMovieIds || []
      });
    } else {
      setFormData({
        code: '',
        type: 'PERCENTAGE',
        value: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        usageLimit: '',
        userUsageLimit: 1,
        minOrderValue: 0,
        applicableMovieIds: []
      });
    }
  }, [coupon, open]);

  const filteredMovies = useMemo(() => {
    if (!searchTerm) return movies;
    return movies.filter(movie =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [movies, searchTerm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMovieChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData(prev => ({
      ...prev,
      applicableMovieIds: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const dataToSend = {
      ...formData,
      value: Number(formData.value),
      usageLimit: formData.usageLimit === '' ? null : Number(formData.usageLimit),
      userUsageLimit: formData.userUsageLimit === '' ? null : Number(formData.userUsageLimit),
      minOrderValue: Number(formData.minOrderValue),
    };

    try {
      if (coupon) {
        await updateCoupon(coupon.id, dataToSend);
      } else {
        await createCoupon(dataToSend);
      }
      onClose(true);
    } catch (err) {
      console.error('Error saving coupon:', err);
      setError(t('admin.couponForm.error') + ' ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        {coupon ? t('admin.couponForm.editTitle') : t('admin.couponForm.addTitle')}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box
            display="grid"
            gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }}
            gap={3}
          >
            <Box>
              <TextField
                fullWidth
                label={t('admin.couponForm.code')}
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                inputProps={{ style: { textTransform: 'uppercase' } }}
              />
            </Box>
            <Box>
              <FormControl fullWidth>
                <InputLabel>{t('admin.couponForm.type')}</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label={t('admin.couponForm.type')}
                >
                  <MenuItem value="PERCENTAGE">{t('admin.coupons.percentage')}</MenuItem>
                  <MenuItem value="FIXED_AMOUNT">{t('admin.coupons.fixed')}</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <TextField
                fullWidth
                label={t('admin.couponForm.value')}
                name="value"
                type="number"
                value={formData.value}
                onChange={handleChange}
                required
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label={t('admin.couponForm.minOrderValue')}
                name="minOrderValue"
                type="number"
                value={formData.minOrderValue}
                onChange={handleChange}
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label={t('admin.couponForm.startDate')}
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label={t('admin.couponForm.endDate')}
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label={t('admin.couponForm.usageLimit')}
                name="usageLimit"
                type="number"
                value={formData.usageLimit}
                onChange={handleChange}
                placeholder="Unlimited"
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Box>
            <Box>
              <TextField
                fullWidth
                label={t('admin.couponForm.userUsageLimit')}
                name="userUsageLimit"
                type="number"
                value={formData.userUsageLimit}
                onChange={handleChange}
                placeholder="Unlimited"
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Box>
            <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
              <FormControl fullWidth>
                <InputLabel id="applicable-movies-label">{t('admin.couponForm.applicableMovies')}</InputLabel>
                <Select
                  labelId="applicable-movies-label"
                  multiple
                  value={formData.applicableMovieIds}
                  onChange={handleMovieChange}
                  input={<OutlinedInput label={t('admin.couponForm.applicableMovies')} />}
                  renderValue={(selected) => {
                    if (selected.length === 0) return t('admin.couponForm.allMovies');
                    return selected.map(id => movies.find(m => m.id === id)?.title).filter(Boolean).join(', ');
                  }}
                  MenuProps={{
                    autoFocus: false,
                    PaperProps: {
                      style: {
                        maxHeight: 400,
                      },
                    },
                  }}
                >
                  <Box sx={{ p: 1, position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder={t('admin.movies.search')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key !== 'Escape') {
                          e.stopPropagation();
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  {filteredMovies.map((movie) => (
                    <MenuItem key={movie.id} value={movie.id}>
                      <Checkbox checked={formData.applicableMovieIds.indexOf(movie.id) > -1} />
                      <ListItemText primary={movie.title} />
                    </MenuItem>
                  ))}
                  {filteredMovies.length === 0 && (
                    <MenuItem disabled>
                      <ListItemText primary={t('admin.movies.noMovies')} />
                    </MenuItem>
                  )}
                </Select>
                <Typography variant="caption" sx={{ mt: 1, ml: 1 }}>
                  Leave empty to apply to all movies.
                </Typography>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(false)}>{t('admin.couponForm.cancel')}</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? t('admin.couponForm.saving') : t('admin.couponForm.save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CouponForm;
