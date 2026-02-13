/**
 * i18n System
 * Lightweight custom internationalization for BackArch
 */

import enTranslations from './en.json';
import esTranslations from './es.json';

export type Language = 'en' | 'es';

type Translations = typeof enTranslations;
type DeepKeys<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${DeepKeys<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

export type TranslationKey = DeepKeys<Translations>;

const translations: Record<Language, Translations> = {
  en: enTranslations,
  es: esTranslations,
};

let currentLanguage: Language = 'en';

/**
 * Initialize i18n system
 * Loads persisted language from localStorage
 */
export function initI18n(): Language {
  const stored = localStorage.getItem('backarch-language');
  if (stored === 'en' || stored === 'es') {
    currentLanguage = stored;
  }
  return currentLanguage;
}

/**
 * Set current language
 * Persists choice to localStorage
 */
export function setLanguage(lang: Language): void {
  currentLanguage = lang;
  localStorage.setItem('backarch-language', lang);
}

/**
 * Get current language
 */
export function getLanguage(): Language {
  return currentLanguage;
}

/**
 * Translate a key to the current language
 * @param key - Translation key (e.g., "validation.title")
 * @returns Translated string
 */
export function t(key: TranslationKey): string {
  const keys = key.split('.');
  let value: unknown = translations[currentLanguage];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  }

  return typeof value === 'string' ? value : key;
}

/**
 * React hook for translations
 * Returns the translation function that re-renders on language change
 */
export function useTranslation() {
  return { t, language: currentLanguage };
}
