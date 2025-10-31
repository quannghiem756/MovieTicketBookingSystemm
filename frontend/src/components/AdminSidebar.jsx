// components/AdminSidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import AdminLogout from './AdminLogout';
import { useTranslation } from '../context/I18nContext';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider
} from '@mui/material';
import {
  Dashboard,
  LocalMovies,
  Schedule,
  ConfirmationNumber,
  People
} from '@mui/icons-material';

const drawerWidth = 240;

const AdminSidebar = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    {
      text: t('admin.sidebar.dashboard'),
      icon: <Dashboard />,
      path: '/admin'
    },
    {
      text: t('admin.sidebar.movies'),
      icon: <LocalMovies />,
      path: '/admin/movies'
    },
    {
      text: t('admin.sidebar.showtimes'),
      icon: <Schedule />,
      path: '/admin/showtimes'
    },
    {
      text: t('admin.sidebar.theaters'),
      icon: <ConfirmationNumber />,
      path: '/admin/theaters'
    },
    {
      text: t('admin.sidebar.bookings'),
      icon: <ConfirmationNumber />,
      path: '/admin/bookings'
    },
    {
      text: t('admin.sidebar.users'),
      icon: <People />,
      path: '/admin/users'
    }
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth, 
          boxSizing: 'border-box',
          backgroundColor: '#1f2937',
          color: 'white',
          borderRight: 'none'
        },
      }}
    >
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" component="h1" sx={{ fontWeight: 'bold', color: 'white' }}>
          {t('admin.sidebar.adminPanel')}
        </Typography>
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
      
      <List sx={{ mt: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            to={item.path}
            sx={{
              color: 'white',
              mb: 1,
              borderRadius: '4px',
              mx: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)'
              },
              ...(isActive(item.path) && {
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.main'
                }
              })
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: '40px' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ mt: 'auto', p: 2 }}>
        <AdminLogout />
      </Box>
    </Drawer>
  );
};

export default AdminSidebar;