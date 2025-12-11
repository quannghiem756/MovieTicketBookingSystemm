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
  Alert,
  Fab
} from '@mui/material';
import { Send, AutoAwesome, Minimize, ExpandMore } from '@mui/icons-material';
import { getMovieRecommendations } from '../services/api';
import { useTranslation } from '../context/I18nContext';

const MovieRecommendationChat = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: t('recommendation.welcomeMessage'),
      isBot: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [minimized, setMinimized] = useState(false);
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

        return `${t('recommendation.successMessage')}\n\n${movieList}\n\n${t('recommendation.enjoyMessage')}`;
      } else if (responseMessage) {
        return responseMessage;
      } else {
        return t('recommendation.noResultsMessage');
      }
    } catch (error) {
      console.error('Error getting recommendation:', error);
      return t('recommendation.errorMessage');
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
        text: t('recommendation.errorMessage'),
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

  const toggleMinimize = () => {
    setMinimized(!minimized);
  };

  // If minimized, show only a small button with title and toggle icon
  if (minimized) {
    return (
      <Fab
        variant="extended"
        onClick={toggleMinimize}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
          background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
          color: 'white',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1976D2, #03A9F4)',
          }
        }}
      >
        <AutoAwesome sx={{ mr: 1 }} />
        {t('recommendation.title')}
        <ExpandMore
          sx={{
            ml: 1,
            transform: 'rotate(180deg)',
            transition: 'transform 0.3s ease'
          }}
        />
      </Fab>
    );
  }

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: '400px',
        height: '600px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(30,30,30,0.7)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoAwesome color="primary" />
          {t('recommendation.title')}
        </Typography>
        <IconButton
          onClick={toggleMinimize}
          size="small"
          sx={{ color: 'text.secondary' }}
        >
          <Minimize />
        </IconButton>
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
                  <Typography>{t('recommendation.loadingMessage')}</Typography>
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
            placeholder={t('recommendation.placeholder')}
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
            label={t('recommendation.example1')}
            clickable
            onClick={() => setInputValue(t('recommendation.example1'))}
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          />
          <Chip
            size="small"
            label={t('recommendation.example2')}
            clickable
            onClick={() => setInputValue(t('recommendation.example2'))}
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          />
          <Chip
            size="small"
            label={t('recommendation.example3')}
            clickable
            onClick={() => setInputValue(t('recommendation.example3'))}
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          />
          <Chip
            size="small"
            label={t('recommendation.example4')}
            clickable
            onClick={() => setInputValue(t('recommendation.example4'))}
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default MovieRecommendationChat;