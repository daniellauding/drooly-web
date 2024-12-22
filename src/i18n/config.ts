import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Default translations to use while loading
const defaultResources = {
  en: {
    translation: {
      'home.hero.title': 'Search for almost anything',
      'home.hero.description': 'Explore recipes, find inspiration, and create your own dishes',
      'home.search.placeholder': 'Search recipes, ingredients, or paste a recipe URL...',
      'home.ai.assist': 'AI Assist',
      'home.kitchen.action': "What's in your kitchen?",
      'home.kitchen.description': 'Find recipes using ingredients you have',
      'home.cuisines.action': 'Explore cuisines',
      'home.cuisines.description': 'Discover recipes from around the world',
      'home.import.url.action': 'Import from URL',
      'home.import.url.description': 'Convert any recipe to your collection',
      'home.import.clipboard.action': 'Paste from clipboard',
      'home.import.clipboard.description': 'Import recipe from your clipboard'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: defaultResources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;