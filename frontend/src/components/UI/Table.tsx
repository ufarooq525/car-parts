import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import styles from './Table.module.css';

interface TableColumn<T = any> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
}

function Table<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data found.',
}: TableProps<T>) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr className={styles.loadingRow}>
              <td colSpan={columns.length}>
                <LoadingSpinner />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr className={styles.emptyRow}>
              <td colSpan={columns.length}>{emptyMessage}</td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={item.id ?? index}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(item) : item[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
