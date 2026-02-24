import enTranslations from '@/i18n/en.json';
import esTranslations from '@/i18n/es.json';

export type Language = 'en' | 'es';

type Translations = typeof enTranslations;

/**
 * Recursive utility type to extract nested keys from an object
 * Limited to 3 levels of nesting to prevent TypeScript performance issues
 */
type DeepKeys<T, Depth extends number = 3> = Depth extends 0
  ? never
  : T extends object
    ? {
        [K in keyof T]: K extends string
          ? T[K] extends object
            ? T[K] extends Array<unknown>
              ? K
              : `${K}` | `${K}.${DeepKeys<T[K], DecreaseDepth<Depth>>}`
            : K
          : never;
      }[keyof T]
    : never;

type DecreaseDepth<D extends number> = D extends 3
  ? 2
  : D extends 2
    ? 1
    : D extends 1
      ? 0
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
export const initI18n = (): Language => {
  const stored = localStorage.getItem('backarch-language');
  if (stored === 'en' || stored === 'es') {
    currentLanguage = stored;
  }
  return currentLanguage;
};

/**
 * Set current language
 * Persists choice to localStorage
 */
export const setI18nLanguage = (lang: Language): void => {
  currentLanguage = lang;
  localStorage.setItem('backarch-language', lang);
};

/**
 * Get current language
 */
export function getI18nLanguage(): Language {
  return currentLanguage;
}

/**
 * Translate a key to the current language
 * Supports nested keys with dot notation (e.g., "header.stack.label")
 * @param key - Translation key
 * @param params - Optional parameters for string interpolation
 */
export const t = (
  key: TranslationKey,
  params?: Record<string, string | number>,
): string => {
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

  let result = typeof value === 'string' ? value : key;

  // Simple parameter interpolation: {{param}}
  if (params) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      result = result.replace(
        new RegExp(`{{${paramKey}}}`, 'g'),
        String(paramValue),
      );
    });
  }

  return result;
};
