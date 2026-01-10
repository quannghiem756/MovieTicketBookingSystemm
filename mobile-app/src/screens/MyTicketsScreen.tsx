import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Dimensions, Modal, TouchableOpacity } from 'react-native';
import { Text, Title, useTheme, Card, ActivityIndicator, Surface, IconButton, Divider } from 'react-native-paper';
import { useTranslation } from '../context/I18nContext';
import { useAuth } from '../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import authService from '../services/authService';
import QRCode from 'react-native-qrcode-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const MyTicketsScreen = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const theme = useTheme();
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      fetchTickets();
    }, [user?.id])
  );

  const fetchTickets = async () => {
    try {
      if (user) {
        const data = await authService.getBookingHistory(user.id);
        setBookings(data.filter((b: any) => b.status === 'confirmed'));
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTickets();
  };

  const renderTicketItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => setSelectedTicket(item)}>
      <Card style={styles.ticketCard}>
        <View style={styles.ticketContent}>
          <View style={styles.ticketLeft}>
            <Title numberOfLines={1} style={styles.movieTitle}>{item.movie?.title || 'Movie'}</Title>
            <Text style={styles.infoText}>{item.showtime?.showTime} • {new Date(item.showtime?.showDate).toLocaleDateString()}</Text>
            <Text style={styles.infoText}>{item.theater?.name || 'Theater'}</Text>
            <View style={styles.seatRow}>
              <MaterialCommunityIcons name="seat" size={14} color={theme.colors.primary} />
              <Text style={styles.seatText}>{item.seatIds.join(', ')}</Text>
            </View>
          </View>
          <View style={styles.ticketRight}>
            <QRCode
              value={item.verificationCode || item.id}
              size={60}
              backgroundColor="transparent"
              color="#fff"
            />
            <Text style={styles.tapText}>Tap to view</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Surface style={styles.header}>
        <Title style={styles.headerTitle}>{t('nav.myTickets')}</Title>
      </Surface>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderTicketItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
          }
          ListEmptyComponent={() => (
            <View style={styles.center}>
              <MaterialCommunityIcons name="ticket-outline" size={64} color="#333" />
              <Text style={styles.emptyText}>You don't have any tickets yet.</Text>
            </View>
          )}
        />
      )}

      {/* Ticket Detail Modal */}
      <Modal
        visible={!!selectedTicket}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedTicket(null)}
      >
        <View style={styles.modalOverlay}>
          <Surface style={styles.modalContent}>
            <IconButton
              icon="close"
              style={styles.closeBtn}
              onPress={() => setSelectedTicket(null)}
            />
            
            <View style={styles.modalHeader}>
              <Title style={styles.modalMovieTitle}>{selectedTicket?.movie?.title}</Title>
              <Text style={styles.modalInfo}>{selectedTicket?.theater?.name}</Text>
              <Text style={styles.modalInfo}>
                {selectedTicket && new Date(selectedTicket.showtime?.showDate).toLocaleDateString()} at {selectedTicket?.showtime?.showTime}
              </Text>
            </View>

            <View style={styles.qrContainer}>
              <Surface style={styles.qrSurface}>
                <QRCode
                  value={selectedTicket?.verificationCode || selectedTicket?.id || ''}
                  size={width * 0.6}
                />
              </Surface>
              <Text style={styles.verificationCode}>{selectedTicket?.verificationCode}</Text>
            </View>

            <Divider style={styles.modalDivider} />

            <View style={styles.modalRow}>
              <View style={styles.modalCol}>
                <Text style={styles.modalLabel}>Seats</Text>
                <Text style={styles.modalValue}>{selectedTicket?.seatIds.join(', ')}</Text>
              </View>
              <View style={styles.modalCol}>
                <Text style={styles.modalLabel}>Total Price</Text>
                <Text style={styles.modalValue}>{selectedTicket?.totalPrice.toLocaleString()} VND</Text>
              </View>
            </View>

            <View style={styles.instructions}>
              <MaterialCommunityIcons name="information-outline" size={16} color="#666" />
              <Text style={styles.instructionText}>
                Present this QR code at the cinema entrance for validation.
              </Text>
            </View>
          </Surface>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#1a1a1a',
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
  },
  ticketCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
  },
  ticketContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  ticketLeft: {
    flex: 1,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#b3b3b3',
    marginBottom: 2,
  },
  seatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  seatText: {
    fontSize: 12,
    color: '#fff',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  ticketRight: {
    alignItems: 'center',
    marginLeft: 10,
  },
  tapText: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
  emptyText: {
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#1a1a1a',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  modalMovieTitle: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 5,
  },
  modalInfo: {
    color: '#b3b3b3',
    fontSize: 14,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  qrSurface: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  verificationCode: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: '#fff',
  },
  modalDivider: {
    width: '100%',
    backgroundColor: '#333',
    marginBottom: 20,
  },
  modalRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalCol: {
    flex: 1,
  },
  modalLabel: {
    fontSize: 12,
    color: '#b3b3b3',
    marginBottom: 4,
  },
  modalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  instructions: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#33333333',
    padding: 12,
    borderRadius: 8,
  },
  instructionText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
    flex: 1,
  },
});

export default MyTicketsScreen;
