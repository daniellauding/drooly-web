import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { fetchTranslations } from '../services/translationService';

const initI18n = async () => {
  console.log('Initializing i18n');
  
  // Fetch initial translations
  const enTranslations = await fetchTranslations('en');
  const svTranslations = await fetchTranslations('sv');

  await i18n
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
      debug: true,
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage']
      },
      interpolation: {
        escapeValue: false
      }
    });
};

initI18n();

export default i18n;