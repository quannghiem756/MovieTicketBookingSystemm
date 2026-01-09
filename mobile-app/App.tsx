import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import theme from './src/theme';
import { Text, View, StyleSheet } from 'react-native';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar style="light" />
        <View style={styles.container}>
          <Text style={styles.text}>Movie Ticket Booking System</Text>
          <Text style={styles.subtext}>Mobile App Initialized</Text>
        </View>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#d32f2f',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtext: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 10,
  },
});