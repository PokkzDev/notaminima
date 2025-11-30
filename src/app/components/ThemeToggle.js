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
  const getIcon = () => {
    if (!mounted) return faMoon;
    return theme === 'light' ? faMoon : faSun;
  };

  const getAriaLabel = () => {
    if (!mounted) return 'Switch theme';
    const targetMode = theme === 'light' ? 'dark' : 'light';
    return `Switch to ${targetMode} mode`;
  };

  const icon = getIcon();
  const ariaLabel = getAriaLabel();

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







