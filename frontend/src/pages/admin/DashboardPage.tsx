import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiActivity, FiPackage, FiTruck, FiAlertTriangle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Card from '../../components/UI/Card';
import Table from '../../components/UI/Table';
import Badge from '../../components/UI/Badge';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { SkeletonDashboard } from '../../components/UI/Skeleton';
import { getOrders } from '../../api/orders';
import { getProducts } from '../../api/products';
import { getSuppliers } from '../../api/suppliers';
import { OrderListItem, ProductListItem, Supplier } from '../../types';
import { formatCurrency, formatDate, getStatusLabel } from '../../utils/formatters';
import styles from './DashboardPage.module.css';

const getOrderStatusVariant = (status: string): 'success' | 'warning' | 'danger' | 'info' | 'default' => {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
    pending: 'warning',
    confirmed: 'info',
    processing: 'info',
    shipped: 'info',
    delivered: 'success',
    cancelled: 'danger',
    refunded: 'default',
  };
  return map[status] || 'default';
};

const getSyncStatusVariant = (status: string): 'success' | 'warning' | 'danger' | 'info' | 'default' => {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
    completed: 'success',
    running: 'info',
    pending: 'warning',
    failed: 'danger',
  };
  return map[status] || 'default';
};

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<OrderListItem[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<ProductListItem[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalSuppliers: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [ordersRes, productsRes, lowStockRes, suppliersRes] = await Promise.all([
          getOrders({ per_page: 5 }),
          getProducts({ per_page: 1 }),
          getProducts({ per_page: 10, stock_status: 'low' }),
          getSuppliers({ per_page: 100 }),
        ]);

        setRecentOrders(ordersRes.data);
        setLowStockProducts(lowStockRes.data);
        setSuppliers(suppliersRes.data);

        setStats({
          totalOrders: ordersRes.meta.total,
          totalRevenue: ordersRes.data.reduce((sum, o) => sum + parseFloat(String(o.total)), 0),
          totalProducts: productsRes.meta.total,
          totalSuppliers: suppliersRes.meta.total,
        });
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const orderColumns = [
    { key: 'order_number', label: 'Order #', render: (item: OrderListItem) => (
      <Link to={`/admin/orders/${item.id}`} className={styles.link}>{item.order_number}</Link>
    )},
    { key: 'user_name', label: 'Customer' },
    { key: 'status', label: 'Status', render: (item: OrderListItem) => (
      <Badge variant={getOrderStatusVariant(item.status)}>{getStatusLabel(item.status)}</Badge>
    )},
    { key: 'total', label: 'Total', render: (item: OrderListItem) => formatCurrency(item.total) },
    { key: 'created_at', label: 'Date', render: (item: OrderListItem) => formatDate(item.created_at) },
  ];

  const lowStockColumns = [
    { key: 'name', label: 'Product', render: (item: ProductListItem) => (
      <Link to={`/admin/products/${item.id}/edit`} className={styles.link}>{item.name}</Link>
    )},
    { key: 'sku', label: 'SKU' },
    { key: 'stock_quantity', label: 'Stock', render: (item: ProductListItem) => (
      <Badge variant={item.stock_quantity === 0 ? 'danger' : 'warning'}>{item.stock_quantity}</Badge>
    )},
  ];

  const supplierSyncColumns = [
    { key: 'name', label: 'Supplier' },
    { key: 'sync_status', label: 'Last Sync Status', render: (item: Supplier) => (
      item.latest_sync ? (
        <Badge variant={getSyncStatusVariant(item.latest_sync.status)}>
          {item.latest_sync.status.charAt(0).toUpperCase() + item.latest_sync.status.slice(1)}
        </Badge>
      ) : (
        <Badge variant="default">Never</Badge>
      )
    )},
    { key: 'sync_date', label: 'Sync Date', render: (item: Supplier) => (
      item.latest_sync?.completed_at ? formatDate(item.latest_sync.completed_at) : 'N/A'
    )},
    { key: 'records', label: 'Records', render: (item: Supplier) => (
      item.latest_sync ? item.latest_sync.records_processed : '-'
    )},
  ];

  if (loading) {
    return <SkeletonDashboard />;
  }

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.pageTitle}>Dashboard</h1>

      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#eff6ff' }}>
            <FiShoppingCart size={24} color="#3b82f6" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.totalOrders}</span>
            <span className={styles.statLabel}>Total Orders</span>
          </div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#f0fdf4' }}>
            <FiActivity size={24} color="#10b981" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{formatCurrency(stats.totalRevenue)}</span>
            <span className={styles.statLabel}>Total Revenue</span>
          </div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#fdf4ff' }}>
            <FiPackage size={24} color="#8b5cf6" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.totalProducts}</span>
            <span className={styles.statLabel}>Total Products</span>
          </div>
        </Card>

        <Card className={styles.statCard}>
          <div className={styles.statIcon} style={{ backgroundColor: '#fefce8' }}>
            <FiTruck size={24} color="#f59e0b" />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statValue}>{stats.totalSuppliers}</span>
            <span className={styles.statLabel}>Total Suppliers</span>
          </div>
        </Card>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.mainContent}>
          <Card>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Recent Orders</h2>
              <Link to="/admin/orders" className={styles.viewAll}>View All</Link>
            </div>
            <Table columns={orderColumns} data={recentOrders} emptyMessage="No orders yet." />
          </Card>
        </div>

        <div className={styles.sidebar}>
          <Card>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <FiAlertTriangle color="#f59e0b" /> Low Stock
              </h2>
            </div>
            <Table columns={lowStockColumns} data={lowStockProducts} emptyMessage="All products are well stocked." />
          </Card>

          <Card>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Supplier Sync Status</h2>
            </div>
            <Table columns={supplierSyncColumns} data={suppliers} emptyMessage="No suppliers configured." />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
