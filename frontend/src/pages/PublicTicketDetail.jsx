import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { useTranslation } from '../context/I18nContext';
import { getPublicSupportTicket, addPublicSupportReply } from '../services/api';

const PublicTicketDetail = () => {
  const { token } = useParams();
  const { t } = useTranslation();
  const [ticketData, setTicketData] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const commentsEndRef = useRef(null);

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await getPublicSupportTicket(token);
        setTicketData(response.data.ticket);
        setComments(response.data.comments || []);
      } catch (err) {
        setError(t('common.error') || 'Failed to load ticket.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchTicket();
    }
  }, [token, t]);

  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setSubmitting(true);
    try {
      await addPublicSupportReply(token, replyContent);
      setReplyContent('');
      
      // Refresh comments
      const response = await getPublicSupportTicket(token);
      setComments(response.data.comments || []);
    } catch (err) {
      console.error('Error sending reply:', err);
      // Ideally show a snackbar here
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !ticketData) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error || t('common.movieNotFound')}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight="bold">
            {ticketData.subject}
          </Typography>
          <Chip 
            label={ticketData.status} 
            color={ticketData.status === 'Resolved' ? 'success' : (ticketData.status === 'Open' ? 'error' : 'primary')}
          />
        </Box>
        
        <Box display="flex" justifyContent="space-between" color="text.secondary" mb={2}>
            <Typography variant="body2">{t('admin.support.ticket')}: #{ticketData._id.slice(-6)}</Typography>
            <Typography variant="body2">{new Date(ticketData.created_at).toLocaleString()}</Typography>
        </Box>

        <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 2 }}>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{ticketData.message}</Typography>
        </Paper>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>{t('admin.support.conversation') || 'Conversation'}</Typography>
        
        <List sx={{ maxHeight: '500px', overflowY: 'auto', mb: 2 }}>
            {comments.length === 0 ? (
                 <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
                    {t('admin.support.noReplies') || 'No replies yet.'}
                 </Typography>
            ) : (
                comments.map((comment) => (
                    <ListItem 
                        key={comment._id}
                        sx={{
                            flexDirection: 'column',
                            alignItems: comment.senderRole === 'User' ? 'flex-end' : 'flex-start',
                            px: 0
                        }}
                    >
                        <Box 
                            sx={{ 
                                maxWidth: '80%', 
                                p: 2, 
                                borderRadius: 2, 
                                bgcolor: comment.senderRole === 'User' ? 'primary.light' : 'grey.100',
                                color: comment.senderRole === 'User' ? 'primary.contrastText' : 'text.primary'
                            }}
                        >
                            <Box display="flex" justifyContent="space-between" gap={2} mb={0.5}>
                                <Typography variant="caption" fontWeight="bold">
                                    {comment.senderRole === 'User' ? t('admin.support.user') : comment.senderRole}
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                    {new Date(comment.createdAt).toLocaleString()}
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{comment.content}</Typography>
                        </Box>
                    </ListItem>
                ))
            )}
            <div ref={commentsEndRef} />
        </List>

        {ticketData.status !== 'Resolved' && (
            <Box component="form" onSubmit={handleReplySubmit}>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder={t('admin.support.typeReply') || 'Type your reply here...'}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    disabled={submitting}
                    required
                    sx={{ mb: 2 }}
                />
                <Box display="flex" justifyContent="flex-end">
                    <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={submitting || !replyContent.trim()}
                        startIcon={submitting && <CircularProgress size={20} />}
                    >
                        {t('admin.support.sendReply') || 'Send Reply'}
                    </Button>
                </Box>
            </Box>
        )}
      </Paper>
    </Container>
  );
};

export default PublicTicketDetail;
