import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiChevronRight, FiFolder } from 'react-icons/fi';
import { getCategory } from '../../api/categories';
import { getProducts } from '../../api/products';
import { Category, ProductListItem } from '../../types';
import ProductGrid from '../../components/Product/ProductGrid';
import Card from '../../components/UI/Card';
import Pagination from '../../components/UI/Pagination';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import EmptyState from '../../components/UI/EmptyState';
import { useCart } from '../../contexts/CartContext';
import toast from 'react-hot-toast';
import styles from './CategoryPage.module.css';

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(false);
    getCategory(slug)
      .then((cat) => {
        setCategory(cat);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  const fetchProducts = useCallback(
    async (page: number = 1) => {
      if (!category) return;
      setLoadingProducts(true);
      try {
        const res = await getProducts({ category_id: category.id, page, per_page: 12 });
        setProducts(res.data);
        setCurrentPage(res.meta.current_page);
        setLastPage(res.meta.last_page);
      } catch {
        toast.error('Failed to load products');
      } finally {
        setLoadingProducts(false);
      }
    },
    [category]
  );

  useEffect(() => {
    if (category) {
      fetchProducts(1);
    }
  }, [category, fetchProducts]);

  const handlePageChange = (page: number) => {
    fetchProducts(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = async (productId: number) => {
    try {
      await addItem(productId);
      toast.success('Added to cart');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  if (loading) return <LoadingSpinner text="Loading category..." />;

  if (error || !category) {
    return (
      <EmptyState
        icon={<FiFolder size={48} />}
        title="Category not found"
        message="The category you are looking for does not exist."
        action={<Link to="/products">Browse Products</Link>}
      />
    );
  }

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <Link to="/" className={styles.breadcrumbLink}>Home</Link>
        <FiChevronRight className={styles.breadcrumbSep} />
        {category.parent && (
          <>
            <Link to={`/categories/${category.parent.slug}`} className={styles.breadcrumbLink}>
              {category.parent.name}
            </Link>
            <FiChevronRight className={styles.breadcrumbSep} />
          </>
        )}
        <span className={styles.breadcrumbCurrent}>{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>{category.name}</h1>
        {category.description && (
          <p className={styles.description}>{category.description}</p>
        )}
      </div>

      {/* Subcategories */}
      {category.children && category.children.length > 0 && (
        <section className={styles.subcategories}>
          <h2 className={styles.sectionTitle}>Subcategories</h2>
          <div className={styles.subcategoryGrid}>
            {category.children.map((child) => (
              <Card
                key={child.id}
                className={styles.subcategoryCard}
                onClick={() => navigate(`/categories/${child.slug}`)}
              >
                <FiFolder className={styles.subcategoryIcon} />
                <span className={styles.subcategoryName}>{child.name}</span>
                {child.products_count !== undefined && (
                  <span className={styles.subcategoryCount}>
                    {child.products_count} products
                  </span>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Products */}
      <section className={styles.productsSection}>
        <h2 className={styles.sectionTitle}>Products</h2>
        {loadingProducts ? (
          <LoadingSpinner text="Loading products..." />
        ) : products.length === 0 ? (
          <EmptyState
            title="No products yet"
            message="There are no products in this category."
          />
        ) : (
          <>
            <ProductGrid products={products} onAddToCart={handleAddToCart} />
            <div className={styles.paginationWrapper}>
              <Pagination
                currentPage={currentPage}
                lastPage={lastPage}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default CategoryPage;
