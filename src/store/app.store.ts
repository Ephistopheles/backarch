import { create } from 'zustand';
import { initI18n, setI18nLanguage, type Language } from '@/i18n/index.i18n';

interface AppState {
  // i18n
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: initI18n(),
  setLanguage: (lang: Language) => {
    setI18nLanguage(lang);
    set({ language: lang });
  },
}));
