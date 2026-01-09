import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import theme from './src/theme';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { I18nProvider, useTranslation } from './src/context/I18nContext';
import LanguageSelectionModal from './src/components/LanguageSelectionModal';
import { ChatbotProvider, useChatbot } from './src/context/ChatbotContext';
import ChatbotModal from './src/components/ChatbotModal';
import ChatbotFAB from './src/components/ChatbotFAB';

const AppContent = () => {
  const { isLanguageSet } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [modalVisible, setModalVisible] = useState(!isLanguageSet);

  // Sync modal visibility with context state
  React.useEffect(() => {
    setModalVisible(!isLanguageSet);
  }, [isLanguageSet]);

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator />
      <LanguageSelectionModal 
        visible={modalVisible} 
        onComplete={() => setModalVisible(false)} 
      />
    </>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <I18nProvider>
          <AuthProvider>
            <ChatbotProvider>
              <AppContent />
            </ChatbotProvider>
          </AuthProvider>
        </I18nProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}