import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrder } from '../../api/orders';
import { Order } from '../../types';
import Badge from '../../components/UI/Badge';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { formatCurrency, formatDateTime, getStatusColor, getStatusLabel } from '../../utils/formatters';
import styles from './OrderDetailPage.module.css';

const OrderDetailPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber) return;
    getOrder(orderNumber!).then(setOrder).catch(() => {}).finally(() => setLoading(false));
  }, [orderNumber]);

  if (loading) return <LoadingSpinner />;
  if (!order) return <div className={styles.container}><p>Order not found.</p></div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.orderNumber}>Order #{order.order_number}</span>
        <Badge variant={getStatusColor(order.status) as any}>{getStatusLabel(order.status)}</Badge>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Order Details</h3>
          <div className={styles.infoRow}><span className={styles.infoLabel}>Date</span><span>{formatDateTime(order.created_at)}</span></div>
          <div className={styles.infoRow}><span className={styles.infoLabel}>Payment</span><span>{order.payment_method}</span></div>
          {order.tracking_number && (
            <div className={styles.infoRow}><span className={styles.infoLabel}>Tracking</span><span>{order.tracking_company} - {order.tracking_number}</span></div>
          )}
          {order.notes && <div className={styles.infoRow}><span className={styles.infoLabel}>Notes</span><span>{order.notes}</span></div>}
        </div>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Shipping Address</h3>
          <div className={styles.infoRow}><span className={styles.infoLabel}>Name</span><span>{order.shipping_name}</span></div>
          <div className={styles.infoRow}><span className={styles.infoLabel}>Email</span><span>{order.shipping_email}</span></div>
          <div className={styles.infoRow}><span className={styles.infoLabel}>Phone</span><span>{order.shipping_phone}</span></div>
          <div className={styles.infoRow}><span className={styles.infoLabel}>Address</span><span>{order.shipping_address}</span></div>
          <div className={styles.infoRow}><span className={styles.infoLabel}>City</span><span>{order.shipping_city} {order.shipping_postal_code}</span></div>
          <div className={styles.infoRow}><span className={styles.infoLabel}>Country</span><span>{order.shipping_country}</span></div>
        </div>
      </div>

      <table className={styles.table}>
        <thead><tr><th>Product</th><th>SKU</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
        <tbody>
          {order.items?.map(item => (
            <tr key={item.id}>
              <td>{item.product_name}</td>
              <td>{item.product_sku}</td>
              <td>{item.quantity}</td>
              <td>{formatCurrency(item.unit_price)}</td>
              <td><strong>{formatCurrency(item.total)}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.totals}>
        <div className={styles.totalRow}><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
        <div className={styles.totalRow}><span>Tax (IVA)</span><span>{formatCurrency(order.tax)}</span></div>
        <div className={styles.totalRow}><span>Shipping</span><span>{formatCurrency(order.shipping_cost)}</span></div>
        <div className={styles.totalFinal}><span>Total</span><span>{formatCurrency(order.total)}</span></div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
