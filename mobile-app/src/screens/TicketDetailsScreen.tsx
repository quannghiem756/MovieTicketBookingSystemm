import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Alert, useWindowDimensions } from 'react-native';
import { Text, Title, useTheme, ActivityIndicator, IconButton, Surface, Divider } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTranslation } from '../context/I18nContext';
import { getTicketByToken, replyToTicket } from '../services/supportService';
import Input from '../components/Input';
import RenderHTML from 'react-native-render-html';

const TicketDetailsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const { token } = route.params;

  const [ticket, setTicket] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replying, setReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [error, setError] = useState('');

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchTicketDetails();
  }, [token]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getTicketByToken(token);
      setTicket(data.ticket);
      setComments(data.comments || []);
    } catch (err: any) {
      setError(err.response?.data?.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;

    setReplying(true);
    try {
      await replyToTicket(token, replyContent);
      setReplyContent('');
      // Refresh ticket data to show new comment
      await fetchTicketDetails();
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 500);
    } catch (err: any) {
      Alert.alert(t('common.error'), err.response?.data?.message || 'Failed to send reply');
    } finally {
      setReplying(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return '#4caf50';
      case 'Replied': return '#2196f3';
      case 'Resolved': return '#9e9e9e';
      case 'Closed': return '#f44336';
      default: return theme.colors.primary;
    }
  };

  const renderComment = ({ item }: { item: any }) => {
    const isStaff = item.senderRole === 'Staff' || item.senderRole === 'Admin';
    
    return (
      <View style={[
        styles.commentWrapper,
        isStaff ? styles.staffCommentWrapper : styles.userCommentWrapper
      ]}>
        <Surface style={[
          styles.commentBubble,
          isStaff ? 
            { backgroundColor: '#1e1e1e', borderLeftWidth: 4, borderLeftColor: theme.colors.primary } : 
            { backgroundColor: '#2c2c2c' }
        ]}>
          <View style={styles.commentHeader}>
            <Text style={styles.senderName}>
              {isStaff ? t('contactUs.staff') : t('contactUs.you')}
            </Text>
            <Text style={styles.commentDate}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
          <RenderHTML
            contentWidth={width - 80}
            source={{ html: item.content }}
            tagsStyles={{
              p: { color: '#ffffff', margin: 0, padding: 0 },
              body: { color: '#ffffff' }
            }}
          />
        </Surface>
      </View>
    );
  };

  const ListHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Title style={styles.ticketTitle}>{ticket.subject || ticket.category}</Title>
        <Surface style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket.status) }]}>
          <Text style={styles.statusText}>{ticket.status}</Text>
        </Surface>
      </View>
      <Text style={styles.ticketMeta}>
        {t('contactUs.category')}: {ticket.category}
      </Text>
      <Text style={styles.ticketMeta}>
        {t('contactUs.created')}: {new Date(ticket.created_at).toLocaleString()}
      </Text>
      <Divider style={styles.divider} />
      
      {/* Original Message */}
      <View style={styles.commentWrapper}>
        <Surface style={[styles.commentBubble, styles.originalMessage]}>
          <View style={styles.commentHeader}>
            <Text style={styles.senderName}>{t('contactUs.you')}</Text>
          </View>
          <Text style={{ color: '#ffffff' }}>{ticket.message}</Text>
        </Surface>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error || !ticket) {
    return (
      <View style={[styles.container, styles.center]}>
        <IconButton icon="alert-circle-outline" iconColor={theme.colors.error} size={60} />
        <Text style={{ color: theme.colors.error, textAlign: 'center', marginBottom: 20 }}>{error}</Text>
        <Button mode="contained" onPress={fetchTicketDetails}>{t('common.retry')}</Button>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.topHeader}>
        <IconButton icon="arrow-left" iconColor="#ffffff" onPress={() => navigation.goBack()} />
        <Text variant="titleMedium" style={{ color: '#ffffff' }}>{t('contactUs.ticketDetails')}</Text>
        <IconButton icon="refresh" iconColor="#ffffff" onPress={fetchTicketDetails} />
      </View>

      <FlatList
        ref={flatListRef}
        data={comments}
        renderItem={renderComment}
        keyExtractor={item => item._id}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <Surface style={styles.replyContainer} elevation={4}>
        <Input
          placeholder={t('contactUs.replyPlaceholder')}
          value={replyContent}
          onChangeText={setReplyContent}
          multiline
          style={styles.replyInput}
          label=""
        />
        <IconButton
          icon="send"
          iconColor={theme.colors.primary}
          size={30}
          onPress={handleReply}
          disabled={replying || !replyContent.trim()}
        />
      </Surface>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    backgroundColor: '#1e1e1e',
  },
  listContent: {
    padding: 15,
  },
  header: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  ticketTitle: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 20,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 10,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  ticketMeta: {
    color: '#b3b3b3',
    fontSize: 12,
    marginBottom: 4,
  },
  divider: {
    marginVertical: 15,
    backgroundColor: '#333',
  },
  commentWrapper: {
    marginBottom: 15,
    maxWidth: '85%',
  },
  userCommentWrapper: {
    alignSelf: 'flex-end',
  },
  staffCommentWrapper: {
    alignSelf: 'flex-start',
  },
  commentBubble: {
    padding: 12,
    borderRadius: 12,
  },
  originalMessage: {
    backgroundColor: '#2c2c2c',
    width: '100%',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  senderName: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#ff6b35',
  },
  commentDate: {
    fontSize: 10,
    color: '#999',
    marginLeft: 10,
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    backgroundColor: '#1e1e1e',
  },
  replyInput: {
    flex: 1,
    marginBottom: 0,
    maxHeight: 100,
  },
});

export default TicketDetailsScreen;
