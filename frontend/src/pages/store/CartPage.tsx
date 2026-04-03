import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/UI/Button';
import EmptyState from '../../components/UI/EmptyState';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters';
import styles from './CartPage.module.css';

const CartPage: React.FC = () => {
  const { cart, updateItem, removeItem, clearCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (loading) return <LoadingSpinner />;

  if (!cart || cart.items.length === 0) {
    return (
      <div className={styles.container}>
        <EmptyState
          icon={<FiShoppingBag size={48} />}
          title="Your cart is empty"
          message="Browse our products and add items to your cart."
          action={<Button variant="primary" onClick={() => navigate('/products')}>Browse Products</Button>}
        />
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = subtotal * 0.23;
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Shopping Cart</h1>
      <div className={styles.layout}>
        <div>
          <table className={styles.itemsTable}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map(item => (
                <tr key={item.id}>
                  <td>
                    <Link to={`/products/${item.product_id}`} className={styles.itemName}>
                      {item.product_name}
                    </Link>
                  </td>
                  <td>{formatCurrency(item.sell_price)}</td>
                  <td>
                    <div className={styles.quantityControl}>
                      <button className={styles.qtyBtn} onClick={() => updateItem(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                      <span className={styles.qtyValue}>{item.quantity}</span>
                      <button className={styles.qtyBtn} onClick={() => updateItem(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </td>
                  <td><strong>{formatCurrency(item.subtotal)}</strong></td>
                  <td>
                    <button className={styles.removeBtn} onClick={() => removeItem(item.id)}><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '1rem', textAlign: 'right' }}>
            <Button variant="outline" size="sm" onClick={clearCart}>Clear Cart</Button>
          </div>
        </div>
        <div className={styles.summary}>
          <h3 className={styles.summaryTitle}>Order Summary</h3>
          <div className={styles.summaryRow}><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
          <div className={styles.summaryRow}><span>Tax (23% IVA)</span><span>{formatCurrency(tax)}</span></div>
          <div className={styles.summaryTotal}><span>Total</span><span>{formatCurrency(total)}</span></div>
          <div className={styles.actions}>
            <Button variant="primary" fullWidth onClick={handleCheckout}>Proceed to Checkout</Button>
            <Link to="/products" className={styles.continueLink}>Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
