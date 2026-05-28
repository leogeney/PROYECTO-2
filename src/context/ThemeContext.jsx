// src/context/ThemeContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { THEMES } from '../styles/tokens';

const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {}
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('app-theme');
    if (saved) return saved;
    const a11y = localStorage.getItem('transi_a11y');
    if (a11y) {
      try { const p = JSON.parse(a11y); if (p.lightMode) return 'light' } catch {}
    }
    return 'dark';
  });

  // Apply CSS variables to :root based on current theme
  useEffect(() => {
    const themeVars = THEMES[theme] || THEMES.dark;
    const root = document.documentElement;
    Object.entries(themeVars).forEach(([key, value]) => {
      // key already includes '--t-...'
      root.style.setProperty(key, value);
    });
    // Save preference
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
