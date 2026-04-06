import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiPackage, FiHeart } from 'react-icons/fi';
import { ProductListItem } from '../../types';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: ProductListItem;
  onAddToCart?: (productId: number) => void;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(price);
};

const getStockLabel = (qty: number): { label: string; className: string } => {
  if (qty > 10) return { label: 'IN STOCK', className: styles.badgeInStock };
  if (qty > 0) return { label: 'LOW STOCK', className: styles.badgeLowStock };
  return { label: 'BACKORDER', className: styles.badgeBackorder };
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const inStock = product.stock_quantity > 0;
  const stock = getStockLabel(product.stock_quantity);

  return (
    <div className={styles.card}>
      <Link to={`/products/${product.slug}`} className={styles.imageWrapper}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className={styles.image}
            loading="lazy"
          />
        ) : (
          <div className={styles.placeholder}>
            <FiPackage />
          </div>
        )}
        <span className={`${styles.stockBadge} ${stock.className}`}>
          {stock.label}
        </span>
      </Link>

      <div className={styles.body}>
        <div className={styles.nameRow}>
          <h3 className={styles.name}>
            <Link to={`/products/${product.slug}`} className={styles.nameLink}>
              {product.name}
            </Link>
          </h3>
          <button className={styles.wishlistBtn} aria-label="Add to wishlist">
            <FiHeart />
          </button>
        </div>

        <span className={styles.sku}>SKU: {product.sku}</span>

        <div className={styles.priceRow}>
          <div className={styles.priceBlock}>
            {product.category_name && (
              <span className={styles.priceLabel}>{product.category_name}</span>
            )}
            <span className={styles.price}>{formatPrice(product.sell_price)}</span>
          </div>
          <button
            className={styles.addToCartBtn}
            onClick={() => onAddToCart?.(product.id)}
            disabled={!inStock}
            aria-label="Add to cart"
          >
            <FiShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
