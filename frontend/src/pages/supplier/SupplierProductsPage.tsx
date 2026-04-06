import React, { useCallback, useEffect, useState } from 'react';
import { FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Table from '../../components/UI/Table';
import Badge from '../../components/UI/Badge';
import SearchBar from '../../components/UI/SearchBar';
import Pagination from '../../components/UI/Pagination';
import EmptyState from '../../components/UI/EmptyState';
import { getSupplierProducts } from '../../api/suppliers';
import { formatCurrency } from '../../utils/formatters';
import styles from './SupplierDashboard.module.css';

const SupplierProductsPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = { page: currentPage, per_page: 15 };
      if (search) params.search = search;

      const res = await getSupplierProducts(params);
      setProducts(res.data);
      setCurrentPage(res.meta.current_page);
      setLastPage(res.meta.last_page);
      setTotal(res.meta.total);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [currentPage, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const columns = [
    {
      key: 'name',
      label: 'Product',
      render: (item: any) => (
        <div>
          <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.name}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.sku}</div>
        </div>
      ),
    },
    {
      key: 'sell_price',
      label: 'Price',
      render: (item: any) => formatCurrency(item.sell_price),
    },
    {
      key: 'stock_quantity',
      label: 'Stock',
      render: (item: any) => (
        <Badge variant={item.stock_quantity === 0 ? 'danger' : item.stock_quantity < 5 ? 'warning' : 'success'}>
          {item.stock_quantity}
        </Badge>
      ),
    },
    {
      key: 'is_visible',
      label: 'Status',
      render: (item: any) => (
        <Badge variant={item.is_visible ? 'success' : 'default'}>
          {item.is_visible ? 'Visible' : 'Hidden'}
        </Badge>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>My Products ({total})</h1>
      </div>

      <div style={{ maxWidth: 400, marginBottom: '1.5rem' }}>
        <SearchBar
          value={search}
          onChange={setSearch}
          onSearch={handleSearch}
          placeholder="Search products..."
        />
      </div>

      <Table columns={columns} data={products} loading={loading} emptyMessage="No products found." />
      <Pagination currentPage={currentPage} lastPage={lastPage} onPageChange={setCurrentPage} />
    </div>
  );
};

export default SupplierProductsPage;
