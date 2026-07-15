import { useState, useEffect } from 'react';
import { saveTheme, getTheme } from './localData.js';

// Persists the user's Light/Dark preference in Local Storage (Module 2) and
// applies it globally via a data-theme attribute on <html>, which style.css
// reads to swap CSS variables.
export const useTheme = () => {
  const [theme, setTheme] = useState(() => getTheme());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
};
