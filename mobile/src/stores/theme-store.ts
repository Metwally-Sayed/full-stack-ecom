import { Appearance } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { darkColors, lightColors, type AppColors } from '@/constants/palette';

type ThemeMode = 'light' | 'dark';
const THEME_STORAGE_KEY = 'mobile-theme-mode';

type ThemeState = {
  mode: ThemeMode;
  colors: AppColors;
  hydrateTheme: () => Promise<void>;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
};

function getInitialMode(): ThemeMode {
  return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
}

function colorsFor(mode: ThemeMode): AppColors {
  return mode === 'dark' ? darkColors : lightColors;
}

export const useThemeStore = create<ThemeState>((set) => {
  const initialMode = getInitialMode();

  return {
    mode: initialMode,
    colors: colorsFor(initialMode),
    hydrateTheme: async () => {
      const storedMode = await SecureStore.getItemAsync(THEME_STORAGE_KEY);
      if (storedMode === 'light' || storedMode === 'dark') {
        set({ mode: storedMode, colors: colorsFor(storedMode) });
      }
    },
    toggleTheme: () =>
      set((state) => {
        const mode = state.mode === 'dark' ? 'light' : 'dark';
        void SecureStore.setItemAsync(THEME_STORAGE_KEY, mode);
        return { mode, colors: colorsFor(mode) };
      }),
    setTheme: (mode) => {
      void SecureStore.setItemAsync(THEME_STORAGE_KEY, mode);
      set({ mode, colors: colorsFor(mode) });
    },
  };
});

export function useThemeColors() {
  return useThemeStore((state) => state.colors);
}
