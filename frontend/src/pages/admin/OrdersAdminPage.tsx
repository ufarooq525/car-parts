import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../../api/orders';
import { OrderListItem, PaginatedResponse } from '../../types';
import Select from '../../components/UI/Select';
import Pagination from '../../components/UI/Pagination';
import Badge from '../../components/UI/Badge';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import SearchBar from '../../components/UI/SearchBar';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '../../utils/formatters';
import styles from './Admin.module.css';

const OrdersAdminPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = useCallback(() => {
    setLoading(true);
    getOrders({ page, search, status: statusFilter || undefined }).then((res: PaginatedResponse<OrderListItem>) => {
      setOrders(res.data); setMeta(res.meta);
    }).finally(() => setLoading(false));
  }, [page, search, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  return (
    <div className={styles.container}>
      <div className={styles.header}><h1 className={styles.title}>Orders</h1></div>
      <div className={styles.filters}>
        <SearchBar value={search} onChange={setSearch} onSearch={() => { setPage(1); fetchOrders(); }} placeholder="Search by order # or customer..." />
        <Select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} options={[{value:'',label:'All Statuses'},{value:'pending',label:'Pending'},{value:'confirmed',label:'Confirmed'},{value:'processing',label:'Processing'},{value:'shipped',label:'Shipped'},{value:'delivered',label:'Delivered'},{value:'cancelled',label:'Cancelled'}]} />
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>Order #</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} onClick={() => navigate(`/admin/orders/${o.id}`)} style={{cursor:'pointer'}}>
                  <td><strong>{o.order_number}</strong></td>
                  <td>{o.user_name}</td>
                  <td>{formatDate(o.created_at)}</td>
                  <td>{o.items_count}</td>
                  <td><strong>{formatCurrency(o.total)}</strong></td>
                  <td><Badge variant={getStatusColor(o.status) as any}>{getStatusLabel(o.status)}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {meta && <Pagination currentPage={meta.current_page} lastPage={meta.last_page} onPageChange={setPage} />}
    </div>
  );
};

export default OrdersAdminPage;
