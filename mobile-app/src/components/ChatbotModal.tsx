import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Modal, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Text, Title, useTheme, IconButton, Surface, TextInput, ActivityIndicator, Card, Paragraph } from 'react-native-paper';
import { useChatbot } from '../context/ChatbotContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/I18nContext';
import { getMovieRecommendations } from '../services/movieService';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  movies?: any[];
}

const ChatbotModal = () => {
  const { isOpen, closeChatbot } = useChatbot();
  const { user } = useAuth();
  const { t, locale } = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation();
  
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t('chatbot.welcome', { name: user?.name || '' }),
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const query = inputText;
    setInputText('');
    setLoading(true);

    try {
      const response = await getMovieRecommendations(query);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message || t('chatbot.suggestions'),
        sender: 'bot',
        timestamp: new Date(),
        movies: response.recommendations || [],
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: t('chatbot.errorMessage'),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const navigateToMovie = (movieId: string) => {
    closeChatbot();
    // Assuming we navigate via MoviesTab stack
    navigation.navigate('MoviesTab' as never, { 
      screen: 'MovieDetails', 
      params: { movieId } 
    } as never);
  };

  const renderMovieCard = (movie: any) => (
    <TouchableOpacity 
      key={movie.id} 
      style={styles.movieCardWrapper}
      onPress={() => navigateToMovie(movie.id)}
    >
      <Card style={styles.movieCard}>
        <Card.Cover source={{ uri: movie.posterUrl }} style={styles.moviePoster} />
        <Card.Content style={styles.movieCardContent}>
          <Text numberOfLines={1} style={styles.movieTitle}>{movie.title}</Text>
          <Text style={styles.movieMeta}>{movie.rating} • {movie.duration}{t('movies.durationUnit')}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={closeChatbot}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Surface style={styles.header}>
          <View style={styles.headerTitle}>
            <MaterialCommunityIcons name="sparkles" size={24} color={theme.colors.primary} />
            <Title style={styles.title}>{t('chatbot.title')}</Title>
          </View>
          <IconButton icon="close" onPress={closeChatbot} />
        </Surface>

        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.chatContent}
        >
          {messages.map((msg) => (
            <View key={msg.id} style={[
              styles.messageWrapper,
              msg.sender === 'user' ? styles.userMessageWrapper : styles.botMessageWrapper
            ]}>
              <Surface style={[
                styles.messageBubble,
                msg.sender === 'user' ? styles.userBubble : styles.botBubble
              ]}>
                <Text style={styles.messageText}>{msg.text}</Text>
              </Surface>
              
              {msg.movies && msg.movies.length > 0 && (
                <View style={styles.moviesContainer}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {msg.movies.map(renderMovieCard)}
                  </ScrollView>
                </View>
              )}
            </View>
          ))}
          
          {loading && (
            <View style={styles.botMessageWrapper}>
              <Surface style={[styles.messageBubble, styles.botBubble, styles.loadingBubble]}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
              </Surface>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputArea}>
          <TextInput
            mode="outlined"
            placeholder={t('chatbot.placeholder')}
            value={inputText}
            onChangeText={setInputText}
            style={styles.input}
            outlineColor="#333"
            activeOutlineColor={theme.colors.primary}
            onSubmitEditing={handleSend}
            right={
              <TextInput.Icon 
                icon="send" 
                color={inputText.trim() ? theme.colors.primary : '#666'} 
                onPress={handleSend}
              />
            }
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    elevation: 4,
    backgroundColor: '#1a1a1a',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  title: {
    marginLeft: 10,
    fontSize: 18,
    color: '#fff',
  },
  chatContent: {
    padding: 15,
    flexGrow: 1,
  },
  messageWrapper: {
    marginBottom: 15,
    width: '100%',
  },
  userMessageWrapper: {
    alignItems: 'flex-end',
  },
  botMessageWrapper: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    maxWidth: '85%',
    elevation: 2,
  },
  userBubble: {
    backgroundColor: '#d32f2f',
    borderBottomRightRadius: 2,
  },
  botBubble: {
    backgroundColor: '#1e1e1e',
    borderBottomLeftRadius: 2,
  },
  loadingBubble: {
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  messageText: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 20,
  },
  moviesContainer: {
    marginTop: 10,
    width: '100%',
  },
  movieCardWrapper: {
    width: 140,
    marginRight: 12,
  },
  movieCard: {
    backgroundColor: '#252525',
    borderRadius: 12,
    overflow: 'hidden',
  },
  moviePoster: {
    height: 180,
  },
  movieCardContent: {
    padding: 8,
  },
  movieTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  movieMeta: {
    fontSize: 10,
    color: '#b3b3b3',
    marginTop: 2,
  },
  inputArea: {
    padding: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  input: {
    backgroundColor: '#0f0f0f',
  },
});

export default ChatbotModal;