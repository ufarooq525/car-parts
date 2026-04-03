import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTruck, FiLock, FiCheck, FiArrowRight } from 'react-icons/fi';
import { getCategoryTree } from '../../api/categories';
import { getProducts } from '../../api/products';
import { CategoryTree, ProductListItem } from '../../types';
import VehicleSelector from '../../components/Vehicle/VehicleSelector';
import ProductGrid from '../../components/Product/ProductGrid';
import Card from '../../components/UI/Card';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { useCart } from '../../contexts/CartContext';
import toast from 'react-hot-toast';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [categories, setCategories] = useState<CategoryTree[]>([]);
  const [latestProducts, setLatestProducts] = useState<ProductListItem[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    getCategoryTree()
      .then(setCategories)
      .catch(() => toast.error('Failed to load categories'))
      .finally(() => setLoadingCategories(false));

    getProducts({ per_page: 8, sort: 'created_at', direction: 'desc' })
      .then((res) => setLatestProducts(res.data))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoadingProducts(false));
  }, []);

  const handleAddToCart = async (productId: number) => {
    try {
      await addItem(productId);
      toast.success('Added to cart');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div className={styles.page}>
      {/* Hero Banner */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Find the Right Parts for Your Car</h1>
          <p className={styles.heroSubtitle}>
            Search by vehicle to find compatible parts quickly and easily.
          </p>
          <div className={styles.heroSelector}>
            <VehicleSelector />
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Shop by Category</h2>
          <Link to="/categories" className={styles.viewAll}>
            View All <FiArrowRight />
          </Link>
        </div>
        {loadingCategories ? (
          <LoadingSpinner text="Loading categories..." />
        ) : (
          <div className={styles.categoryGrid}>
            {categories.slice(0, 8).map((cat) => (
              <Card
                key={cat.id}
                className={styles.categoryCard}
                onClick={() => navigate(`/categories/${cat.slug}`)}
              >
                <div className={styles.categoryImagePlaceholder}>
                  <FiTruck size={32} />
                </div>
                <h3 className={styles.categoryName}>{cat.name}</h3>
                {cat.children && cat.children.length > 0 && (
                  <span className={styles.categoryCount}>
                    {cat.children.length} subcategories
                  </span>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Latest Products */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Latest Products</h2>
          <Link to="/products" className={styles.viewAll}>
            View All <FiArrowRight />
          </Link>
        </div>
        <ProductGrid
          products={latestProducts}
          onAddToCart={handleAddToCart}
          loading={loadingProducts}
        />
      </section>

      {/* Why Choose Us */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Why Choose Us</h2>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FiTruck size={36} />
            </div>
            <h3 className={styles.featureTitle}>Fast Delivery</h3>
            <p className={styles.featureText}>
              Quick and reliable shipping to get your parts to you as soon as possible.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FiLock size={36} />
            </div>
            <h3 className={styles.featureTitle}>Quality Parts</h3>
            <p className={styles.featureText}>
              Sourced from trusted suppliers to ensure reliability and performance.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FiCheck size={36} />
            </div>
            <h3 className={styles.featureTitle}>Secure Payment</h3>
            <p className={styles.featureText}>
              Multiple payment options with encrypted and secure transactions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
