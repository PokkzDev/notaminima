'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  // Always start with 'light' to match SSR, then sync in useEffect
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Sync state with DOM (blocking script already set the class)
    const hasDarkClass = document.documentElement.classList.contains('dark');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      setTheme(savedTheme);
      // Ensure DOM matches saved theme
      if ((savedTheme === 'dark') !== hasDarkClass) {
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      }
    } else {
      // Check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = systemPrefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      // Ensure DOM matches system preference
      if ((initialTheme === 'dark') !== hasDarkClass) {
        document.documentElement.classList.toggle('dark', initialTheme === 'dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Always provide the context, even during SSR
  // Use the current theme state (defaults to 'light' during SSR)
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

