import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Container,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { getBookingsByUserId } from '../services/api';
import { useTranslation } from '../context/I18nContext';

const UserProfile = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (user) {
          const response = await getBookingsByUserId(user.id);
          setBookings(response.data);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        {t('profile.title')}
      </Typography>
      
      {user && (
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('profile.title')}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>{t('register.name')}</strong> {user.name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>{t('register.email')}</strong> {user.email}
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Button variant="outlined" onClick={logout}>
              {t('header.logout')}
            </Button>
          </Box>
        </Paper>
      )}
      
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          {t('bookings.title')}
        </Typography>
        
        {loading ? (
          <Typography>{t('common.loading')}</Typography>
        ) : bookings.length > 0 ? (
          <List>
            {bookings.map((booking) => (
              <div key={booking.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={`${t('bookings.bookingId')} ${booking.id.substring(0, 8)}`}
                    secondary={
                      <React.Fragment>
                        <Typography component="span" variant="body2" color="text.primary">
                          {t('bookings.totalPrice')} ${booking.totalPrice.toFixed(2)}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.primary">
                          {t('bookings.status')} {booking.status === 'confirmed' ? t('bookings.status.confirmed') : booking.status === 'pending' ? t('bookings.status.pending') : t('bookings.status.cancelled')}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          {t('bookings.bookingDate')} {new Date(booking.bookingDate).toLocaleString()}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </div>
            ))}
          </List>
        ) : (
          <Typography>{t('bookings.noBookings')}</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default UserProfile;