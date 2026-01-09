import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Text, Title, useTheme, Surface } from 'react-native-paper';
import { useTranslation } from '../context/I18nContext';
import { CircleFlag } from 'react-native-circle-flags';

const LanguageSelectionModal = ({ visible, onComplete }: { visible: boolean; onComplete: () => void }) => {
  const { locale, setLocale, completeLanguageSetup } = useTranslation();
  const theme = useTheme();

  const handleSelect = async (lang: string) => {
    await setLocale(lang);
    await completeLanguageSetup();
    onComplete();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <Surface style={styles.modal}>
          <Title style={styles.title}>Select Language / Chọn ngôn ngữ</Title>
          
          <View style={styles.options}>
            <TouchableOpacity 
              style={[styles.option, locale === 'en' && styles.selectedOption]} 
              onPress={() => handleSelect('en')}
            >
              <CircleFlag countryCode="us" size={40} />
              <Text style={styles.optionText}>English</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.option, locale === 'vi' && styles.selectedOption]} 
              onPress={() => handleSelect('vi')}
            >
              <CircleFlag countryCode="vn" size={40} />
              <Text style={styles.optionText}>Tiếng Việt</Text>
            </TouchableOpacity>
          </View>
        </Surface>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '80%',
    padding: 24,
    borderRadius: 16,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
  },
  options: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  option: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: '#d32f2f',
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
  },
  optionText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LanguageSelectionModal;
