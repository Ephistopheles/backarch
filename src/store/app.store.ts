import { create } from 'zustand';
import { initI18n, setI18nLanguage, type Language } from '@/i18n/index.i18n';
import {
  getArchitectureById,
  getStackById,
  getVersionsByStackId,
} from '@/core/stack/stack';

interface AppState {
  // Configuration
  selectedStack: string | null;
  selectedVersion: string | null;
  selectedArchitecture: string | null;

  // i18n
  language: Language;

  // Actions - configuration
  setStack: (stackId: string | null) => void;
  setVersion: (versionId: string | null) => void;
  setArchitecture: (architectureId: string | null) => void;

  // Actions - i18n
  setLanguage: (lang: Language) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state - configuration
  selectedStack: null,
  selectedVersion: null,
  selectedArchitecture: null,

  // Initial state
  language: initI18n(),

  // Actions - configuration
  setStack: (stackId: string | null) => {
    if (!stackId) {
      set({
        selectedStack: null,
        selectedVersion: null,
      });
      return;
    }
    const stack = getStackById(stackId);
    if (stack) {
      set({
        selectedStack: stackId,
        selectedVersion: null,
      });
    }
  },
  setVersion: (versionId: string | null) => {
    if (!versionId) {
      set({ selectedVersion: null });
      return;
    }
    set((state) => {
      if (!state.selectedStack) return state;
      const versions = getVersionsByStackId(state.selectedStack);
      const version = versions.find((v) => v.id === versionId);
      if (version) {
        return { selectedVersion: versionId };
      }
      return state;
    });
  },
  setArchitecture: (architectureId: string | null) => {
    if (!architectureId) {
      set({ selectedArchitecture: null });
      return;
    }
    const architecture = getArchitectureById(architectureId);
    if (architecture) {
      set({ selectedArchitecture: architectureId });
    }
  },

  // i18n actions
  setLanguage: (lang: Language) => {
    setI18nLanguage(lang);
    set({ language: lang });
  },
}));
