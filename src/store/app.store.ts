import { create } from 'zustand';
import { initI18n, setI18nLanguage, type Language } from '@/i18n/index.i18n';

interface AppState {
  // i18n
  language: Language;

  // Actions - i18n
  setLanguage: (lang: Language) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  language: initI18n(),

  // i18n actions
  setLanguage: (lang: Language) => {
    setI18nLanguage(lang);
    set({ language: lang });
  },
}));
