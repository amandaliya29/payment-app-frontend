import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en from './locales/en.json';
import hi from './locales/hi.json';
import gu from './locales/gu.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  gu: { translation: gu },
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  lng: RNLocalize.getLocales()[0].languageCode || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
