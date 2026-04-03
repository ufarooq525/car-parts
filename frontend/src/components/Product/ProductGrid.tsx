import React from 'react';
import { ProductListItem } from '../../types';
import ProductCard from './ProductCard';
import LoadingSpinner from '../UI/LoadingSpinner';
import styles from './ProductGrid.module.css';

interface ProductGridProps {
  products: ProductListItem[];
  onAddToCart?: (productId: number) => void;
  loading?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart, loading = false }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
};

export default ProductGrid;
