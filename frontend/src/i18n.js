// src/i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Configuración de i18next
i18n
  .use(HttpBackend) // Carga las traducciones usando HTTP
  .use(LanguageDetector) // Detecta el idioma del usuario
  .use(initReactI18next) // Integra i18next con React
  .init({
    fallbackLng: 'es', // Idioma por defecto si la detección falla
    debug: true, // Activa el modo de depuración (desactívalo en producción)

    ns: ['common', 'signin', 'completeProfile', 'eventCategories', 'filterForm', 'createEvent'], // Define los namespaces
    defaultNS: 'common', // Namespace por defecto

    interpolation: {
      escapeValue: false, // React ya escapa valores por defecto
    },

    backend: {
      // Ruta donde se encuentran los archivos de traducción
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    detection: {
      // Orden en el que se detecta el idioma
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],

      // Opciones específicas para cada método de detección
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage', 'cookie'], // Dónde almacenar la preferencia de idioma
      excludeCacheFor: ['cimode'], // No almacenar la preferencia para ciertos idiomas
    },

    react: {
      useSuspense: false, // Desactiva Suspense para evitar errores en SSR
    },
  });

export default i18n;
