import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en.json';
import translationID from './locales/id.json';

// Get saved language from localStorage, default to 'en'
const savedLanguage = localStorage.getItem('empathAI_lang') || 'en';

// the translations
const resources = {
  en: {
    translation: translationEN
  },
  id: {
    translation: translationID
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
