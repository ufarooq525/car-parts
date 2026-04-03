import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Table from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import SearchBar from '../../components/UI/SearchBar';
import Select from '../../components/UI/Select';
import Pagination from '../../components/UI/Pagination';
import Modal from '../../components/UI/Modal';
import EmptyState from '../../components/UI/EmptyState';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { getProducts, deleteProduct } from '../../api/products';
import { getCategories } from '../../api/categories';
import { ProductListItem, Category } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import styles from './ProductsAdminPage.module.css';

const ProductsAdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; product: ProductListItem | null }>({
    open: false,
    product: null,
  });
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = { page: currentPage, per_page: 15 };
      if (search) params.search = search;
      if (categoryFilter) params.category_id = categoryFilter;
      if (stockFilter) params.stock_status = stockFilter;

      const res = await getProducts(params);
      setProducts(res.data);
      setCurrentPage(res.meta.current_page);
      setLastPage(res.meta.last_page);
      setTotal(res.meta.total);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, categoryFilter, stockFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories({ per_page: 100 });
        setCategories(res.data);
      } catch (error) {
        // silent
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    if (!deleteModal.product) return;
    try {
      setDeleting(true);
      await deleteProduct(deleteModal.product.id);
      toast.success('Product deleted successfully');
      setDeleteModal({ open: false, product: null });
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  const getStockVariant = (qty: number): 'success' | 'warning' | 'danger' => {
    if (qty === 0) return 'danger';
    if (qty < 5) return 'warning';
    return 'success';
  };

  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (item: ProductListItem) => (
        <div className={styles.thumbnail}>
          {item.image_url ? (
            <img src={item.image_url} alt={item.name} className={styles.thumbnailImg} />
          ) : (
            <div className={styles.noImage}><FiPackage /></div>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      render: (item: ProductListItem) => (
        <div>
          <div className={styles.productName}>{item.name}</div>
          <div className={styles.productSku}>{item.sku}</div>
        </div>
      ),
    },
    { key: 'category_name', label: 'Category', render: (item: ProductListItem) => item.category_name || '-' },
    {
      key: 'sell_price',
      label: 'Price',
      render: (item: ProductListItem) => formatCurrency(item.sell_price),
    },
    {
      key: 'stock_quantity',
      label: 'Stock',
      render: (item: ProductListItem) => (
        <Badge variant={getStockVariant(item.stock_quantity)}>
          {item.stock_quantity}
        </Badge>
      ),
    },
    {
      key: 'is_visible',
      label: 'Status',
      render: (item: ProductListItem) => (
        <Badge variant={item.is_visible ? 'success' : 'default'}>
          {item.is_visible ? 'Visible' : 'Hidden'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item: ProductListItem) => (
        <div className={styles.actions}>
          <button
            className={styles.actionBtn}
            onClick={() => navigate(`/admin/products/${item.id}/edit`)}
            title="Edit"
          >
            <FiEdit2 />
          </button>
          <button
            className={`${styles.actionBtn} ${styles.deleteBtn}`}
            onClick={() => setDeleteModal({ open: true, product: item })}
            title="Delete"
          >
            <FiTrash2 />
          </button>
        </div>
      ),
    },
  ];

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));
  const stockOptions = [
    { value: 'in_stock', label: 'In Stock' },
    { value: 'low', label: 'Low Stock' },
    { value: 'out_of_stock', label: 'Out of Stock' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Products ({total})</h1>
        <Link to="/admin/products/create">
          <Button variant="primary">
            <FiPlus /> Add Product
          </Button>
        </Link>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchWrapper}>
          <SearchBar
            value={search}
            onChange={setSearch}
            onSearch={handleSearch}
            placeholder="Search products..."
          />
        </div>
        <Select
          options={categoryOptions}
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
          placeholder="All Categories"
        />
        <Select
          options={stockOptions}
          value={stockFilter}
          onChange={(e) => { setStockFilter(e.target.value); setCurrentPage(1); }}
          placeholder="All Stock"
        />
      </div>

      <Table columns={columns} data={products} loading={loading} emptyMessage="No products found." />

      <Pagination currentPage={currentPage} lastPage={lastPage} onPageChange={setCurrentPage} />

      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, product: null })}
        title="Delete Product"
        footer={
          <div className={styles.modalFooter}>
            <Button variant="outline" onClick={() => setDeleteModal({ open: false, product: null })}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>
              Delete
            </Button>
          </div>
        }
      >
        <p>
          Are you sure you want to delete <strong>{deleteModal.product?.name}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default ProductsAdminPage;
