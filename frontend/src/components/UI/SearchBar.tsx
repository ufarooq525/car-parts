import React, { useCallback } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
}) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        onSearch(value);
      }
    },
    [onSearch, value]
  );

  const handleClear = () => {
    onChange('');
    if (onSearch) onSearch('');
  };

  return (
    <div className={styles.wrapper}>
      <FiSearch className={styles.icon} />
      <input
        type="text"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      {value && (
        <button className={styles.clearBtn} onClick={handleClear} aria-label="Clear search">
          <FiX />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
