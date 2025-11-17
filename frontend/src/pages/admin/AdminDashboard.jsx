import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../context/I18nContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Paper,
  Stack,
  useTheme,
  useMediaQuery,
  Avatar,
  Chip,
  LinearProgress,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  LocalMovies,
  Schedule,
  ConfirmationNumber,
  People,
  Add,
  AccessTime,
  CheckCircle,
  Event,
  TheaterComedy,
  EmojiEvents,
  TrendingUp,
  ShoppingCart,
  ShowChart,
  Visibility,
  AttachMoney,
  BarChart,
  PieChart
} from '@mui/icons-material';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    movies: 0,
    showtimes: 0,
    bookings: 0,
    users: 0,
    revenue: 0,
    activeBookings: 0,
    upcomingShows: 0
  });
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    // Fetch dashboard statistics
    const fetchStats = async () => {
      try {
        // In a real implementation, you would fetch from the backend
        // For now, we'll just show placeholders
        setStats({
          movies: 15,
          showtimes: 42,
          bookings: 128,
          users: 256,
          revenue: 15420.50,
          activeBookings: 24,
          upcomingShows: 18
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  const recentActivity = [
    {
      id: 1,
      icon: <Add sx={{ color: 'primary.main' }} />,
      title: t('admin.dashboard.newMovieAdded'),
      description: '"Inception" was added to the movie list',
      time: '2 hours ago',
      color: 'primary'
    },
    {
      id: 2,
      icon: <AccessTime sx={{ color: 'success.main' }} />,
      title: t('admin.dashboard.showtimeCreated'),
      description: 'New showtime for "The Matrix" at 7:30 PM',
      time: '4 hours ago',
      color: 'success'
    },
    {
      id: 3,
      icon: <CheckCircle sx={{ color: 'info.main' }} />,
      title: t('admin.dashboard.bookingConfirmed'),
      description: 'Booking #12345 for "Interstellar" was confirmed',
      time: '1 day ago',
      color: 'info'
    },
    {
      id: 4,
      icon: <ConfirmationNumber sx={{ color: 'warning.main' }} />,
      title: t('admin.dashboard.bookingCancelled'),
      description: 'Booking #12346 for "Dune" was cancelled',
      time: '2 days ago',
      color: 'warning'
    }
  ];

  const quickActions = [
    { 
      title: t('admin.dashboard.addMovie'), 
      icon: <TheaterComedy />, 
      color: 'primary', 
      link: '/admin/movies/new' 
    },
    { 
      title: t('admin.dashboard.addShowtime'), 
      icon: <Schedule />, 
      color: 'success', 
      link: '/admin/showtimes/new' 
    },
    { 
      title: t('admin.dashboard.addTheater'), 
      icon: <LocalMovies />, 
      color: 'warning', 
      link: '/admin/theaters/new' 
    },
    { 
      title: t('admin.dashboard.manageUsers'), 
      icon: <People />, 
      link: '/admin/users' 
    }
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
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
          {t('admin.dashboard.title')}
        </Typography>
        <Typography variant="h6" color="textSecondary">
          {t('admin.dashboard.subtitle')}
        </Typography>
      </Box>
      
      {/* Stats Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 12px)', lg: 'calc(16.666% - 12px)' } }}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(30,30,30,0.7)',
              backdropFilter: 'blur(10px)',
              overflow: 'hidden'
            }}
          >
            <CardContent sx={{ p: 3, flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48, mr: 2 }}>
                  <LocalMovies />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {t('admin.dashboard.movies')}
                </Typography>
              </Box>
              <Typography variant="h4" component="p" sx={{ fontWeight: 700 }}>
                {stats.movies}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        
        <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 12px)', lg: 'calc(16.666% - 12px)' } }}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(30,30,30,0.7)',
              backdropFilter: 'blur(10px)',
              overflow: 'hidden'
            }}
          >
            <CardContent sx={{ p: 3, flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', width: 48, height: 48, mr: 2 }}>
                  <Schedule />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {t('admin.dashboard.showtimes')}
                </Typography>
              </Box>
              <Typography variant="h4" component="p" sx={{ fontWeight: 700 }}>
                {stats.showtimes}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        
        <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 12px)', lg: 'calc(16.666% - 12px)' } }}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(30,30,30,0.7)',
              backdropFilter: 'blur(10px)',
              overflow: 'hidden'
            }}
          >
            <CardContent sx={{ p: 3, flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', width: 48, height: 48, mr: 2 }}>
                  <ConfirmationNumber />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {t('admin.dashboard.bookings')}
                </Typography>
              </Box>
              <Typography variant="h4" component="p" sx={{ fontWeight: 700 }}>
                {stats.bookings}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        
        <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 12px)', lg: 'calc(16.666% - 12px)' } }}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(30,30,30,0.7)',
              backdropFilter: 'blur(10px)',
              overflow: 'hidden'
            }}
          >
            <CardContent sx={{ p: 3, flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{  width: 48, height: 48, mr: 2 }}>
                  <People />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {t('admin.dashboard.users')}
                </Typography>
              </Box>
              <Typography variant="h4" component="p" sx={{ fontWeight: 700 }}>
                {stats.users}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        
        <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 12px)', lg: 'calc(16.666% - 12px)' } }}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(30,30,30,0.7)',
              backdropFilter: 'blur(10px)',
              overflow: 'hidden'
            }}
          >
            <CardContent sx={{ p: 3, flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', width: 48, height: 48, mr: 2 }}>
                  <AttachMoney />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {t('admin.dashboard.revenue')}
                </Typography>
              </Box>
              <Typography variant="h4" component="p" sx={{ fontWeight: 700 }}>
                ${stats.revenue.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        
        <Box sx={{ flex: '1 1 calc(50% - 12px)', minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 12px)', lg: 'calc(16.666% - 12px)' } }}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(30,30,30,0.7)',
              backdropFilter: 'blur(10px)',
              overflow: 'hidden'
            }}
          >
            <CardContent sx={{ p: 3, flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main', width: 48, height: 48, mr: 2 }}>
                  <Event />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {t('admin.dashboard.upcomingShowtimes')}
                </Typography>
              </Box>
              <Typography variant="h4" component="p" sx={{ fontWeight: 700 }}>
                {stats.upcomingShows}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
      
      {/* Quick Actions */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        {quickActions.map((action, index) => (
          <Box key={index} sx={{ flex: '1 1 calc(50% - 12px)', minWidth: { xs: 'calc(50% - 12px)', sm: 'calc(25% - 12px)' } }}>
            <Card 
              component={Link}
              to={action.link}
              sx={{ 
                height: 120,
                borderRadius: 4,
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(30,30,30,0.7)',
                backdropFilter: 'blur(10px)',
                textDecoration: 'none',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}
            >
              <CardContent sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%',
                p: 2
              }}>
                <Avatar sx={{ bgcolor: `${action.color}.main`, mb: 1 }}>
                  {action.icon}
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'center', color: 'text.primary' }}>
                  {action.title}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
      
      {/* Main Content */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {/* Recent Activity */}
        <Box sx={{ flex: '1 1 100%', minWidth: { xs: '100%', md: 'calc(50% - 24px)' }, width: { xs: '100%', md: 'calc(50% - 24px)' } }}>
          <Card 
            sx={{ 
              height: '100%',
              borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(30,30,30,0.7)',
              backdropFilter: 'blur(10px)',
              overflow: 'hidden'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Visibility sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
                  {t('admin.dashboard.recentActivity')}
                </Typography>
              </Box>
              
              <List>
                {recentActivity.map((activity) => (
                  <ListItem key={activity.id} alignItems="flex-start" sx={{ flexDirection: 'column', alignItems: 'stretch', py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1, width: '100%' }}>
                      <Box sx={{ mr: 2, mt: 0.5 }}>
                        {activity.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <ListItemText 
                          primary={activity.title}
                          secondary={activity.description}
                          primaryTypographyProps={{ fontWeight: 600, mb: 0.5 }}
                          secondaryTypographyProps={{ color: 'textSecondary' }}
                        />
                        <Typography variant="caption" sx={{ color: 'textSecondary', mt: 1 }}>
                          {activity.time}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ mt: 2, mb: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
        
        {/* Performance Stats */}
        <Box sx={{ flex: '1 1 100%', minWidth: { xs: '100%', md: 'calc(50% - 24px)' }, width: { xs: '100%', md: 'calc(50% - 24px)' } }}>
          <Card 
            sx={{ 
              height: '100%',
              borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(30,30,30,0.7)',
              backdropFilter: 'blur(10px)',
              overflow: 'hidden'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TrendingUp sx={{ mr: 2, color: 'primary.main' }} />
                <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
                  {t('admin.dashboard.performance')}
                </Typography>
              </Box>
              
              <Stack spacing={2}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {t('admin.dashboard.bookingRate')}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      78%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={78} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'success.main',
                      }
                    }} 
                  />
                </Box>
                
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {t('admin.dashboard.cinemaCapacity')}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      65%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={65} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'warning.main',
                      }
                    }} 
                  />
                </Box>
                
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {t('admin.dashboard.customerSatisfaction')}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      92%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={92} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'primary.main',
                      }
                    }} 
                  />
                </Box>
              </Stack>
              
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/admin/reports"
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
                  {t('admin.dashboard.viewReports')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;