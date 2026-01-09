import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Text, Title, useTheme, ActivityIndicator, Divider, Surface } from 'react-native-paper';
import { useTranslation } from '../context/I18nContext';
import { getShowtimeById, getTheaterById, getLockedSeats, holdSeat, releaseSeat } from '../services/movieService';
import { io, Socket } from 'socket.io-client';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Button from '../components/Button';
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');
const SEAT_SIZE = (width - 60) / 10;

const SeatSelectionScreen = ({ route, navigation }: any) => {
  const { showtimeId, movieTitle, movieId } = route.params;
  const { t } = useTranslation();
  const theme = useTheme();
  
  const [showtime, setShowtime] = useState<any>(null);
  const [theater, setTheater] = useState<any>(null);
  const [lockedSeats, setLockedSeats] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    fetchInitialData();
    setupSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave_showtime', showtimeId);
        socketRef.current.disconnect();
      }
      // Release selected seats when leaving
      selectedSeats.forEach(seatId => releaseSeat(showtimeId, seatId));
    };
  }, [showtimeId]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const st = await getShowtimeById(showtimeId);
      setShowtime(st);
      
      const th = await getTheaterById(st.theaterId);
      setTheater(th);
      
      const locked = await getLockedSeats(showtimeId);
      setLockedSeats(locked);
    } catch (error) {
      console.error('Error fetching seat data:', error);
      Alert.alert('Error', 'Failed to load seat layout');
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

    socketRef.current.on('seats_updated', (updatedLockedSeats: string[]) => {
      setLockedSeats(updatedLockedSeats);
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
          Alert.alert('Limit reached', 'You can only select up to 8 seats.');
          return;
        }
        await holdSeat(showtimeId, seatId);
        setSelectedSeats(prev => [...prev, seatId]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Could not update seat status');
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

  if (loading || !theater) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].slice(0, theater.rows);
  const seatsPerRow = theater.seatsPerRow;

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
          <Text style={styles.screenText}>SCREEN</Text>
        </View>

        <View style={styles.seatGrid}>
          {rows.map(row => (
            <View key={row} style={styles.row}>
              <Text style={styles.rowLabel}>{row}</Text>
              <View style={styles.rowSeats}>
                {Array.from({ length: seatsPerRow }).map((_, i) => {
                  const seatId = `${row}${i + 1}`;
                  const isSelected = selectedSeats.includes(seatId);
                  const isLocked = lockedSeats.includes(seatId);
                  
                  return (
                    <TouchableOpacity
                      key={seatId}
                      style={[
                        styles.seat,
                        isSelected && styles.selectedSeat,
                        isLocked && !isSelected && styles.lockedSeat
                      ]}
                      onPress={() => toggleSeat(seatId)}
                      disabled={isLocked && !isSelected}
                    >
                      <Text style={[styles.seatText, (isSelected || isLocked) && { color: '#fff' }]}>
                        {i + 1}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Text style={styles.rowLabel}>{row}</Text>
            </View>
          ))}
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.seat, styles.legendBox]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.seat, styles.selectedSeat, styles.legendBox]} />
            <Text style={styles.legendText}>Selected</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.seat, styles.lockedSeat, styles.legendBox]} />
            <Text style={styles.legendText}>Taken</Text>
          </View>
        </View>
      </ScrollView>

      <Surface style={styles.footer}>
        <View style={styles.footerInfo}>
          <Text style={styles.selectedCount}>{selectedSeats.length} seats selected</Text>
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
          Confirm Selection
        </Button>
      </Surface>
    </View>
  );
};

// Supporting component
import { IconButton } from 'react-native-paper';

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
    width: '100%',
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  rowLabel: {
    color: '#666',
    width: 20,
    textAlign: 'center',
    fontSize: 12,
  },
  rowSeats: {
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  seat: {
    width: SEAT_SIZE,
    height: SEAT_SIZE,
    backgroundColor: '#333',
    margin: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 10,
    color: '#666',
  },
  legend: {
    flexDirection: 'row',
    marginTop: 40,
    justifyContent: 'center',
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  legendBox: {
    width: 16,
    height: 16,
    marginRight: 8,
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
