import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Colors } from '@/constants/Colors';

type ThemeType = typeof Colors.light;

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (enabled: boolean) => void;
  colors: ThemeType;
  theme: 'light' | 'dark';
}

const THEME_STORAGE_KEY = 'app_theme_dark_mode';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkModeState] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadStoredTheme = async () => {
      try {
        const storedValue = await SecureStore.getItemAsync(THEME_STORAGE_KEY);
        if (storedValue !== null) {
          setIsDarkModeState(storedValue === 'true');
        }
      } catch (err) {
        console.error('Failed to load theme preference:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStoredTheme();
  }, []);

  const setDarkMode = async (enabled: boolean) => {
    setIsDarkModeState(enabled);
    try {
      await SecureStore.setItemAsync(THEME_STORAGE_KEY, String(enabled));
    } catch (err) {
      console.error('Failed to store theme preference:', err);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!isDarkMode);
  };

  const colors = isDarkMode ? Colors.dark : Colors.light;
  const theme = isDarkMode ? 'dark' : 'light';

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        setDarkMode,
        colors,
        theme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
