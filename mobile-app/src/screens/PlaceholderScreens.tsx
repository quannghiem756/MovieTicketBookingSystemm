import React from 'react';
import { View, Text } from 'react-native';

const HomeScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Home Screen</Text>
  </View>
);

const MoviesScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Movies Screen</Text>
  </View>
);

const MyTicketsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f0f' }}>
    <Text style={{ color: '#fff' }}>My Tickets Screen</Text>
  </View>
);

export { HomeScreen, MoviesScreen, MyTicketsScreen };
