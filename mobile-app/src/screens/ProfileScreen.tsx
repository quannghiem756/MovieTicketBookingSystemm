import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Text, Title, useTheme, Avatar, List, Divider, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/I18nContext';
import authService from '../services/authService';
import Button from '../components/Button';
import Card from '../components/Card';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      if (user) {
        const data = await authService.getBookingHistory(user.id);
        setBookings(data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBookingItem = ({ item }: { item: any }) => (
    <List.Item
      title={`Booking #${item.id.substring(item.id.length - 6).toUpperCase()}`}
      description={`${new Date(item.bookingDate).toLocaleDateString()} - ${item.totalPrice.toLocaleString()} VND`}
      left={props => <List.Icon {...props} icon="ticket" color={item.status === 'confirmed' ? '#4caf50' : '#f44336'} />}
      right={() => (
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { color: item.status === 'confirmed' ? '#4caf50' : '#f44336' }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      )}
      titleStyle={{ color: theme.colors.onSurface }}
      descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text
          size={80}
          label={user?.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
          style={{ backgroundColor: theme.colors.primary }}
        />
        <Title style={styles.userName}>{user?.name}</Title>
        <Text style={styles.userEmail}>{user?.email}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user?.loyaltyPoints || 0}</Text>
            <Text style={styles.statLabel}>{t('profile.points')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{bookings.length}</Text>
            <Text style={styles.statLabel}>{t('profile.bookings')}</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Title style={styles.sectionTitle}>{t('profile.bookingHistory')}</Title>
        {loading ? (
          <ActivityIndicator style={{ marginTop: 20 }} color={theme.colors.primary} />
        ) : (
          <FlatList
            data={bookings}
            renderItem={renderBookingItem}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={() => <Divider style={{ backgroundColor: theme.colors.outline }} />}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>{t('profile.noBookings')}</Text>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>

      <Button
        mode="outlined"
        onPress={logout}
        style={styles.logoutButton}
      >
        {t('auth.logout')}
      </Button>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#1e1e1e',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
  },
  userEmail: {
    color: '#b3b3b3',
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d32f2f',
  },
  statLabel: {
    fontSize: 12,
    color: '#b3b3b3',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  statusContainer: {
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#b3b3b3',
  },
  logoutButton: {
    margin: 20,
    borderColor: '#d32f2f',
  },
});

export default ProfileScreen;
