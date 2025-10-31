// pages/Profile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserById, updateUser } from '../services/api';
import { useTranslation } from '../contexts/I18nContext';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Avatar,
  Grid
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  CalendarToday
} from '@mui/icons-material';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        // For now, we'll use the user data from context
        // In a real app, you might want to fetch the latest data from the server
        setUserData({
          name: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split('T')[0] : ''
        });
        setLoading(false);
      } catch (err) {
        setError(t('common.error'));
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, navigate, user, t]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // In a real app, you would call an API to update the user data
      // const response = await updateUser(user.id, userData);
      // For now, we'll just simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(t('profile.updateSuccess'));
      setEditMode(false);
    } catch (err) {
      setError(t('profile.updateError'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.main' }}>
            {userData.name.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h4" component="h1">
            {t('profile.title')}
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('register.name')}
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                disabled={!editMode}
                InputProps={{
                  startAdornment: (
                    <Person sx={{ mr: 1, my: 0.5 }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('register.email')}
                name="email"
                type="email"
                value={userData.email}
                onChange={handleInputChange}
                disabled={!editMode}
                InputProps={{
                  startAdornment: (
                    <Email sx={{ mr: 1, my: 0.5 }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('register.phone')}
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
                disabled={!editMode}
                InputProps={{
                  startAdornment: (
                    <Phone sx={{ mr: 1, my: 0.5 }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('register.dateOfBirth')}
                name="dateOfBirth"
                type="date"
                value={userData.dateOfBirth}
                onChange={handleInputChange}
                disabled={!editMode}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <CalendarToday sx={{ mr: 1, my: 0.5 }} />
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            {editMode ? (
              <>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditMode(false);
                    // Reset form to original values
                    setUserData({
                      name: user?.name || '',
                      email: user?.email || '',
                      phone: user?.phone || '',
                      dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split('T')[0] : ''
                    });
                  }}
                >
                  {t('profile.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                  startIcon={saving ? <CircularProgress size={20} /> : null}
                >
                  {saving ? t('profile.saving') : t('profile.save')}
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                onClick={() => setEditMode(true)}
              >
                {t('profile.edit')}
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Profile;