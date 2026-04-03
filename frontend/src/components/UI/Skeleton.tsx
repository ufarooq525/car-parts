import React from 'react';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '16px',
  borderRadius,
  className = '',
}) => (
  <div
    className={`${styles.skeleton} ${className}`}
    style={{ width, height, borderRadius }}
  />
);

export const SkeletonCard: React.FC = () => (
  <div className={styles.card}>
    <Skeleton height="200px" borderRadius="var(--radius-lg) var(--radius-lg) 0 0" />
    <div className={styles.cardBody}>
      <Skeleton height="14px" width="40%" />
      <Skeleton height="18px" width="80%" />
      <Skeleton height="14px" width="60%" />
      <div className={styles.cardFooter}>
        <Skeleton height="24px" width="30%" />
        <Skeleton height="38px" width="100%" borderRadius="var(--radius-md)" />
      </div>
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 5,
}) => (
  <div className={styles.table}>
    <div className={styles.tableHeader}>
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} height="14px" width={`${60 + Math.random() * 40}%`} />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className={styles.tableRow}>
        {Array.from({ length: cols }).map((_, j) => (
          <Skeleton key={j} height="14px" width={`${50 + Math.random() * 50}%`} />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonDashboard: React.FC = () => (
  <div className={styles.dashboard}>
    <div className={styles.statsGrid}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className={styles.statCard}>
          <Skeleton height="48px" width="48px" borderRadius="var(--radius-md)" />
          <div className={styles.statContent}>
            <Skeleton height="28px" width="60px" />
            <Skeleton height="14px" width="100px" />
          </div>
        </div>
      ))}
    </div>
    <SkeletonTable rows={5} cols={4} />
  </div>
);

export default Skeleton;
