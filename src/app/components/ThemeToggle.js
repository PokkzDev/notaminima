'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from './ThemeProvider';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use a consistent initial icon to prevent hydration mismatch
  // Theme will be synced correctly after mount via ThemeProvider
  const icon = mounted ? (theme === 'light' ? faMoon : faSun) : faMoon;
  const ariaLabel = mounted 
    ? `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`
    : 'Switch theme';

  return (
    <button
      onClick={toggleTheme}
      className={styles.toggleButton}
      aria-label={ariaLabel}
      type="button"
    >
      <FontAwesomeIcon
        icon={icon}
        className={styles.icon}
      />
    </button>
  );
}







