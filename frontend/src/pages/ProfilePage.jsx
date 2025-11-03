// pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserById, updateUser } from '../services/api';
import { useTranslation } from '../context/I18nContext';
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
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  CalendarToday,
  Edit,
  Save,
  Cancel,
  VerifiedUser,
  AccountBalanceWallet
} from '@mui/icons-material';

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    role: '',
    joinDate: ''
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
          dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
          role: user?.role || 'user',
          joinDate: user?.joinDate || new Date().toISOString().split('T')[0]
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
      const response = await updateUser(user.id, userData);
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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Profile Header */}
        <Box sx={{ width: '100%' }}>
          <Paper 
            sx={{ 
              p: 4, 
              borderRadius: 4,
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
                width: 200, 
                height: 200,
                bgcolor: 'primary.main',
                opacity: 0.1,
                borderRadius: '0 0 0 100%',
              }}
            />
            
            <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: { xs: 'flex-start', md: 'center' }, gap: 3, flexWrap: 'wrap' }}>
              <Avatar sx={{ width: 100, height: 100, fontSize: '2rem', bgcolor: 'primary.main' }}>
                {userData.name.charAt(0).toUpperCase()}
              </Avatar>
              
              <Box sx={{ flex: 1, minWidth: 250 }}>
                <Typography 
                  variant="h3" 
                  component="h1"
                  sx={{ 
                    fontWeight: 800, 
                    mb: 1,
                    background: 'linear-gradient(90deg, #ffffff 0%, #b3b3b3 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {userData.name}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Chip
                    icon={<VerifiedUser />}
                    label={userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                    color={userData.role === 'admin' ? 'error' : 'primary'}
                    variant="outlined"
                    sx={{ borderRadius: 3 }}
                  />
                  <Chip
                    icon={<CalendarToday />}
                    label={`${t('profile.memberSince')} ${new Date(userData.joinDate).getFullYear()}`}
                    variant="outlined"
                    sx={{ borderRadius: 3, ml: 1 }}
                  />
                </Box>
                
                <Typography variant="body1" color="textSecondary">
                  {t('profile.profileDescription')}
                </Typography>
              </Box>
              
              <Box>
                {editMode ? (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      onClick={handleSubmit}
                      disabled={saving}
                      sx={{ 
                        bgcolor: 'success.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'success.dark' },
                        p: 1.5
                      }}
                    >
                      {saving ? <CircularProgress size={24} color="inherit" /> : <Save />}
                    </IconButton>
                    <IconButton 
                      onClick={() => {
                        setEditMode(false);
                        // Reset form to original values
                        setUserData({
                          name: user?.name || '',
                          email: user?.email || '',
                          phone: user?.phone || '',
                          dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
                          role: user?.role || 'user',
                          joinDate: user?.joinDate || new Date().toISOString().split('T')[0]
                        });
                      }}
                      sx={{ 
                        bgcolor: 'error.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'error.dark' },
                        p: 1.5
                      }}
                    >
                      <Cancel />
                    </IconButton>
                  </Box>
                ) : (
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() => setEditMode(true)}
                    sx={{ 
                      borderRadius: 3, 
                      px: 3, 
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: 'none'
                    }}
                  >
                    {t('profile.editProfile')}
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </Box>
        
        {/* Profile Form and User Stats - Responsive Layout */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 4
        }}>
          {/* Profile Form */}
          <Box sx={{ width: '100%' }}>
            <Card 
              sx={{ 
                borderRadius: 4,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(30,30,30,0.7)',
                backdropFilter: 'blur(10px)',
                overflow: 'hidden'
              }}
            >
              <CardContent sx={{ p: 4 }}>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
                
                <form onSubmit={handleSubmit}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                      fullWidth
                      label={t('register.name')}
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      InputProps={{
                        startAdornment: (
                          <Person sx={{ mr: 1, my: 0.5, color: 'primary.main' }} />
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
                      label={t('register.email')}
                      name="email"
                      type="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      InputProps={{
                        startAdornment: (
                          <Email sx={{ mr: 1, my: 0.5, color: 'primary.main' }} />
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
                    
                    <Box sx={{ 
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                      gap: 3
                    }}>
                      <TextField
                        fullWidth
                        label={t('register.phone')}
                        name="phone"
                        value={userData.phone}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        InputProps={{
                          startAdornment: (
                            <Phone sx={{ mr: 1, my: 0.5, color: 'primary.main' }} />
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
                            <CalendarToday sx={{ mr: 1, my: 0.5, color: 'primary.main' }} />
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
                </form>
              </CardContent>
            </Card>
          </Box>
          
          {/* User Stats */}
          <Box sx={{ width: '100%', height: '100%' }}>
            <Card 
              sx={{ 
                borderRadius: 4,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(30,30,30,0.7)',
                backdropFilter: 'blur(10px)',
                height: '100%'
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center' }}>
                  <AccountBalanceWallet sx={{ mr: 1, color: 'primary.main' }} />
                  {t('profile.accountOverview')}
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    {t('profile.memberSince')}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {new Date(userData.joinDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    {t('profile.role')}
                  </Typography>
                  <Chip
                    label={userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                    color={userData.role === 'admin' ? 'error' : 'primary'}
                    sx={{ borderRadius: 3, fontWeight: 600 }}
                  />
                </Box>
                
                <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
                
                <Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    {t('profile.profileStatus')}
                  </Typography>
                  <Chip
                    icon={<VerifiedUser />}
                    label={t('profile.verified')}
                    color="success"
                    variant="outlined"
                    sx={{ borderRadius: 3, fontWeight: 600 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ProfilePage;