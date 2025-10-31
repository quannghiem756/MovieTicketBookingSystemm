import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/I18nContext';
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
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Avatar,
  Divider
} from '@mui/material';
import { 
  Email, 
  Lock, 
  Visibility, 
  VisibilityOff, 
  Movie,
  ArrowForward,
  Login
} from '@mui/icons-material';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
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

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        // Check if user is admin
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/'); // Redirect to home page
        }
      } else {
        setServerError(result.error);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.details) {
        // Handle validation errors from backend
        const backendErrors = {};
        err.response.data.details.forEach(detail => {
          backendErrors[detail.field] = detail.message;
        });
        setErrors(backendErrors);
      } else if (err.response && err.response.data && err.response.data.error) {
        setServerError(err.response.data.error);
      } else {
        setServerError(t('login.error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ py: 4 }}>
      <Card 
        sx={{ 
          borderRadius: 4,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(30,30,30,0.7)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative background element */}
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            width: 150, 
            height: 150,
            bgcolor: 'primary.main',
            opacity: 0.1,
            borderRadius: '0 0 0 100%',
          }}
        />
        
        <CardContent sx={{ p: { xs: 3, sm: 5 }, position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
              <Movie sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography 
              variant="h4" 
              component="h1"
              sx={{ 
                fontWeight: 800, 
                mb: 2,
                background: 'linear-gradient(90deg, #ffffff 0%, #b3b3b3 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('login.title')}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {t('login.subtitle')}
            </Typography>
          </Box>
          
          {serverError && <Alert severity="error" sx={{ mb: 3 }}>{serverError}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  variant='outlined'
                  fullWidth
                  id="email"
                  label={t('login.email')}
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                    sx: { 
                      borderRadius: 3,
                      '& .MuiInputBase-input': {
                        py: 1.2
                      }
                    }
                  }}
                  InputLabelProps={{
                    sx: {
                      fontWeight: 600
                    }
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant='outlined'
                  fullWidth
                  name="password"
                  label={t('login.password')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                          sx={{ color: 'text.secondary' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { 
                      borderRadius: 3,
                      '& .MuiInputBase-input': {
                        py: 1.5
                      }
                    }
                  }}
                  InputLabelProps={{
                    sx: {
                      fontWeight: 600
                    }
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(255,255,255,0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    }
                  }}
                />
              </Grid>
            </Grid>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              startIcon={loading ? null : <Login />}
              sx={{ 
                mt: 4, 
                mb: 2,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 700,
                fontSize: '1.1rem',
                textTransform: 'none'
              }}
              disabled={loading}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 20, height: 20, border: '2px solid', borderColor: 'white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  <Box component="span" sx={{ ml: 1 }}>{t('login.loading')}</Box>
                </Box>
              ) : (
                t('login.submit')
              )}
            </Button>
            
            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                {t('login.noAccount')}
              </Typography>
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                endIcon={<ArrowForward />}
                sx={{ 
                  borderRadius: 3, 
                  px: 3, 
                  py: 1,
                  textTransform: 'none',
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                {t('login.register')}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginPage;