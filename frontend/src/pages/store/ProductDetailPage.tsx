import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingCart, FiMinus, FiPlus, FiChevronRight, FiPackage } from 'react-icons/fi';
import { getProduct } from '../../api/products';
import { Product } from '../../types';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import EmptyState from '../../components/UI/EmptyState';
import { useCart } from '../../contexts/CartContext';
import { formatCurrency } from '../../utils/formatters';
import toast from 'react-hot-toast';
import styles from './ProductDetailPage.module.css';

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(false);
    getProduct(slug)
      .then(setProduct)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      await addItem(product.id, quantity);
      toast.success('Added to cart');
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const inStock = product ? product.stock_quantity > 0 : false;

  if (loading) return <LoadingSpinner text="Loading product..." />;

  if (error || !product) {
    return (
      <EmptyState
        icon={<FiPackage size={48} />}
        title="Product not found"
        message="The product you are looking for does not exist or has been removed."
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
        {product.category && (
          <>
            <Link to={`/categories/${product.category.slug}`} className={styles.breadcrumbLink}>
              {product.category.name}
            </Link>
            <FiChevronRight className={styles.breadcrumbSep} />
          </>
        )}
        <span className={styles.breadcrumbCurrent}>{product.name}</span>
      </nav>

      <div className={styles.productLayout}>
        {/* Image */}
        <div className={styles.imageSection}>
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className={styles.productImage} />
          ) : (
            <div className={styles.imagePlaceholder}>
              <FiPackage size={80} />
              <span>No Image Available</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className={styles.detailsSection}>
          <h1 className={styles.productName}>{product.name}</h1>
          <p className={styles.sku}>SKU: {product.sku}</p>

          <div className={styles.priceRow}>
            <span className={styles.price}>{formatCurrency(product.sell_price)}</span>
            <Badge variant={inStock ? 'success' : 'danger'}>
              {inStock ? 'In Stock' : 'Out of Stock'}
            </Badge>
          </div>

          {/* Description */}
          {product.description && (
            <div className={styles.descriptionSection}>
              <h3 className={styles.sectionLabel}>Description</h3>
              <p className={styles.description}>{product.description}</p>
            </div>
          )}

          {/* Vehicle Compatibility */}
          {product.vehicles && product.vehicles.length > 0 && (
            <div className={styles.compatSection}>
              <h3 className={styles.sectionLabel}>Vehicle Compatibility</h3>
              <ul className={styles.vehicleList}>
                {product.vehicles.map((v) => (
                  <li key={v.id} className={styles.vehicleItem}>
                    {v.make} {v.model}{' '}
                    {v.year_from === v.year_to
                      ? v.year_from
                      : `${v.year_from}-${v.year_to}`}
                    {v.engine ? ` (${v.engine})` : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Add to Cart */}
          <div className={styles.cartActions}>
            <div className={styles.quantitySelector}>
              <button
                className={styles.qtyBtn}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={!inStock}
                aria-label="Decrease quantity"
              >
                <FiMinus />
              </button>
              <span className={styles.qtyValue}>{quantity}</span>
              <button
                className={styles.qtyBtn}
                onClick={() => setQuantity((q) => Math.min(product.stock_quantity, q + 1))}
                disabled={!inStock}
                aria-label="Increase quantity"
              >
                <FiPlus />
              </button>
            </div>
            <Button
              onClick={handleAddToCart}
              disabled={!inStock}
              loading={addingToCart}
              size="lg"
            >
              <FiShoppingCart /> Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
