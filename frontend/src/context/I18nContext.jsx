// context/I18nContext.jsx
import React, { createContext, useState, useContext, useCallback } from 'react';
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

  const t = useCallback((key, params = {}) => {
    let text = translations[language][key] || key;
    
    // Basic interpolation
    if (params) {
      Object.keys(params).forEach(param => {
        text = text.replace(new RegExp(`{{${param}}}`, 'g'), params[param]);
      });
    }
    
    return text;
  }, [language]);

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