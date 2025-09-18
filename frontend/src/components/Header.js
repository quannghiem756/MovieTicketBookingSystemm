// components/Header.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/I18nContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Divider
} from '@mui/material';
import {
  AccountCircle,
  Home,
  Movie,
  CalendarToday,
  ConfirmationNumber,
  Dashboard,
  Logout,
  Person
} from '@mui/icons-material';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const menuOpen = Boolean(anchorEl);

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1f2937', boxShadow: 3 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ 
            textDecoration: 'none', 
            color: '#60a5fa', 
            fontWeight: 'bold',
            flexGrow: { xs: 1, sm: 0 },
            textAlign: { xs: 'center', sm: 'left' },
            mb: { xs: 1, sm: 0 }
          }}
        >
          MovieTicketBooking
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-end' }, flexGrow: 1 }}>
          <Button 
            component={Link} 
            to="/" 
            color="inherit"
            startIcon={<Home />}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            {t('header.home')}
          </Button>
          <Button 
            component={Link} 
            to="/now-showing" 
            color="inherit"
            startIcon={<Movie />}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            {t('header.nowShowing')}
          </Button>
          <Button 
            component={Link} 
            to="/coming-soon" 
            color="inherit"
            startIcon={<CalendarToday />}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            {t('header.comingSoon')}
          </Button>
          
          {/* Mobile menu icons */}
          <IconButton 
            component={Link} 
            to="/" 
            color="inherit"
            sx={{ display: { xs: 'flex', sm: 'none' } }}
          >
            <Home />
          </IconButton>
          <IconButton 
            component={Link} 
            to="/now-showing" 
            color="inherit"
            sx={{ display: { xs: 'flex', sm: 'none' } }}
          >
            <Movie />
          </IconButton>
          <IconButton 
            component={Link} 
            to="/coming-soon" 
            color="inherit"
            sx={{ display: { xs: 'flex', sm: 'none' } }}
          >
            <CalendarToday />
          </IconButton>
          
          {isAuthenticated && (
            <Button 
              component={Link} 
              to="/bookings" 
              color="inherit"
              startIcon={<ConfirmationNumber />}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              {t('header.myBookings')}
            </Button>
          )}
          
          {isAuthenticated && user?.role === 'admin' && (
            <Button 
              component={Link} 
              to="/admin" 
              color="inherit"
              startIcon={<Dashboard />}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              {t('header.admin')}
            </Button>
          )}
          
          {isAuthenticated ? (
            <>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
              >
                {user?.name ? (
                  <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={menuOpen}
                onClose={handleMenuClose}
                sx={{ mt: 1 }}
              >
                <MenuItem disabled sx={{ minWidth: 200 }}>
                  <Typography variant="subtitle2" noWrap>
                    {user?.name || 'User'}
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleProfileClick} sx={{ gap: 1 }}>
                  <Person fontSize="small" />
                  <Typography>View Profile</Typography>
                </MenuItem>
                <MenuItem component={Link} to="/bookings" sx={{ gap: 1 }}>
                  <ConfirmationNumber fontSize="small" />
                  <Typography>{t('header.myBookings')}</Typography>
                </MenuItem>
                {user?.role === 'admin' && (
                  <MenuItem component={Link} to="/admin" sx={{ gap: 1 }}>
                    <Dashboard fontSize="small" />
                    <Typography>{t('header.admin')}</Typography>
                  </MenuItem>
                )}
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ gap: 1 }}>
                  <Logout fontSize="small" />
                  <Typography>{t('header.logout')}</Typography>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button 
              component={Link} 
              to="/login" 
              color="inherit"
              variant="outlined"
              sx={{ 
                borderColor: 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.7)'
                }
              }}
            >
              {t('header.login')}
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;