import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { forgotPassword, resetPassword } from '../services/api';
import { useTranslation } from '../context/I18nContext';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  Avatar
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  VpnKey,
  ArrowBack
} from '@mui/icons-material';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [step, setStep] = useState('email'); // 'email' or 'reset'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setServerError('');
    setErrors({});

    if (step === 'email') {
      if (!email) {
        setErrors({ email: t('validation.email.required') });
        setLoading(false);
        return;
      }

      try {
        await forgotPassword(email);
        setStep('reset');
      } catch (err) {
        setServerError(err.response?.data?.error || t('login.error'));
      } finally {
        setLoading(false);
      }
    } else {
      // Reset Step
      if (!otp || otp.length !== 6) {
        setErrors({ otp: t('auth.otp.invalid') });
        setLoading(false);
        return;
      }
      if (!password) {
        setErrors({ password: t('validation.password.required') });
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setErrors({ confirmPassword: t('validation.password.mismatch') });
        setLoading(false);
        return;
      }

      try {
        await resetPassword(email, otp, password);
        navigate('/login', { state: { message: t('auth.resetPassword.success') } });
      } catch (err) {
        setServerError(err.response?.data?.error || t('auth.resetPassword.failed'));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ py: 4 }}>
      <Card 
        sx={{ 
          borderRadius: 4,
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(30,30,30,0.7)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
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
              <VpnKey sx={{ fontSize: 40 }} />
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
              {step === 'email' ? t('auth.forgotPassword.title') : t('auth.resetPassword.title')}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {step === 'email' 
                ? t('auth.forgotPassword.subtitle')
                : t('auth.resetPassword.subtitle')}
            </Typography>
          </Box>
          
          {serverError && <Alert severity="error" sx={{ mb: 3 }}>{serverError}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {step === 'email' ? (
                <TextField
                  fullWidth
                  id="email"
                  label={t('login.email')}
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 3 }
                  }}
                />
              ) : (
                <>
                  <TextField
                    fullWidth
                    id="otp"
                    label={t('auth.otp.label')}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    error={!!errors.otp}
                    helperText={errors.otp}
                    inputProps={{ 
                      maxLength: 6,
                      style: { textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.2rem', fontWeight: 'bold' } 
                    }}
                    InputProps={{ sx: { borderRadius: 3 } }}
                  />
                  <TextField
                    fullWidth
                    name="password"
                    label={t('auth.resetPassword.newPassword')}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 3 }
                    }}
                  />
                  <TextField
                    fullWidth
                    name="confirmPassword"
                    label={t('auth.resetPassword.confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 3 }
                    }}
                  />
                </>
              )}
            </Box>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
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
              {loading ? t('login.loading') : (step === 'email' ? t('auth.forgotPassword.send') : t('auth.resetPassword.submit'))}
            </Button>
            
            <Button
              component={Link}
              to="/login"
              startIcon={<ArrowBack />}
              sx={{ 
                width: '100%',
                borderRadius: 3, 
                textTransform: 'none',
                color: 'text.secondary'
              }}
            >
              {t('auth.forgotPassword.backToLogin')}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ResetPasswordPage;