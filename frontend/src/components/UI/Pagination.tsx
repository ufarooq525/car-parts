import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, lastPage, onPageChange }) => {
  if (lastPage <= 1) return null;

  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    const delta = 2;

    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(lastPage - 1, currentPage + delta);

    pages.push(1);

    if (rangeStart > 2) {
      pages.push('ellipsis');
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (rangeEnd < lastPage - 1) {
      pages.push('ellipsis');
    }

    if (lastPage > 1) {
      pages.push(lastPage);
    }

    return pages;
  };

  return (
    <div className={styles.pagination}>
      <button
        className={styles.pageBtn}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <FiChevronLeft />
      </button>

      {getPageNumbers().map((page, index) =>
        page === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className={styles.ellipsis}>
            ...
          </span>
        ) : (
          <button
            key={page}
            className={`${styles.pageBtn} ${currentPage === page ? styles.active : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      )}

      <button
        className={styles.pageBtn}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        aria-label="Next page"
      >
        <FiChevronRight />
      </button>
    </div>
  );
};

export default Pagination;
