import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTruck, FiFolder } from 'react-icons/fi';
import { getCategoryTree } from '../../api/categories';
import { CategoryTree } from '../../types';
import Card from '../../components/UI/Card';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import EmptyState from '../../components/UI/EmptyState';
import toast from 'react-hot-toast';
import styles from './CategoriesPage.module.css';

const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryTree[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategoryTree()
      .then(setCategories)
      .catch(() => toast.error('Failed to load categories'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading categories..." />;

  if (categories.length === 0) {
    return (
      <EmptyState
        icon={<FiFolder size={48} />}
        title="No categories"
        message="There are no categories available yet."
      />
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>All Categories</h1>
        <p className={styles.subtitle}>Browse our full range of automotive parts by category</p>
      </div>

      <div className={styles.grid}>
        {categories.map((cat) => (
          <Card
            key={cat.id}
            className={styles.card}
            onClick={() => navigate(`/categories/${cat.slug}`)}
          >
            <div className={styles.iconWrapper}>
              <FiTruck size={32} />
            </div>
            <h2 className={styles.name}>{cat.name}</h2>
            {cat.children && cat.children.length > 0 && (
              <div className={styles.children}>
                {cat.children.map((child) => (
                  <span
                    key={child.id}
                    className={styles.childTag}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/categories/${child.slug}`);
                    }}
                  >
                    {child.name}
                  </span>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
