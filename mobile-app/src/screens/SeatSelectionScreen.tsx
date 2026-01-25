import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Text, Title, useTheme, ActivityIndicator, Divider, Surface, IconButton } from 'react-native-paper';
import { useTranslation } from '../context/I18nContext';
import { getShowtimeById, getTheaterById, getLockedSeats, holdSeat, releaseSeat, getBookingsByUserId } from '../services/movieService';
import { useFocusEffect } from '@react-navigation/native';
import { io, Socket } from 'socket.io-client';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Constants from 'expo-constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SeatSelectionScreen = ({ route, navigation }: any) => {
  const { showtimeId, movieTitle, movieId } = route.params;
  const { t } = useTranslation();
  const theme = useTheme();
  
  const { user } = useAuth();
  
  const [showtime, setShowtime] = useState<any>(null);
  const [theater, setTheater] = useState<any>(null);
  const [lockedSeats, setLockedSeats] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  
  const socketRef = useRef<Socket | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchInitialData();
    setupSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave_showtime', showtimeId);
        socketRef.current.disconnect();
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showtimeId]);

  useFocusEffect(
    useCallback(() => {
      // Refresh locked seats on focus
      getLockedSeats(showtimeId).then(setLockedSeats).catch(console.error);
    }, [showtimeId])
  );

  useEffect(() => {
    if (selectedSeats.length > 0) {
      if (!timerRef.current) {
        // ... (rest of the timer logic)
        setTimeLeft(600); // 10 minutes default
        timerRef.current = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current!);
              timerRef.current = null;
              handleTimerExpire();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setTimeLeft(0);
      }
    }
  }, [selectedSeats]);

  const handleTimerExpire = () => {
    Alert.alert(t('booking.seats.timerExpired'), t('booking.seats.timerExpiredMsg'));
    setSelectedSeats([]);
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const st = await getShowtimeById(showtimeId);
      setShowtime(st);
      
      const th = await getTheaterById(st.theaterId);
      setTheater(th);
      
      const locked = await getLockedSeats(showtimeId);
      setLockedSeats(locked);

      // Fetch user's held seats for this showtime
      if (user?.id) {
        const userBookings = await getBookingsByUserId(user.id);
        const currentHold = userBookings.find((b: any) => 
          b.showtimeId === showtimeId && (b.status === 'held' || b.status === 'pending')
        );
        if (currentHold) {
          setSelectedSeats(currentHold.seatIds);
          // Set timer based on expiry if available
          if (currentHold.expiresAt) {
            const expiry = new Date(currentHold.expiresAt).getTime();
            const now = new Date().getTime();
            const diff = Math.floor((expiry - now) / 1000);
            if (diff > 0) setTimeLeft(diff);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching seat data:', error);
      Alert.alert(t('common.error'), t('booking.seats.errorLoadLayout'));
    } finally {
      setLoading(false);
    }
  };

  const setupSocket = () => {
    const host = Constants.expoConfig?.hostUri?.split(':').shift();
    const socketUrl = host ? `http://${host}:5000` : 'http://localhost:5000';
    
    socketRef.current = io(socketUrl);
    
    socketRef.current.on('connect', () => {
      socketRef.current?.emit('join_showtime', showtimeId);
    });

    socketRef.current.on('seat_held', ({ seatId, userId: holderId }: any) => {
      setLockedSeats(prev => [...new Set([...prev, seatId])]);
    });

    socketRef.current.on('seat_released', ({ seatId }: any) => {
      setLockedSeats(prev => prev.filter(id => id !== seatId));
    });

    socketRef.current.on('seat_confirmed', ({ seatId }: any) => {
      setLockedSeats(prev => [...new Set([...prev, seatId])]);
    });
  };

  const toggleSeat = async (seatId: string) => {
    if (lockedSeats.includes(seatId) && !selectedSeats.includes(seatId)) {
      return; // Seat is taken
    }

    try {
      if (selectedSeats.includes(seatId)) {
        await releaseSeat(showtimeId, seatId);
        setSelectedSeats(prev => prev.filter(id => id !== seatId));
      } else {
        if (selectedSeats.length >= 8) {
          Alert.alert(t('booking.seats.limitReached'), t('booking.seats.limitReachedMsg'));
          return;
        }
        await holdSeat(showtimeId, seatId);
        setSelectedSeats(prev => [...prev, seatId]);
        setTimeLeft(600); // Reset timer to 10 minutes on new hold
      }
    } catch (error: any) {
      Alert.alert(t('common.error'), error.response?.data?.error || t('booking.seats.errorUpdate'));
    }
  };

  const handleConfirm = () => {
    navigation.navigate('Checkout', {
      showtimeId,
      selectedSeats,
      movieTitle,
      movieId,
      pricePerSeat: showtime.price,
      showTime: showtime.showTime,
      showDate: showtime.showDate,
      theaterName: theater.name
    });
  };

  if (loading || !theater || !theater.seatMap) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Fixed seat size for better touch targets, with horizontal scroll if needed
  const SEAT_SIZE = 36;
  const SEAT_MARGIN = 4;

  const getSeatColor = (seat: any) => {
    if (selectedSeats.includes(seat.id)) return '#4caf50'; // success.main (Green)
    if (lockedSeats.includes(seat.id) || seat.isDisabled) return '#757575'; // grey.600
    
    switch (seat.type) {
      case 'vip': return '#f44336'; // error.main (Red)
      case 'double': return '#ff9800'; // warning.main (Orange)
      case 'standard': return '#424242'; // grey.700
      default: return '#424242';
    }
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <IconButton icon="chevron-left" onPress={() => navigation.goBack()} />
        <View style={styles.headerInfo}>
          <Title style={styles.movieTitle}>{movieTitle}</Title>
          <Text style={styles.showtimeInfo}>{showtime.showTime} • {theater.name}</Text>
        </View>
      </Surface>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.screenContainer}>
          <View style={styles.screenLine} />
          <Text style={styles.screenText}>{t('booking.seats.screen')}</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
          <View style={styles.seatGrid}>
            {theater.seatMap.map((rowSeats: any[], rowIndex: number) => {
              const rowLabel = rowSeats[0]?.row || String.fromCharCode(65 + rowIndex);
              return (
                <View key={`row-${rowIndex}`} style={styles.row}>
                  <Text style={styles.rowLabel}>{rowLabel}</Text>
                  <View style={styles.rowSeats}>
                    {rowSeats.map((seat: any, seatIndex: number) => {
                      if (seat.type === 'space') {
                        return (
                          <View 
                            key={`space-${rowIndex}-${seatIndex}`} 
                            style={{ width: SEAT_SIZE, height: SEAT_SIZE, margin: SEAT_MARGIN / 2 }} 
                          />
                        );
                      }

                      const seatId = seat.id;
                      const isSelected = selectedSeats.includes(seatId);
                      const isLocked = lockedSeats.includes(seatId) || seat.isDisabled;
                      const bgColor = getSeatColor(seat);
                      
                      return (
                        <TouchableOpacity
                          key={seatId}
                          style={[
                            styles.seat,
                            { 
                              width: SEAT_SIZE, 
                              height: SEAT_SIZE, 
                              margin: SEAT_MARGIN / 2,
                              backgroundColor: bgColor,
                              borderColor: isSelected ? '#4caf50' : 'transparent',
                              borderWidth: isSelected ? 2 : 0
                            }
                          ]}
                          onPress={() => toggleSeat(seatId)}
                          disabled={isLocked && !isSelected}
                        >
                          <Text style={[styles.seatText, { color: '#fff', fontSize: SEAT_SIZE * 0.35 }]}>
                            {seat.number}
                          </Text>
                          {(seat.type === 'vip' || seat.type === 'double') && !isSelected && !isLocked && (
                             <View style={styles.typeDot} />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  
                </View>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.legend}>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.seat, styles.legendBox, { backgroundColor: '#424242' }]} />
              <Text style={styles.legendText}>{t('booking.seats.legend.available')}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.seat, styles.legendBox, { backgroundColor: '#4caf50' }]} />
              <Text style={styles.legendText}>{t('booking.seats.legend.selected')}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.seat, styles.legendBox, { backgroundColor: '#757575' }]} />
              <Text style={styles.legendText}>{t('booking.seats.legend.taken')}</Text>
            </View>
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.seat, styles.legendBox, { backgroundColor: '#f44336' }]} />
              <Text style={styles.legendText}>{t('booking.seats.legend.vip')}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.seat, styles.legendBox, { backgroundColor: '#ff9800' }]} />
              <Text style={styles.legendText}>{t('booking.seats.legend.double')}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Surface style={styles.footer}>
        <View style={styles.footerInfo}>
          <Text style={styles.selectedCount}>{t('booking.seats.footer.selected', { count: selectedSeats.length })}</Text>
          {timeLeft > 0 && (
            <Text style={styles.timerText}>
              {t('booking.seats.footer.expires', { time: `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}` })}
            </Text>
          )}
          <Title style={styles.totalPrice}>
            {(selectedSeats.length * showtime.price).toLocaleString()} VND
          </Title>
        </View>
        <Button
          mode="contained"
          onPress={handleConfirm}
          disabled={selectedSeats.length === 0}
          style={styles.confirmButton}
        >
          {t('booking.seats.confirm')}
        </Button>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#1a1a1a',
    elevation: 4,
  },
  headerInfo: {
    marginLeft: 10,
  },
  movieTitle: {
    fontSize: 18,
    lineHeight: 22,
  },
  showtimeInfo: {
    fontSize: 12,
    color: '#b3b3b3',
  },
  scrollContent: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  screenContainer: {
    width: '80%',
    alignItems: 'center',
    marginBottom: 50,
  },
  screenLine: {
    width: '100%',
    height: 4,
    backgroundColor: '#d32f2f',
    borderRadius: 2,
    shadowColor: '#d32f2f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  screenText: {
    marginTop: 10,
    color: '#666',
    fontSize: 12,
    letterSpacing: 4,
  },
  seatGrid: {
    paddingHorizontal: 10,
  },
  horizontalScroll: {
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  rowLabel: {
    color: '#666',
    width: 20,
    textAlign: 'center',
    fontSize: 12,
  },
  rowSeats: {
    flexDirection: 'row',
  },
  seat: {
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  selectedSeat: {
    backgroundColor: '#d32f2f',
  },
  lockedSeat: {
    backgroundColor: '#1a1a1a',
    borderColor: '#333',
    borderWidth: 1,
  },
  seatText: {
    fontWeight: 'bold',
  },
  legend: {
    marginTop: 30,
    alignItems: 'center',
    width: '100%',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendBox: {
    width: 18,
    height: 18,
    marginRight: 6,
  },
  legendText: {
    color: '#b3b3b3',
    fontSize: 12,
  },
  footer: {
    padding: 20,
    paddingBottom: 35,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#1a1a1a',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 10,
  },
  footerInfo: {
    flex: 1,
  },
  selectedCount: {
    fontSize: 12,
    color: '#b3b3b3',
  },
  timerText: {
    fontSize: 12,
    color: '#ff9800',
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 20,
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  confirmButton: {
    flex: 1,
    marginLeft: 20,
  },
});

export default SeatSelectionScreen;
