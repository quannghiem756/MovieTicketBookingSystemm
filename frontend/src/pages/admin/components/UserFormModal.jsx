import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../../context/I18nContext';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material';

const UserFormModal = ({ open, onClose, onSubmit, initialData }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        role: initialData.role || 'user',
        password: '' // Don't populate password
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'user'
      });
    }
    setErrors({});
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t('common.required');
    if (!formData.email.trim()) newErrors.email = t('common.required');
    // Password required only for create
    if (!initialData && !formData.password) newErrors.password = t('common.required');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialData ? t('admin.users.modal.editTitle') : t('admin.users.modal.createTitle')}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="name"
              label={t('admin.users.form.name')}
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              required
            />
            <TextField
              name="email"
              label={t('admin.users.form.email')}
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
              required
            />
            <TextField
              name="phone"
              label={t('admin.users.form.phone')}
              value={formData.phone}
              onChange={handleChange}
              fullWidth
            />
            
            <FormControl fullWidth>
              <InputLabel id="role-select-label">{t('admin.users.form.role')}</InputLabel>
              <Select
                labelId="role-select-label"
                name="role"
                value={formData.role}
                label={t('admin.users.form.role')}
                onChange={handleChange}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="staff">Staff</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>

            <TextField
              name="password"
              label={t('admin.users.form.password')}
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={initialData ? t('admin.users.form.passwordHelpEdit') : errors.password}
              fullWidth
              required={!initialData}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? t('admin.users.save') : t('admin.users.create')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserFormModal;
