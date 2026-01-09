import React from 'react';
import { View, Text } from 'react-native';

const MoviesScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f0f' }}>
    <Text style={{ color: '#fff' }}>Movies Screen</Text>
  </View>
);

const MyTicketsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f0f' }}>
    <Text style={{ color: '#fff' }}>My Tickets Screen</Text>
  </View>
);

export { MoviesScreen, MyTicketsScreen };
