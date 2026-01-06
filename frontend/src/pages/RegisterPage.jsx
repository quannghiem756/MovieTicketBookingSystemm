import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUser, verifyRegistration } from '../services/api';
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
  Person,
  Email,
  Lock,
  Phone,
  CalendarToday,
  Visibility,
  VisibilityOff,
  Movie,
  ArrowForward,
  HowToReg
} from '@mui/icons-material';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('register'); // 'register' or 'otp'
  const [otp, setOtp] = useState('');
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

    if (step === 'register') {
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
          // This now triggers OTP email
          await createUser(userData);
          setStep('otp');
        } catch (err) {
          if (err.response && err.response.data && err.response.data.details) {
            const backendErrors = {};
            err.response.data.details.forEach(detail => {
              backendErrors[detail.field] = detail.message;
            });
            setErrors(backendErrors);
          } else if (err.response && err.response.data && err.response.data.error) {
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
    } else {
        // OTP Step
        if (!otp || otp.length !== 6) {
            setServerError('Please enter a valid 6-digit OTP.');
            setLoading(false);
            return;
        }

        try {
            await verifyRegistration(formData.email, otp);
            navigate('/login', { state: { message: 'Registration successful! Please login.' } });
        } catch (err) {
            setServerError(err.response?.data?.error || 'Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
              <HowToReg sx={{ fontSize: 40 }} />
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
              {step === 'otp' ? 'Verification' : t('register.title')}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {step === 'otp' ? 'Enter the code sent to your email' : t('register.subtitle')}
            </Typography>
          </Box>
          
          {serverError && <Alert severity="error" sx={{ mb: 3 }}>{serverError}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            {step === 'otp' ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="body1" color="textSecondary" align="center" sx={{ mb: 2 }}>
                  We have sent a 6-digit verification code to <b>{formData.email}</b>.<br/>
                  Please enter it below to verify your account.
                </Typography>
                <TextField
                  required
                  fullWidth
                  id="otp"
                  label="Verification Code"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  autoFocus
                  InputProps={{
                    sx: { borderRadius: 3 }
                  }}
                  inputProps={{ 
                    maxLength: 6,
                    style: { textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.5rem', fontWeight: 'bold' } 
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                    }
                  }}
                />
              </Box>
            ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                      <Person sx={{ color: 'primary.main' }} />
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
                      <Email sx={{ color: 'primary.main' }} />
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
                      <Lock sx={{ color: 'primary.main' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                        sx={{ color: 'text.secondary' }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
              <Box sx={{ display: 'flex', gap: 3, width: '100%' }}>
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
                        <Phone sx={{ color: 'primary.main' }} />
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
                        <CalendarToday sx={{ color: 'primary.main' }} />
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
              </Box>
            </Box>
            )}
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              startIcon={loading ? null : <HowToReg />}
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
                  <Box component="span" sx={{ ml: 1 }}>{step === 'otp' ? 'Verifying...' : t('register.loading')}</Box>
                </Box>
              ) : (
                step === 'otp' ? 'Verify OTP' : t('register.submit')
              )}
            </Button>
            
            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                {t('register.hasAccount')}
              </Typography>
              <Button
                component={Link}
                to="/login"
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
                {t('register.login')}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RegisterPage;