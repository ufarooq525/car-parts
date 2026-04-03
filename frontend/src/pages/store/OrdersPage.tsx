import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage } from 'react-icons/fi';
import { getMyOrders } from '../../api/orders';
import { OrderListItem, PaginatedResponse } from '../../types';
import Badge from '../../components/UI/Badge';
import Pagination from '../../components/UI/Pagination';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import EmptyState from '../../components/UI/EmptyState';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '../../utils/formatters';
import styles from './OrdersPage.module.css';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getMyOrders({ page }).then((res: PaginatedResponse<OrderListItem>) => {
      setOrders(res.data);
      setMeta(res.meta);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [page]);

  if (loading) return <LoadingSpinner />;

  if (orders.length === 0) {
    return (
      <div className={styles.container}>
        <EmptyState icon={<FiPackage size={48} />} title="No orders yet" message="You haven't placed any orders yet." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Orders</h1>
      <table className={styles.table}>
        <thead>
          <tr><th>Order #</th><th>Date</th><th>Status</th><th>Items</th><th>Total</th><th></th></tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td><strong>{o.order_number}</strong></td>
              <td>{formatDate(o.created_at)}</td>
              <td><Badge variant={getStatusColor(o.status) as any}>{getStatusLabel(o.status)}</Badge></td>
              <td>{o.items_count}</td>
              <td><strong>{formatCurrency(o.total)}</strong></td>
              <td><Link to={`/orders/${o.order_number}`} className={styles.viewLink}>View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
      {meta && <Pagination currentPage={meta.current_page} lastPage={meta.last_page} onPageChange={setPage} />}
    </div>
  );
};

export default OrdersPage;
