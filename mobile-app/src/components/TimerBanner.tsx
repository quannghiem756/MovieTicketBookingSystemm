import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import { useBooking } from '../context/BookingContext';
import { useTranslation } from '../context/I18nContext';

const TimerBanner = () => {
  const { timeLeft, isTimerActive } = useBooking();
  const { t } = useTranslation();
  const theme = useTheme();

  if (!isTimerActive || timeLeft <= 0) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Surface style={[styles.container, { backgroundColor: '#ff9800' }]} elevation={2}>
      <Text style={styles.text}>
        {t('booking.seats.footer.expires', { time: formatTime(timeLeft) })}
      </Text>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default TimerBanner;
