import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import es from './locales/es.json';
import zh from './locales/zh.json';
import ru from './locales/ru.json';
import bn from './locales/bn.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            es: { translation: es },
            zh: { translation: zh },
            ru: { translation: ru },
            bn: { translation: bn },
        },
        lng: 'en', // Default language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // React already escapes
        },
    });

export default i18n;
