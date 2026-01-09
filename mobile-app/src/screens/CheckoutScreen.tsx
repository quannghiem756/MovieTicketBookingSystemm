import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { Text, Title, useTheme, Surface, Divider, List, TextInput, ActivityIndicator } from 'react-native-paper';
import { useTranslation } from '../context/I18nContext';
import { createBooking, validateCoupon, createMomoPayment } from '../services/movieService';
import { useAuth } from '../context/AuthContext';
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
  
  const { t } = useTranslation();
  const theme = useTheme();
  const { user } = useAuth();
  
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const subtotal = selectedSeats.length * pricePerSeat;
  const total = subtotal - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    
    setValidatingCoupon(true);
    try {
      const result = await validateCoupon(couponCode, subtotal, movieId);
      setDiscount(result.discountAmount);
      setCouponApplied(true);
      Alert.alert('Success', 'Coupon applied successfully!');
    } catch (error: any) {
      Alert.alert('Invalid Coupon', error.response?.data?.error || 'Failed to apply coupon');
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
        totalPrice: total,
        couponCode: couponApplied ? couponCode : undefined
      };
      
      const booking = await createBooking(bookingData);
      
      // 2. Create MoMo payment
      const paymentUrl = await createMomoPayment(booking.id);
      
      // 3. Open MoMo App/Web
      const supported = await Linking.canOpenURL(paymentUrl);
      if (supported) {
        await Linking.openURL(paymentUrl);
        // After opening payment, we might want to navigate to a status screen
        // or My Tickets. For now, let's go to My Tickets.
        navigation.navigate('My Tickets');
      } else {
        Alert.alert('Error', 'Cannot open payment URL');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      Alert.alert('Payment Error', error.response?.data?.error || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <IconButton icon="chevron-left" onPress={() => navigation.goBack()} />
        <Title style={styles.headerTitle}>Checkout</Title>
      </Surface>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title style={styles.movieTitle}>{movieTitle}</Title>
            <Text style={styles.infoText}>{theaterName}</Text>
            <Text style={styles.infoText}>
              {new Date(showDate).toLocaleDateString()} at {showTime}
            </Text>
            <Divider style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>Seats ({selectedSeats.length})</Text>
              <Text style={styles.value}>{selectedSeats.join(', ')}</Text>
            </View>
          </Card.Content>
        </Card>

        <Surface style={styles.couponSection}>
          <TextInput
            label="Promo Code"
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
            {couponApplied ? 'Remove' : 'Apply'}
          </Button>
        </Surface>

        <Surface style={styles.priceCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>{subtotal.toLocaleString()} VND</Text>
          </View>
          {discount > 0 && (
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: '#4caf50' }]}>Discount</Text>
              <Text style={[styles.priceValue, { color: '#4caf50' }]}>-{discount.toLocaleString()} VND</Text>
            </View>
          )}
          <Divider style={styles.divider} />
          <View style={styles.priceRow}>
            <Title style={styles.totalLabel}>Total</Title>
            <Title style={styles.totalValue}>{total.toLocaleString()} VND</Title>
          </View>
        </Surface>

        <View style={styles.paymentMethods}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <List.Item
            title="MoMo E-Wallet"
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
          Pay with MoMo
        </Button>
      </View>
    </View>
  );
};

import { IconButton, Card } from 'react-native-paper';

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
