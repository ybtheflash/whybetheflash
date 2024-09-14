import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: { i_am: 'I am' } },
      ru: { translation: { i_am: 'Я' } },
      it: { translation: { i_am: 'Io sono' } },
      zh: { translation: { i_am: '我是' } },
      bn: { translation: { i_am: 'আমি' } },
      hi: { translation: { i_am: 'मैं हूँ' } },
      ja: { translation: { i_am: '私は' } },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;