import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './locales/en.json';
import svTranslations from './locales/sv.json';

console.log('Initializing i18n with translations:', { en: enTranslations, sv: svTranslations });

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      sv: {
        translation: svTranslations
      }
    },
    fallbackLng: 'en',
    debug: true, // Enable debug mode to see more logs
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;