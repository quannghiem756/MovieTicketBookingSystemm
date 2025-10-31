// pages/Register.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUser } from '../services/api';
import { useTranslation } from '../contexts/I18nContext';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Link as MuiLink,
  Paper,
  InputAdornment,
  IconButton,
  Grid,
  FormControl
} from '@mui/material';
import {
  Person,
  Email,
  Lock,
  Phone,
  CalendarToday,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t } = useTranslation();

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value) {
          error = t('validation.name.required');
        } else if (value.length < 2) {
          error = t('validation.name.minLength');
        } else if (value.length > 50) {
          error = t('validation.name.maxLength');
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = t('validation.name.invalid');
        }
        break;
      case 'email':
        if (!value) {
          error = t('validation.email.required');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = t('validation.email.invalid');
        }
        break;
      case 'password':
        if (!value) {
          error = t('validation.password.required');
        } else if (value.length < 8) {
          error = t('validation.password.minLength');
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value)) {
          error = t('validation.password.invalid');
        }
        break;
      case 'confirmPassword':
        if (!value) {
          error = t('validation.password.required');
        } else if (value !== formData.password) {
          error = t('validation.password.mismatch');
        }
        break;
      case 'phone':
        if (value && !/^\+?[\d\s\-\(\)]+$/.test(value)) {
          error = t('validation.phone.invalid');
        }
        break;
      case 'dateOfBirth':
        if (value) {
          const date = new Date(value);
          const today = new Date();
          const minAgeDate = new Date();
          minAgeDate.setFullYear(today.getFullYear() - 13);
          
          if (date > minAgeDate) {
            error = t('validation.dateOfBirth.age');
          }
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setServerError('');

    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setLoading(false);
      return;
    }

    // Create a copy of formData without confirmPassword for API submission
    const { confirmPassword, ...userData } = formData;

    try {
      const response = await createUser(userData);
      console.log('Registration successful', response.data);
      navigate('/login'); // Redirect to login page
    } catch (err) {
      if (err.response && err.response.data && err.response.data.details) {
        // Handle validation errors from backend
        const backendErrors = {};
        err.response.data.details.forEach(detail => {
          backendErrors[detail.field] = detail.message;
        });
        setErrors(backendErrors);
      } else if (err.response && err.response.data && err.response.data.error) {
        // Handle other backend errors
        if (err.response.data.error === 'Email already exists') {
          setServerError(t('validation.email.exists'));
        } else {
          setServerError(err.response.data.error);
        }
      } else {
        setServerError(t('register.error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          {t('register.title')}
        </Typography>
        {serverError && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{serverError}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                label={t('register.name')}
                autoFocus
                value={formData.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={!!errors.name}
                helperText={errors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label={t('register.email')}
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label={t('register.password')}
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label={t('register.confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <FormControl >
              <TextField
                fullWidth
                id="phone"
                label={t('register.phone')}
                name="phone"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={!!errors.phone}
                helperText={errors.phone}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="dateOfBirth"
                label={t('register.dateOfBirth')}
                name="dateOfBirth"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? t('register.loading') : t('register.submit')}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2">
              {t('register.hasAccount')}{' '}
              <MuiLink component={Link} to="/login" variant="body2">
                {t('register.login')}
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;