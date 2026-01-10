import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Text, Title, useTheme, Card, Button, Divider } from 'react-native-paper';
import { useTranslation } from '../context/I18nContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getBookingById } from '../services/movieService';

const { width } = Dimensions.get('window');

const BookingConfirmation = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  const [bookingData, setBookingData] = useState<any>(route.params?.bookingData);
  const [loading, setLoading] = useState(!route.params?.bookingData && route.params?.bookingId);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!bookingData && route.params?.bookingId) {
      fetchBooking(route.params.bookingId);
    }
  }, [route.params?.bookingId]);

  const fetchBooking = async (id: string) => {
    setLoading(true);
    try {
      const data = await getBookingById(id);
      setBookingData(data);
    } catch (err) {
      console.error('Error fetching booking:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 10, color: '#fff' }}>{t('common.loading')}</Text>
      </View>
    );
  }

  if (error || (!bookingData && !loading)) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <MaterialCommunityIcons name="alert-circle-outline" size={80} color={theme.colors.error} />
        <Title style={{ marginTop: 20, color: '#fff' }}>{t('booking.confirmation.invalid')}</Title>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('Home')}
          style={styles.button}
        >
          {t('booking.confirmation.bookMore')}
        </Button>
      </View>
    );
  }

  const movieTitle = bookingData.movieTitle || bookingData.movie?.title;
  const theaterName = bookingData.theaterName || bookingData.theater?.name;
  const showDate = bookingData.showDate || bookingData.showtime?.showDate;
  const showTime = bookingData.showTime || bookingData.showtime?.showTime;
  const seatIds = bookingData.seatIds || [];
  const totalPrice = bookingData.totalPrice || 0;
  const bookingId = bookingData.bookingId || bookingData.id;
  const validationToken = bookingData.validationToken;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="check-circle" size={80} color="#4CAF50" />
        <Title style={styles.title}>{t('booking.confirmation.title')}</Title>
        <Text style={styles.subtitle}>
          {t('booking.confirmation.subtitle')}
        </Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.row}>
            <MaterialCommunityIcons name="movie-open" size={24} color={theme.colors.primary} />
            <Text style={styles.movieTitle}>{movieTitle}</Text>
          </View>
          
          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>{t('booking.confirmation.theater')}</Text>
              <View style={styles.valueRow}>
                <MaterialCommunityIcons name="map-marker" size={16} color={theme.colors.primary} />
                <Text style={styles.value}>{theaterName}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>{t('booking.confirmation.date')}</Text>
              <View style={styles.valueRow}>
                <MaterialCommunityIcons name="calendar" size={16} color={theme.colors.primary} />
                <Text style={styles.value}>
                  {showDate ? new Date(showDate).toLocaleDateString() : ''}
                </Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>{t('booking.confirmation.time')}</Text>
              <View style={styles.valueRow}>
                <MaterialCommunityIcons name="clock-outline" size={16} color={theme.colors.primary} />
                <Text style={styles.value}>{showTime}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>{t('booking.confirmation.seats')}</Text>
              <Text style={styles.value}>{seatIds.join(', ')}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>{t('booking.confirmation.total')}</Text>
              <Text style={[styles.value, { color: theme.colors.primary, fontWeight: 'bold' }]}>
                {totalPrice.toLocaleString()} VNĐ
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={[styles.card, { marginTop: 10 }]}>
        <Card.Content style={styles.qrContainer}>
          <Text style={styles.qrLabel}>{t('booking.confirmation.qrCodeTitle')}</Text>
          <View style={styles.qrWrapper}>
            <QRCode
              value={validationToken || bookingId}
              size={150}
              backgroundColor="white"
            />
          </View>
          <Text style={styles.qrSubtitle}>{t('booking.confirmation.qrCodeSubtitle')}</Text>
          
          <Divider style={styles.divider} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{t('booking.confirmation.bookingId')}:</Text>
            <Text style={styles.detailValue}>{bookingId}</Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.footer}>
        <Text style={styles.infoText}>{t('booking.confirmation.info')}</Text>
        
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('My Tickets')}
          style={styles.button}
        >
          {t('booking.confirmation.viewBookings')}
        </Button>

        <Button 
          mode="outlined" 
          onPress={() => navigation.navigate('Home')}
          style={styles.button}
        >
          {t('booking.confirmation.bookMore')}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
    color: '#b3b3b3',
  },
  card: {
    marginHorizontal: 15,
    borderRadius: 15,
    elevation: 4,
    backgroundColor: '#1a1a1a',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1,
    color: '#fff',
  },
  divider: {
    marginVertical: 15,
    backgroundColor: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoItem: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#b3b3b3',
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
    color: '#fff',
  },
  qrContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  qrLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#fff',
  },
  qrWrapper: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
  },
  qrSubtitle: {
    fontSize: 12,
    color: '#b3b3b3',
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  detailLabel: {
    fontSize: 14,
    color: '#b3b3b3',
    marginRight: 5,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  infoText: {
    fontSize: 14,
    color: '#b3b3b3',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    marginBottom: 12,
    borderRadius: 8,
  }
});

export default BookingConfirmation;
