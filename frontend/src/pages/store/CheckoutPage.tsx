import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCart } from '../../contexts/CartContext';
import { createOrder } from '../../api/orders';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters';
import styles from './CheckoutPage.module.css';

const CheckoutPage: React.FC = () => {
  const { cart, loading: cartLoading, clearCart } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [form, setForm] = useState({
    shipping_name: '', shipping_email: '', shipping_phone: '',
    shipping_address: '', shipping_city: '', shipping_postal_code: '', shipping_country: 'Portugal',
    billing_address: '', billing_city: '', billing_postal_code: '', billing_country: 'Portugal',
    payment_method: 'card', notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = { ...form };
      if (sameAsBilling) {
        data.billing_address = data.shipping_address;
        data.billing_city = data.shipping_city;
        data.billing_postal_code = data.shipping_postal_code;
        data.billing_country = data.shipping_country;
      }
      const order = await createOrder(data);
      toast.success('Order placed successfully!');
      await clearCart();
      navigate(`/orders/${order.order_number}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartLoading) return <LoadingSpinner />;
  if (!cart || cart.items.length === 0) { navigate('/cart'); return null; }

  const subtotal = cart.items.reduce((sum, i) => sum + i.subtotal, 0);
  const tax = subtotal * 0.23;
  const total = subtotal + tax;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.layout}>
          <div>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Shipping Information</h3>
              <div className={styles.formGrid}>
                <Input label="Full Name" name="shipping_name" value={form.shipping_name} onChange={handleChange} required />
                <Input label="Email" name="shipping_email" type="email" value={form.shipping_email} onChange={handleChange} required />
                <Input label="Phone" name="shipping_phone" value={form.shipping_phone} onChange={handleChange} required />
                <Input label="Country" name="shipping_country" value={form.shipping_country} onChange={handleChange} required />
                <div className={styles.fullWidth}>
                  <Input label="Address" name="shipping_address" value={form.shipping_address} onChange={handleChange} required />
                </div>
                <Input label="City" name="shipping_city" value={form.shipping_city} onChange={handleChange} required />
                <Input label="Postal Code" name="shipping_postal_code" value={form.shipping_postal_code} onChange={handleChange} required />
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Billing Address</h3>
              <label className={styles.checkboxRow}>
                <input type="checkbox" checked={sameAsBilling} onChange={e => setSameAsBilling(e.target.checked)} />
                Same as shipping address
              </label>
              {!sameAsBilling && (
                <div className={styles.formGrid}>
                  <div className={styles.fullWidth}><Input label="Address" name="billing_address" value={form.billing_address} onChange={handleChange} required /></div>
                  <Input label="City" name="billing_city" value={form.billing_city} onChange={handleChange} required />
                  <Input label="Postal Code" name="billing_postal_code" value={form.billing_postal_code} onChange={handleChange} required />
                  <Input label="Country" name="billing_country" value={form.billing_country} onChange={handleChange} required />
                </div>
              )}
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Payment Method</h3>
              <div className={styles.paymentOptions}>
                {[{v:'card',l:'Credit Card'},{v:'paypal',l:'PayPal'},{v:'mbway',l:'MB Way'}].map(pm => (
                  <div key={pm.v} className={`${styles.paymentOption} ${form.payment_method === pm.v ? styles.paymentOptionSelected : ''}`} onClick={() => setForm(p => ({...p, payment_method: pm.v}))}>
                    <FiCheckCircle size={24} />
                    <div className={styles.paymentLabel}>{pm.l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Notes (Optional)</h3>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} style={{width:'100%',padding:'0.75rem',border:'1px solid #ddd',borderRadius:'6px',resize:'vertical'}} placeholder="Any special instructions..." />
            </div>
          </div>

          <div className={styles.summaryCard}>
            <h3 className={styles.sectionTitle}>Order Summary</h3>
            <div className={styles.orderItems}>
              {cart.items.map(item => (
                <div key={item.id} className={styles.orderItem}>
                  <span>{item.product_name} x{item.quantity}</span>
                  <span>{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
            </div>
            <div className={styles.summaryItem}><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
            <div className={styles.summaryItem}><span>Tax (23% IVA)</span><span>{formatCurrency(tax)}</span></div>
            <div className={styles.summaryTotal}><span>Total</span><span>{formatCurrency(total)}</span></div>
            <div style={{ marginTop: '1.5rem' }}>
              <Button variant="primary" fullWidth type="submit" loading={submitting}>Place Order</Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
