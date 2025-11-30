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

  // Don't render icon until mounted to prevent flash
  // The blocking script in layout.js sets the theme before hydration
  if (!mounted) {
    return (
      <button
        className={styles.toggleButton}
        aria-label="Switch theme"
        type="button"
        disabled
      >
        <span className={styles.iconPlaceholder} />
      </button>
    );
  }

  const getIcon = () => {
    return theme === 'light' ? faMoon : faSun;
  };

  const icon = getIcon();
  const targetMode = theme === 'light' ? 'dark' : 'light';
  const ariaLabel = `Switch to ${targetMode} mode`;

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







