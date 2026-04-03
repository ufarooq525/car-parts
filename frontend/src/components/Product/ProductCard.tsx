import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiPackage } from 'react-icons/fi';
import { ProductListItem } from '../../types';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: ProductListItem;
  onAddToCart?: (productId: number) => void;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const inStock = product.stock_quantity > 0;

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
        {product.category_name && (
          <span className={styles.categoryBadge}>{product.category_name}</span>
        )}
        <span className={`${styles.stockBadge} ${inStock ? styles.inStock : styles.outOfStock}`}>
          {inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </Link>

      <div className={styles.body}>
        <h3 className={styles.name}>
          <Link to={`/products/${product.slug}`} className={styles.nameLink}>
            {product.name}
          </Link>
        </h3>
        <span className={styles.sku}>SKU: {product.sku}</span>
        <span className={styles.price}>{formatPrice(product.sell_price)}</span>
        <button
          className={styles.addToCartBtn}
          onClick={() => onAddToCart?.(product.id)}
          disabled={!inStock}
        >
          <FiShoppingCart />
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
