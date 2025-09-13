import React, { createContext, useState, useContext } from 'react';
import vi from '../translations/vi';
import en from '../translations/en'; // We'll create this later if needed

const translations = {
  vi,
  en
};

const I18nContext = createContext();

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};

export const I18nProvider = ({ children }) => {
  const [language, setLanguage] = useState('vi'); // Default to Vietnamese

  const t = (key) => {
    return translations[language][key] || key;
  };

  const value = {
    t,
    language,
    setLanguage
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};