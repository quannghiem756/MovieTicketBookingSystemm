import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { Send, AutoAwesome } from '@mui/icons-material';
import { getMovieRecommendations } from '../services/api';

const MovieRecommendationChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI-powered movie recommendation assistant. Ask me for movie suggestions based on your preferences like genre, mood, or actors, and I'll find the perfect movies for you!",
      isBot: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getRecommendation = async (userMessage) => {
    try {
      // Call backend API for recommendations using Gemini
      const response = await getMovieRecommendations(userMessage);
      const { recommendations, message: responseMessage } = response.data;

      if (recommendations && recommendations.length > 0) {
        const movieList = recommendations.map(movie =>
          `• ${movie.title} (${movie.genre?.join(', ') || 'N/A'} | ${movie.rating || 'N/A'})`
        ).join('\n');

        return `Based on your preferences, I recommend these movies:\n\n${movieList}\n\nEnjoy your movie experience! 🎬`;
      } else if (responseMessage) {
        return responseMessage;
      } else {
        return "I couldn't find any movies matching your criteria. Try mentioning genres like 'action', 'comedy', 'drama' or specific actors/directors you like!";
      }
    } catch (error) {
      console.error('Error getting recommendation:', error);
      return "Sorry, I encountered an error while processing your request. Could you please try again?";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = { id: Date.now(), text: inputValue, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      // Get recommendation from backend API
      const botResponse = await getRecommendation(inputValue);

      // Add bot response
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        isBot: true
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error while processing your request. Could you please try again?",
        isBot: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Paper
      sx={{
        height: '600px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(30,30,30,0.7)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesome color="primary" />
          AI Movie Recommendation Assistant
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Ask for personalized movie suggestions based on genre, mood, or your preferences!
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <List>
          {messages.map((message) => (
            <ListItem
              key={message.id}
              sx={{
                justifyContent: message.isBot ? 'flex-start' : 'flex-end',
                mb: 2
              }}
            >
              <Paper
                sx={{
                  maxWidth: '80%',
                  p: 2,
                  borderRadius: 3,
                  backgroundColor: message.isBot
                    ? 'rgba(50, 50, 50, 0.8)'
                    : 'primary.main',
                  color: message.isBot ? 'white' : 'white'
                }}
              >
                <ListItemText
                  primary={
                    <Typography
                      component="div"
                      sx={{
                        whiteSpace: 'pre-line',
                        fontSize: '0.9rem',
                        lineHeight: 1.5
                      }}
                    >
                      {message.text}
                    </Typography>
                  }
                  sx={{ margin: 0 }}
                />
              </Paper>
            </ListItem>
          ))}
          {loading && (
            <ListItem sx={{ justifyContent: 'flex-start', mb: 2 }}>
              <Paper
                sx={{
                  maxWidth: '80%',
                  p: 2,
                  borderRadius: 3,
                  backgroundColor: 'rgba(50, 50, 50, 0.8)',
                  color: 'white'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} />
                  <Typography>Generating your personalized recommendations...</Typography>
                </Box>
              </Paper>
            </ListItem>
          )}
          <div ref={messagesEndRef} />
        </List>
      </Box>

      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask for movie recommendations (e.g., 'Recommend action movies' or 'What's playing now?')..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            multiline
            maxRows={4}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || loading}
            sx={{
              borderRadius: 2,
              minWidth: 50,
              alignSelf: 'flex-end'
            }}
          >
            <Send />
          </Button>
        </Box>
        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          <Chip
            size="small"
            label="Recommend action movies"
            clickable
            onClick={() => setInputValue("Recommend action movies")}
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          />
          <Chip
            size="small"
            label="What's playing now?"
            clickable
            onClick={() => setInputValue("What's playing now?")}
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          />
          <Chip
            size="small"
            label="PG movies"
            clickable
            onClick={() => setInputValue("PG movies")}
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          />
          <Chip
            size="small"
            label="Comedy suggestions"
            clickable
            onClick={() => setInputValue("Comedy suggestions")}
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default MovieRecommendationChat;