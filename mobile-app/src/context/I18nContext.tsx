import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import en from '../translations/en';
import vi from '../translations/vi';
import * as SecureStore from 'expo-secure-store';

const translations = { en, vi };
const i18n = new I18n(translations);

// Set default locale based on device settings, fallback to 'en'
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

interface I18nContextType {
  locale: string;
  setLocale: (locale: string) => Promise<void>;
  t: (key: string, options?: any) => string;
  isLanguageSet: boolean;
  completeLanguageSetup: () => Promise<void>;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState(i18n.locale);
  const [isLanguageSet, setIsLanguageSet] = useState(true); // Default true until checked

  useEffect(() => {
    loadLocale();
  }, []);

  const loadLocale = async () => {
    try {
      const storedLocale = await SecureStore.getItemAsync('user-locale');
      const hasSet = await SecureStore.getItemAsync('has-set-language');
      
      if (storedLocale) {
        setLocaleState(storedLocale);
        i18n.locale = storedLocale;
      } else {
        // Default to Vietnamese if no preference stored
        setLocaleState('vi');
        i18n.locale = 'vi';
      }
      
      setIsLanguageSet(hasSet === 'true');
    } catch (error) {
      console.error('Error loading locale', error);
      setIsLanguageSet(false);
    }
  };

  const setLocale = async (newLocale: string) => {
    i18n.locale = newLocale;
    setLocaleState(newLocale);
    await SecureStore.setItemAsync('user-locale', newLocale);
  };

  const completeLanguageSetup = async () => {
    setIsLanguageSet(true);
    await SecureStore.setItemAsync('has-set-language', 'true');
  };

  const t = (key: string, options?: any) => i18n.t(key, options);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isLanguageSet, completeLanguageSetup }}>
      {children}
    </I18nContext.Provider>
  );
};
