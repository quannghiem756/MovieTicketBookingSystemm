import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Title, useTheme, IconButton, Surface, TextInput } from 'react-native-paper';
import { useChatbot } from '../context/ChatbotContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ChatbotModal = () => {
  const { isOpen, closeChatbot } = useChatbot();
  const theme = useTheme();
  const [message, setMessage] = React.useState('');

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
            <Title style={styles.title}>AI Assistant</Title>
          </View>
          <IconButton icon="close" onPress={closeChatbot} />
        </Surface>

        <ScrollView contentContainerStyle={styles.chatContent}>
          <Surface style={styles.botMessage}>
            <Text style={styles.messageText}>
              Hello! I'm your cinema assistant. How can I help you today? ✨
            </Text>
          </Surface>
          
          <Text style={styles.placeholderInfo}>
            (Chatbot logic will be implemented in Phase 6)
          </Text>
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            mode="outlined"
            placeholder="Type your message..."
            value={message}
            onChangeText={setMessage}
            style={styles.input}
            right={<TextInput.Icon icon="send" color={theme.colors.primary} />}
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
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  title: {
    marginLeft: 10,
    fontSize: 18,
  },
  chatContent: {
    padding: 20,
    flexGrow: 1,
  },
  botMessage: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#1e1e1e',
    maxWidth: '85%',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  messageText: {
    color: '#fff',
    lineHeight: 20,
  },
  placeholderInfo: {
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  inputContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#1a1a1a',
  },
  input: {
    backgroundColor: '#0f0f0f',
  },
});

export default ChatbotModal;
