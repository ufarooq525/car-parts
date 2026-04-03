import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './ThemeToggle.module.css';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className={styles.iconWrapper}>
        <span className={`${styles.icon} ${styles.sunIcon} ${theme === 'light' ? styles.active : ''}`}>
          &#9728;
        </span>
        <span className={`${styles.icon} ${styles.moonIcon} ${theme === 'dark' ? styles.active : ''}`}>
          &#9790;
        </span>
      </span>
    </button>
  );
};

export default ThemeToggle;
