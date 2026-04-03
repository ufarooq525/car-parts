import React from 'react';
import { FiChevronDown } from 'react-icons/fi';
import styles from './Select.module.css';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  name?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  placeholder,
  required,
  disabled,
  className,
  ...props
}) => {
  return (
    <div className={styles.formGroup}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.selectWrapper}>
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`${styles.select} ${error ? styles.selectError : ''} ${className || ''}`}
          {...props}
        >
          {placeholder && (
            <option value="" className={styles.placeholder}>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <FiChevronDown className={styles.chevron} />
      </div>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export default Select;
