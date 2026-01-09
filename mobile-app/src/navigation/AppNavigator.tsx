import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/ProfileScreen';
import HomeScreen from '../screens/HomeScreen';
import MoviesScreen from '../screens/MoviesScreen';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';
import SeatSelectionScreen from '../screens/SeatSelectionScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import MyTicketsScreen from '../screens/MyTicketsScreen';
import { useTheme, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/I18nContext';
import AuthNavigator from './AuthNavigator';
import { View } from 'react-native';
import ChatbotFAB from '../components/ChatbotFAB';
import ChatbotModal from '../components/ChatbotModal';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MoviesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MoviesList" component={MoviesScreen} />
      <Stack.Screen name="MovieDetails" component={MovieDetailsScreen} />
      <Stack.Screen name="SeatSelection" component={SeatSelectionScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  );
}

function MainNavigator() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.outline,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'MoviesTab') {
            iconName = focused ? 'movie' : 'movie-outline';
          } else if (route.name === 'My Tickets') {
            iconName = focused ? 'ticket' : 'ticket-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: t('nav.home') }}
      />
      <Tab.Screen 
        name="MoviesTab" 
        component={MoviesStack} 
        options={{ title: t('nav.movies') }}
      />
      <Tab.Screen 
        name="My Tickets" 
        component={MyTicketsScreen} 
        options={{ title: t('nav.myTickets') }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: t('nav.profile') }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();
  const theme = useTheme();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f0f' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

    return (

      <NavigationContainer>

        <Stack.Navigator screenOptions={{ headerShown: false }}>

          {isAuthenticated ? (

            <Stack.Screen name="Main" component={MainNavigator} />

          ) : (

            <Stack.Screen name="Auth" component={AuthNavigator} />

          )}

        </Stack.Navigator>

        {isAuthenticated && <ChatbotFAB />}

        <ChatbotModal />

      </NavigationContainer>

    );

  }

  