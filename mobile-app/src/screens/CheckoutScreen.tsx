import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import * as Linking from 'expo-linking';
import { Text, Title, useTheme, Surface, Divider, List, TextInput, ActivityIndicator, IconButton, Card } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from '../context/I18nContext';
import { createBooking, validateCoupon, createMomoPayment, releaseAllSeats } from '../services/movieService';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import TimerBanner from '../components/TimerBanner';
import Button from '../components/Button';

const CheckoutScreen = ({ route, navigation }: any) => {
  const { 
    showtimeId, 
    selectedSeats, 
    movieTitle, 
    pricePerSeat, 
    showTime, 
    showDate, 
    theaterName,
    movieId
  } = route.params;
  
  const { t , locale} = useTranslation();
  const theme = useTheme();
  const { user } = useAuth();
  const { timeLeft, isTimerActive, setHeldSeats, heldSeats } = useBooking();
  const isFocused = useIsFocused();
  
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0 && isFocused && heldSeats.length > 0) {
      handleTimerExpire();
    }
  }, [timeLeft, isFocused, heldSeats.length]);

  const handleTimerExpire = async () => {
    setHeldSeats([]); // Clear immediately to avoid multiple alerts
    try {
      await releaseAllSeats(showtimeId);
    } catch (e) {
      console.error('Error releasing seats:', e);
    }
    Alert.alert(
      t('booking.seats.timerExpired'), 
      t('booking.seats.timerExpiredMsg'),
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const subtotal = selectedSeats.length * pricePerSeat;
  const total = subtotal - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    
    setValidatingCoupon(true);
    try {
      const result = await validateCoupon(couponCode, subtotal, movieId);
      setDiscount(result.discountAmount);
      setCouponApplied(true);
      Alert.alert(t('common.success'), t('booking.checkout.successCoupon'));
    } catch (error: any) {
      Alert.alert(t('booking.checkout.invalidCoupon'), error.response?.data?.error || t('booking.checkout.errorCoupon'));
      setDiscount(0);
      setCouponApplied(false);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Create the booking
      const bookingData = {
        showtimeId,
        userId: user.id,
        seatIds: selectedSeats,
        totalPrice: subtotal,
        couponCode: couponApplied ? couponCode : undefined
      };
      
      const booking = await createBooking(bookingData);
      
      // 2. Create MoMo payment with dynamic redirect URL
      const redirectUrl = Linking.createURL('payment-result', {
        queryParams: { bookingId: booking.id }
      });
      console.log('Mobile Redirect URL:', redirectUrl);

      const response = await createMomoPayment(booking.id, redirectUrl);
      console.log('MoMo Payment Response:', response);

      // Extract the actual URL string from the response object
      const paymentUrl = response.data;
      
      // 3. Open MoMo App/Web
      const supported = await Linking.canOpenURL(paymentUrl);
      if (supported) {
        await Linking.openURL(paymentUrl);
        // Note: We don't navigate here anymore. 
        // The MoMo app will redirect back to our app via the redirectUrl,
        // and our deep link handler should take over.
      } else {
        Alert.alert(t('common.error'), t('booking.checkout.errorOpenMomo'));
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      Alert.alert(t('common.error'), error.response?.data?.error || t('booking.checkout.errorPayment'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <IconButton icon="chevron-left" onPress={() => navigation.goBack()} />
        <Title style={styles.headerTitle}>{t('booking.checkout.title')}</Title>
      </Surface>

      <TimerBanner />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title style={styles.movieTitle}>{movieTitle}</Title>
            <Text style={styles.infoText}>{theaterName}</Text>
            <Text style={styles.infoText}>
              {new Date(showDate).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-GB')} at {showTime}
            </Text>
            <Divider style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>{t('booking.checkout.seatsLabel', { count: selectedSeats.length })}</Text>
              <Text style={styles.value}>{selectedSeats.join(', ')}</Text>
            </View>
          </Card.Content>
        </Card>

        <Surface style={styles.couponSection}>
          <TextInput
            label={t('booking.checkout.promoCode')}
            value={couponCode}
            onChangeText={setCouponCode}
            mode="outlined"
            style={styles.couponInput}
            disabled={couponApplied || validatingCoupon}
            right={
              validatingCoupon ? (
                <TextInput.Icon icon={() => <ActivityIndicator size="small" />} />
              ) : null
            }
          />
          <Button
            mode={couponApplied ? "outlined" : "contained"}
            onPress={couponApplied ? () => { setCouponApplied(false); setDiscount(0); setCouponCode(''); } : handleApplyCoupon}
            style={styles.couponBtn}
            disabled={!couponCode || validatingCoupon}
          >
            {couponApplied ? t('booking.checkout.remove') : t('booking.checkout.apply')}
          </Button>
        </Surface>

        <Surface style={styles.priceCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>{t('booking.checkout.subtotal')}</Text>
            <Text style={styles.priceValue}>{subtotal.toLocaleString()} VND</Text>
          </View>
          {discount > 0 && (
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: '#4caf50' }]}>{t('booking.checkout.discount')}</Text>
              <Text style={[styles.priceValue, { color: '#4caf50' }]}>-{discount.toLocaleString()} VND</Text>
            </View>
          )}
          <Divider style={styles.divider} />
          <View style={styles.priceRow}>
            <Title style={styles.totalLabel}>{t('booking.checkout.total')}</Title>
            <Title style={styles.totalValue}>{total.toLocaleString()} VND</Title>
          </View>
        </Surface>

        <View style={styles.paymentMethods}>
          <Text style={styles.sectionTitle}>{t('booking.checkout.paymentMethod')}</Text>
          <List.Item
            title={t('booking.checkout.momoWallet')}
            left={props => <List.Icon {...props} icon="wallet" color="#ae2070" />}
            right={props => <List.Icon {...props} icon="check-circle" color={theme.colors.primary} />}
            style={styles.paymentItem}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handlePayment}
          loading={loading}
          disabled={loading}
          style={styles.payButton}
        >
          {t('booking.checkout.payWithMomo')}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#1a1a1a',
    elevation: 4,
  },
  headerTitle: {
    marginLeft: 10,
  },
  scrollContent: {
    padding: 20,
  },
  summaryCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 20,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoText: {
    color: '#b3b3b3',
    fontSize: 14,
    marginBottom: 2,
  },
  divider: {
    marginVertical: 15,
    backgroundColor: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: '#b3b3b3',
  },
  value: {
    color: '#fff',
    fontWeight: 'bold',
  },
  couponSection: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center',
    marginBottom: 20,
  },
  couponInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#1a1a1a',
  },
  couponBtn: {
    marginLeft: 10,
    height: 50,
    justifyContent: 'center',
  },
  priceCard: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priceLabel: {
    color: '#b3b3b3',
  },
  priceValue: {
    color: '#fff',
  },
  totalLabel: {
    fontSize: 18,
  },
  totalValue: {
    fontSize: 22,
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  paymentMethods: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  paymentItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
  },
  footer: {
    padding: 20,
    paddingBottom: 35,
    backgroundColor: '#0f0f0f',
  },
  payButton: {
    paddingVertical: 8,
  },
});

export default CheckoutScreen;
