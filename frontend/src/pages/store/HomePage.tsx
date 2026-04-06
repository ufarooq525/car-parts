import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTruck, FiShield, FiZap, FiArrowRight, FiSearch } from 'react-icons/fi';
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

    getProducts({ per_page: 6, sort: 'created_at', direction: 'desc' })
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
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>Premium Auto Parts</span>
          <h1 className={styles.heroTitle}>
            Find the Right Parts<br />
            <span className={styles.heroAccent}>for Your Vehicle</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Search by vehicle to find compatible, high-performance components instantly.
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
              <div
                key={cat.id}
                className={styles.categoryCard}
                onClick={() => navigate(`/products?category=${cat.id}`)}
                role="button"
                tabIndex={0}
              >
                <div className={styles.categoryIcon}>
                  <FiSearch size={24} />
                </div>
                <h3 className={styles.categoryName}>{cat.name}</h3>
                {cat.children && cat.children.length > 0 && (
                  <span className={styles.categoryCount}>
                    {cat.children.length} subcategories
                  </span>
                )}
              </div>
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
              <FiTruck size={32} />
            </div>
            <h3 className={styles.featureTitle}>Fast Delivery</h3>
            <p className={styles.featureText}>
              Express shipping across Europe. Get your parts in 1-3 business days.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FiShield size={32} />
            </div>
            <h3 className={styles.featureTitle}>Quality Guarantee</h3>
            <p className={styles.featureText}>
              OEM-grade components from trusted suppliers with full warranty.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FiZap size={32} />
            </div>
            <h3 className={styles.featureTitle}>Expert Support</h3>
            <p className={styles.featureText}>
              Technical assistance from automotive specialists available 24/7.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
