import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  Paper,
  Chip,
  CircularProgress
} from '@mui/material';
import { useTranslation } from '../../../context/I18nContext';
import { getSupportTicketById, addSupportReply, updateSupportTicketStatus } from '../../../services/api';

const ReplyModal = ({ open, onClose, ticketId, onReplySuccess }) => {
  const { t } = useTranslation();
  const [ticketData, setTicketData] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resolving, setResolving] = useState(false);
  const commentsEndRef = useRef(null);

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (open && ticketId) {
      fetchTicketDetails();
    } else {
      setTicketData(null);
      setComments([]);
      setReplyContent('');
    }
  }, [open, ticketId]);

  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  const fetchTicketDetails = async () => {
    setLoading(true);
    try {
      const response = await getSupportTicketById(ticketId);
      setTicketData(response.data.ticket);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error('Error fetching ticket details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setSubmitting(true);
    try {
      await addSupportReply(ticketId, replyContent);
      setReplyContent('');
      await fetchTicketDetails(); // Refresh comments
      if (onReplySuccess) onReplySuccess();
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolveTicket = async () => {
    if (!window.confirm(t('admin.support.confirmResolve') || 'Are you sure you want to mark this ticket as resolved?')) return;
    
    setResolving(true);
    try {
      await updateSupportTicketStatus(ticketId, 'Resolved');
      await fetchTicketDetails();
      if (onReplySuccess) onReplySuccess();
    } catch (error) {
      console.error('Error resolving ticket:', error);
    } finally {
      setResolving(false);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {ticketData ? `${t('admin.support.ticket') || 'Ticket'}: ${ticketData.subject}` : t('admin.support.loading') || 'Loading...'}
          </Typography>
          <Box display="flex" gap={1} alignItems="center">
            {ticketData && (
              <>
                {ticketData.status !== 'Resolved' && (
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="success" 
                    onClick={handleResolveTicket}
                    disabled={resolving}
                  >
                    {t('admin.support.resolve') || 'Resolve'}
                  </Button>
                )}
                <Chip 
                  label={ticketData.status} 
                  variant="outlined" 
                  color={ticketData.status === 'Resolved' ? 'success' : (ticketData.status === 'Open' ? 'error' : 'primary')}
                />
              </>
            )}
          </Box>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : ticketData ? (
          <Box>
            {/* Original Message */}
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'black', mb: 3, borderRadius: 2 }}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="subtitle2" color="primary">
                  {ticketData.name} ({ticketData.email})
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {new Date(ticketData.created_at).toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="body1">{ticketData.message}</Typography>
            </Paper>

            <Divider>
              <Chip label={t('admin.support.conversation') || 'Conversation'} size="small" />
            </Divider>

            {/* Comments List */}
            <List sx={{ mt: 2, maxHeight: '400px', overflowY: 'auto' }}>
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
                      alignItems: comment.senderRole === 'User' ? 'flex-start' : 'flex-end',
                      mb: 2,
                      px: 0
                    }}
                  >
                    <Box 
                      sx={{ 
                        maxWidth: '80%', 
                        p: 2, 
                        borderRadius: 2, 
                        bgcolor: comment.senderRole === 'User' ? 'background.paper' : 'primary.light',
                        color: comment.senderRole === 'User' ? 'text.primary' : 'primary.contrastText',
                        boxShadow: 1,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" gap={4} mb={0.5}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                          {comment.senderRole === 'User' ? ticketData.name : comment.senderRole}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          {new Date(comment.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                      <Typography variant="body2">{comment.content}</Typography>
                    </Box>
                  </ListItem>
                ))
              )}
              <div ref={commentsEndRef} />
            </List>

            {/* Reply Form */}
            <Box component="form" onSubmit={handleReplySubmit} sx={{ mt: 3 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder={t('admin.support.typeReply') || 'Type your reply here...'}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                disabled={submitting}
                required
              />
              <Box display="flex" justifyContent="flex-end" mt={1}>
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
          </Box>
        ) : (
          <Typography>{t('admin.support.errorLoading') || 'Error loading ticket details.'}</Typography>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>{t('common.close') || 'Close'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReplyModal;
