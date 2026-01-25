import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FAB, useTheme } from 'react-native-paper';
import { useChatbot } from '../context/ChatbotContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ChatbotFAB = () => {
  const { openChatbot } = useChatbot();
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <FAB
      style={[styles.fab, { backgroundColor: theme.colors.primary, bottom: insets.bottom + 80 }]}
      onPress={openChatbot}
      color="white"
      testID="fab"
      icon={() => (
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="sparkles" color="white" size={24} />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    borderRadius: 28,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default ChatbotFAB;
