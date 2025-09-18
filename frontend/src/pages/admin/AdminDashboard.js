import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useTranslation } from '../../contexts/I18nContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button
} from '@mui/material';
import {
  LocalMovies,
  Schedule,
  ConfirmationNumber,
  People,
  Add,
  AccessTime,
  CheckCircle
} from '@mui/icons-material';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    movies: 0,
    showtimes: 0,
    bookings: 0,
    users: 0
  });
  const { t } = useTranslation();

  useEffect(() => {
    // Fetch dashboard statistics
    const fetchStats = async () => {
      try {
        // In a real implementation, you would have specific endpoints for these stats
        // For now, we'll just show placeholders
        setStats({
          movies: 15,
          showtimes: 42,
          bookings: 128,
          users: 256
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        {t('admin.dashboard.title')}
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalMovies sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
                <Typography variant="h6">
                  {t('admin.dashboard.movies')}
                </Typography>
              </Box>
              <Typography variant="h3" component="p" sx={{ mb: 2, fontWeight: 'bold' }}>
                {stats.movies}
              </Typography>
              <Button 
                component={Link} 
                to="/admin/movies" 
                variant="outlined" 
                fullWidth
                sx={{ mt: 1 }}
              >
                {t('admin.dashboard.manageMovies')}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Schedule sx={{ fontSize: 32, color: 'success.main', mr: 1 }} />
                <Typography variant="h6">
                  {t('admin.dashboard.showtimes')}
                </Typography>
              </Box>
              <Typography variant="h3" component="p" sx={{ mb: 2, fontWeight: 'bold' }}>
                {stats.showtimes}
              </Typography>
              <Button 
                component={Link} 
                to="/admin/showtimes" 
                variant="outlined" 
                fullWidth
                sx={{ mt: 1 }}
              >
                {t('admin.dashboard.manageShowtimes')}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ConfirmationNumber sx={{ fontSize: 32, color: 'warning.main', mr: 1 }} />
                <Typography variant="h6">
                  {t('admin.dashboard.theaters')}
                </Typography>
              </Box>
              <Typography variant="h3" component="p" sx={{ mb: 2, fontWeight: 'bold' }}>
                {stats.theaters || 0}
              </Typography>
              <Button 
                component={Link} 
                to="/admin/theaters" 
                variant="outlined" 
                fullWidth
                sx={{ mt: 1 }}
              >
                {t('admin.dashboard.manageTheaters')}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ConfirmationNumber sx={{ fontSize: 32, color: 'warning.main', mr: 1 }} />
                <Typography variant="h6">
                  {t('admin.dashboard.bookings')}
                </Typography>
              </Box>
              <Typography variant="h3" component="p" sx={{ mb: 2, fontWeight: 'bold' }}>
                {stats.bookings}
              </Typography>
              <Button 
                component={Link} 
                to="/admin/bookings" 
                variant="outlined" 
                fullWidth
                sx={{ mt: 1 }}
              >
                {t('admin.dashboard.manageBookings')}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People sx={{ fontSize: 32, color: 'secondary.main', mr: 1 }} />
                <Typography variant="h6">
                  {t('admin.dashboard.users')}
                </Typography>
              </Box>
              <Typography variant="h3" component="p" sx={{ mb: 2, fontWeight: 'bold' }}>
                {stats.users}
              </Typography>
              <Button 
                component={Link} 
                to="/admin/users" 
                variant="outlined" 
                fullWidth
                sx={{ mt: 1 }}
              >
                {t('admin.dashboard.manageUsers')}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2 }}>
            {t('admin.dashboard.recentActivity')}
          </Typography>
          <List>
            <ListItem alignItems="flex-start" sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Add sx={{ mr: 1, color: 'primary.main' }} />
                <ListItemText 
                  primary={t('admin.dashboard.newMovieAdded')} 
                  secondary='"Inception" was added to the movie list'
                />
              </Box>
              <Typography variant="caption" sx={{ alignSelf: 'flex-end', color: 'text.secondary' }}>
                2 hours ago
              </Typography>
              <Divider sx={{ mt: 2 }} />
            </ListItem>
            
            <ListItem alignItems="flex-start" sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccessTime sx={{ mr: 1, color: 'success.main' }} />
                <ListItemText 
                  primary={t('admin.dashboard.showtimeCreated')} 
                  secondary='New showtime for "The Matrix" at 7:30 PM'
                />
              </Box>
              <Typography variant="caption" sx={{ alignSelf: 'flex-end', color: 'text.secondary' }}>
                4 hours ago
              </Typography>
              <Divider sx={{ mt: 2 }} />
            </ListItem>
            
            <ListItem alignItems="flex-start" sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CheckCircle sx={{ mr: 1, color: 'info.main' }} />
                <ListItemText 
                  primary={t('admin.dashboard.bookingConfirmed')} 
                  secondary='Booking #12345 for "Interstellar" was confirmed'
                />
              </Box>
              <Typography variant="caption" sx={{ alignSelf: 'flex-end', color: 'text.secondary' }}>
                1 day ago
              </Typography>
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminDashboard;