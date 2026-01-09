import React from 'react';
import { StyleSheet } from 'react-native';
import { FAB, useTheme } from 'react-native-paper';
import { useChatbot } from '../context/ChatbotContext';

const ChatbotFAB = () => {
  const { openChatbot } = useChatbot();
  const theme = useTheme();

  return (
    <FAB
      icon="sparkles"
      style={[styles.fab, { backgroundColor: theme.colors.primary }]}
      onPress={openChatbot}
      color="white"
    />
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 28,
    elevation: 8,
  },
});

export default ChatbotFAB;
