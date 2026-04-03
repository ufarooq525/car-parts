import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getOrder, updateOrderStatus } from '../../api/orders';
import { Order } from '../../types';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';
import Badge from '../../components/UI/Badge';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { formatCurrency, formatDateTime, getStatusColor, getStatusLabel } from '../../utils/formatters';
import styles from './Admin.module.css';

const OrderDetailAdminPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [tracking, setTracking] = useState({ tracking_number: '', tracking_company: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    // Admin endpoint uses order ID
    getOrder(id!).then(o => {
      setOrder(o); setNewStatus(o.status);
      setTracking({ tracking_number: o.tracking_number || '', tracking_company: o.tracking_company || '' });
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!order || !id) return;
    setSubmitting(true);
    try {
      await updateOrderStatus(parseInt(id!), { status: newStatus, ...tracking });
      toast.success('Order updated');
      const updated = await getOrder(id!);
      setOrder(updated);
    } catch (err: any) { toast.error(err?.response?.data?.message || 'Failed to update'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <LoadingSpinner />;
  if (!order) return <div className={styles.container}><p>Order not found.</p></div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Order #{order.order_number}</h1>
        <Badge variant={getStatusColor(order.status) as any}>{getStatusLabel(order.status)}</Badge>
      </div>

      <div className={styles.grid2}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Update Status</h3>
          <Select label="Status" value={newStatus} onChange={e => setNewStatus(e.target.value)} options={['pending','confirmed','processing','shipped','delivered','cancelled','refunded'].map(s => ({value:s,label:getStatusLabel(s)}))} />
          <Input label="Tracking Number" value={tracking.tracking_number} onChange={e => setTracking(p => ({...p, tracking_number: e.target.value}))} />
          <Input label="Tracking Company" value={tracking.tracking_company} onChange={e => setTracking(p => ({...p, tracking_company: e.target.value}))} />
          <div style={{marginTop:'1rem'}}><Button variant="primary" onClick={handleStatusUpdate} loading={submitting}>Update Order</Button></div>
        </div>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Customer & Shipping</h3>
          <div className={styles.infoRow}><span className={styles.infoLabel}>Name</span><span>{order.shipping_name}</span></div>
          <div className={styles.infoRow}><span className={styles.infoLabel}>Email</span><span>{order.shipping_email}</span></div>
          <div className={styles.infoRow}><span className={styles.infoLabel}>Phone</span><span>{order.shipping_phone}</span></div>
          <div className={styles.infoRow}><span className={styles.infoLabel}>Address</span><span>{order.shipping_address}</span></div>
          <div className={styles.infoRow}><span className={styles.infoLabel}>City</span><span>{order.shipping_city} {order.shipping_postal_code}</span></div>
          <div className={styles.infoRow}><span className={styles.infoLabel}>Date</span><span>{formatDateTime(order.created_at)}</span></div>
          <div className={styles.infoRow}><span className={styles.infoLabel}>Payment</span><span>{order.payment_method}</span></div>
        </div>
      </div>

      <div style={{marginTop:'1.5rem'}}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>Product</th><th>SKU</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
            <tbody>
              {order.items?.map(item => (
                <tr key={item.id}>
                  <td>{item.product_name}</td><td>{item.product_sku}</td>
                  <td>{item.quantity}</td><td>{formatCurrency(item.unit_price)}</td>
                  <td><strong>{formatCurrency(item.total)}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{maxWidth:'300px',marginLeft:'auto',marginTop:'1rem'}}>
          <div className={styles.infoRow}><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
          <div className={styles.infoRow}><span>Tax</span><span>{formatCurrency(order.tax)}</span></div>
          <div className={styles.infoRow}><span>Shipping</span><span>{formatCurrency(order.shipping_cost)}</span></div>
          <div className={styles.infoRow} style={{fontWeight:700,fontSize:'1.1rem',borderTop:'2px solid #1a1a2e',paddingTop:'0.5rem'}}><span>Total</span><span>{formatCurrency(order.total)}</span></div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailAdminPage;
