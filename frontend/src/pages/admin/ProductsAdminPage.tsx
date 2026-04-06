import React, { useCallback, useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiPackage, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Table from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import SearchBar from '../../components/UI/SearchBar';
import Select from '../../components/UI/Select';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Pagination from '../../components/UI/Pagination';
import Modal from '../../components/UI/Modal';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../../api/products';
import { getCategories } from '../../api/categories';
import { getVehicles } from '../../api/vehicles';
import { ProductListItem, Category, Vehicle } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import styles from './ProductsAdminPage.module.css';

interface ProductFormData {
  name: string;
  sku: string;
  category_id: string;
  description: string;
  cost_price: string;
  sell_price: string;
  stock_quantity: string;
  is_active: boolean;
  is_visible: boolean;
  image: File | null;
  vehicle_ids: number[];
}

const initialFormData: ProductFormData = {
  name: '',
  sku: '',
  category_id: '',
  description: '',
  cost_price: '',
  sell_price: '',
  stock_quantity: '',
  is_active: true,
  is_visible: true,
  image: null,
  vehicle_ids: [],
};

const ProductsAdminPage: React.FC = () => {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);

  // Delete modal
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; product: ProductListItem | null }>({
    open: false,
    product: null,
  });
  const [deleting, setDeleting] = useState(false);

  // Product form modal
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProductListItem | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [formLoading, setFormLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  // --- Form modal handlers ---
  const openCreate = async () => {
    setEditing(null);
    setFormData(initialFormData);
    setImagePreview(null);
    setFormModalOpen(true);
    await loadFormData();
  };

  const openEdit = async (item: ProductListItem) => {
    setEditing(item);
    setFormModalOpen(true);
    setFormLoading(true);
    try {
      const [product, vehRes] = await Promise.all([
        getProduct(String(item.id)),
        vehicles.length === 0 ? getVehicles({ per_page: 200 }) : Promise.resolve(null),
      ]);
      if (vehRes) setVehicles(vehRes.data);

      setFormData({
        name: product.name,
        sku: product.sku,
        category_id: product.category?.id?.toString() || '',
        description: product.description || '',
        cost_price: product.cost_price.toString(),
        sell_price: product.sell_price.toString(),
        stock_quantity: product.stock_quantity.toString(),
        is_active: product.is_active,
        is_visible: product.is_visible,
        image: null,
        vehicle_ids: product.vehicles?.map((v: Vehicle) => v.id) || [],
      });
      setImagePreview(product.image_url || null);
    } catch (error) {
      toast.error('Failed to load product data');
      setFormModalOpen(false);
    } finally {
      setFormLoading(false);
    }
  };

  const loadFormData = async () => {
    if (vehicles.length > 0) return;
    setFormLoading(true);
    try {
      const vehRes = await getVehicles({ per_page: 200 });
      setVehicles(vehRes.data);
    } catch (error) {
      // silent - vehicles optional
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleVehicleToggle = (vehicleId: number) => {
    setFormData((prev) => ({
      ...prev,
      vehicle_ids: prev.vehicle_ids.includes(vehicleId)
        ? prev.vehicle_ids.filter((id) => id !== vehicleId)
        : [...prev.vehicle_ids, vehicleId],
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('sku', formData.sku);
      if (formData.category_id) fd.append('category_id', formData.category_id);
      fd.append('description', formData.description);
      fd.append('cost_price', formData.cost_price);
      fd.append('sell_price', formData.sell_price);
      fd.append('stock_quantity', formData.stock_quantity);
      fd.append('is_active', formData.is_active ? '1' : '0');
      fd.append('is_visible', formData.is_visible ? '1' : '0');
      if (formData.image) fd.append('image', formData.image);
      formData.vehicle_ids.forEach((vid) => fd.append('vehicle_ids[]', vid.toString()));

      if (editing) {
        await updateProduct(editing.id, fd);
        toast.success('Product updated successfully');
      } else {
        await createProduct(fd);
        toast.success('Product created successfully');
      }
      setFormModalOpen(false);
      fetchProducts();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to save product';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // --- Delete handlers ---
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
            onClick={() => openEdit(item)}
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
        <Button variant="primary" onClick={openCreate}>
          <FiPlus /> Add Product
        </Button>
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

      {/* Product Form Modal */}
      <Modal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        title={editing ? 'Edit Product' : 'Create Product'}
        size="large"
        footer={
          <div className={styles.modalFooter}>
            <Button variant="outline" onClick={() => setFormModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleFormSubmit} loading={submitting}>
              <FiSave /> {editing ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        }
      >
        {formLoading ? (
          <LoadingSpinner text="Loading..." />
        ) : (
          <form onSubmit={handleFormSubmit} id="productForm">
            <div className={styles.formSection}>
              <h3 className={styles.formSectionTitle}>Product Details</h3>
              <div className={styles.formGrid}>
                <Input
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
                <Input
                  label="SKU"
                  name="sku"
                  value={formData.sku}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <Select
                label="Category"
                name="category_id"
                value={formData.category_id}
                onChange={handleFormChange}
                options={categoryOptions}
                placeholder="Select a category"
              />
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={4}
                  className={styles.textarea}
                />
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.formSectionTitle}>Pricing & Stock</h3>
              <div className={styles.formGridThree}>
                <Input
                  label="Cost Price"
                  name="cost_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cost_price}
                  onChange={handleFormChange}
                  required
                />
                <Input
                  label="Sell Price"
                  name="sell_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.sell_price}
                  onChange={handleFormChange}
                  required
                />
                <Input
                  label="Stock Quantity"
                  name="stock_quantity"
                  type="number"
                  min="0"
                  value={formData.stock_quantity}
                  onChange={handleFormChange}
                  required
                />
              </div>
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.formSectionTitle}>Status & Image</h3>
              <div className={styles.statusRow}>
                <label className={styles.toggleLabel}>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleFormChange}
                  />
                  <span>Active</span>
                </label>
                <label className={styles.toggleLabel}>
                  <input
                    type="checkbox"
                    name="is_visible"
                    checked={formData.is_visible}
                    onChange={handleFormChange}
                  />
                  <span>Visible</span>
                </label>
              </div>
              <div className={styles.imageRow}>
                {imagePreview && (
                  <div className={styles.imagePreview}>
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.fileInput}
                />
              </div>
            </div>

            {vehicles.length > 0 && (
              <div className={styles.formSection}>
                <h3 className={styles.formSectionTitle}>Vehicle Compatibility</h3>
                <div className={styles.vehicleList}>
                  {vehicles.map((vehicle) => (
                    <label key={vehicle.id} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={formData.vehicle_ids.includes(vehicle.id)}
                        onChange={() => handleVehicleToggle(vehicle.id)}
                      />
                      <span>
                        {vehicle.make} {vehicle.model} ({vehicle.year_from}-{vehicle.year_to})
                        {vehicle.engine ? ` - ${vehicle.engine}` : ''}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
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
