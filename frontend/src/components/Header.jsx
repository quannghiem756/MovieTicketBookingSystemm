import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Menu, 
  MenuItem,
  IconButton,
  Avatar,
  Container,
  Badge,
  useScrollTrigger,
  Slide,
  Fab,
  Zoom
} from '@mui/material';
import { 
  AccountCircle, 
  Home, 
  Movie, 
  CalendarToday, 
  ConfirmationNumber,
  Dashboard,
  Logout,
  Menu as MenuIcon,
  ArrowUpward
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/I18nContext';

// Component to hide header on scroll down
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    target: window,
    disableHysteresis: true,
    threshold: 100,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  // Scroll to top functionality
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <HideOnScroll>
        <AppBar 
          position="sticky" 
          elevation={0}
          sx={{ 
            background: 'rgba(15, 15, 15, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            mb: 4
          }}
        >
          <Container maxWidth="lg">
            <Toolbar disableGutters>
              <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                <Typography 
                  variant="h6" 
                  component={Link} 
                  to="/" 
                  sx={{ 
                    textDecoration: 'none', 
                    color: 'inherit',
                    fontWeight: 700,
                    fontSize: '1.5rem',
                    letterSpacing: '0.5px'
                  }}
                >
                  Cine<span style={{ color: '#d32f2f' }}>Book</span>
                </Typography>
              </Box>
              
              <Box 
                sx={{ 
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/" 
                  startIcon={<Home />}
                  sx={{ 
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    borderRadius: 3,
                    px: 2,
                    py: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(211, 47, 47, 0.1)',
                    }
                  }}
                >
                  {t('header.home')}
                </Button>
                
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/now-showing" 
                  startIcon={<Movie />}
                  sx={{ 
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    borderRadius: 3,
                    px: 2,
                    py: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(211, 47, 47, 0.1)',
                    }
                  }}
                >
                  {t('header.nowShowing')}
                </Button>
                
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/coming-soon" 
                  startIcon={<CalendarToday />}
                  sx={{ 
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    borderRadius: 3,
                    px: 2,
                    py: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(211, 47, 47, 0.1)',
                    }
                  }}
                >
                  {t('header.comingSoon')}
                </Button>
                
                {isAuthenticated && user?.role === 'admin' && (
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/admin" 
                    startIcon={<Dashboard />}
                    sx={{ 
                      textTransform: 'none',
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      borderRadius: 3,
                      px: 2,
                      py: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(211, 47, 47, 0.1)',
                      }
                    }}
                  >
                    {t('header.admin')}
                  </Button>
                )}
                
                {isAuthenticated ? (
                  <>
                    <Button 
                      color="inherit" 
                      component={Link} 
                      to="/bookings" 
                      startIcon={
                        <Badge badgeContent={user?.unreadBookings || 0} color="error">
                          <ConfirmationNumber />
                        </Badge>
                      }
                      sx={{ 
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '0.9rem',
                        borderRadius: 3,
                        px: 2,
                        py: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(211, 47, 47, 0.1)',
                        }
                      }}
                    >
                      {t('header.myBookings')}
                    </Button>
                    
                    <IconButton 
                      size="large" 
                      edge="end" 
                      color="inherit" 
                      onClick={handleMenuOpen}
                      sx={{ 
                        ml: 1,
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        }
                      }}
                    >
                      <Avatar 
                        sx={{ 
                          width: 36, 
                          height: 36,
                          fontSize: '1rem',
                          bgcolor: 'primary.main',
                          border: '2px solid rgba(255, 255, 255, 0.2)'
                        }}
                      >
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </Avatar>
                    </IconButton>
                    
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                      PaperProps={{
                        sx: {
                          mt: 1,
                          borderRadius: 2,
                          backgroundImage: 'none',
                          background: 'rgba(30, 30, 30, 0.95)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }
                      }}
                    >
                      <MenuItem 
                        component={Link} 
                        to="/profile" 
                        onClick={handleMenuClose}
                        sx={{
                          color: 'text.primary',
                          '&:hover': {
                            backgroundColor: 'rgba(211, 47, 47, 0.1)',
                          }
                        }}
                      >
                        <AccountCircle sx={{ mr: 1 }} />
                        {t('header.profile')}
                      </MenuItem>
                      <MenuItem 
                        onClick={handleLogout}
                        sx={{
                          color: 'text.primary',
                          '&:hover': {
                            backgroundColor: 'rgba(211, 47, 47, 0.1)',
                          }
                        }}
                      >
                        <Logout sx={{ mr: 1 }} />
                        {t('header.logout')}
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Button 
                    variant="contained"
                    color="primary"
                    component={Link} 
                    to="/login" 
                    startIcon={<AccountCircle />}
                    sx={{ 
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      borderRadius: 3,
                      px: 2,
                      py: 1,
                      ml: 1
                    }}
                  >
                    {t('header.login')}
                  </Button>
                )}
              </Box>
              
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                sx={{ display: { md: 'none' }, ml: 1 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>
      
      {/* Floating scroll to top button */}
      <Zoom in={useScrollTrigger({
        target: window,
        disableHysteresis: true,
        threshold: 400,
      })}>
        <Fab
          color="primary"
          size="small"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            boxShadow: 3,
          }}
        >
          <ArrowUpward />
        </Fab>
      </Zoom>
    </>
  );
};

export default Header;