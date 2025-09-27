import React, { createContext, useState, useEffect } from 'react';
import i18n from './i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(i18n.language);

  // Load saved language on app start
  useEffect(() => {
    const loadLanguage = async () => {
      const savedLang = await AsyncStorage.getItem('appLanguage');
      if (savedLang) {
        i18n.changeLanguage(savedLang);
        setLanguage(savedLang);
      }
    };
    loadLanguage();
  }, []);

  const changeLanguage = async lang => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    await AsyncStorage.setItem('appLanguage', lang); // persist the selection
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
