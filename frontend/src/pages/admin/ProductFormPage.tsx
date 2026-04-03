import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';
import Card from '../../components/UI/Card';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { getProduct, createProduct, updateProduct } from '../../api/products';
import { getCategories } from '../../api/categories';
import { getVehicles } from '../../api/vehicles';
import { Product, Category, Vehicle } from '../../types';
import styles from './ProductFormPage.module.css';

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

const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [categories, setCategories] = useState<Category[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [catRes, vehRes] = await Promise.all([
          getCategories({ per_page: 100 }),
          getVehicles({ per_page: 200 }),
        ]);
        setCategories(catRes.data);
        setVehicles(vehRes.data);

        if (isEdit && id) {
          const product = await getProduct(id);
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
            vehicle_ids: product.vehicles?.map((v) => v.id) || [],
          });
          if (product.image_url) {
            setImagePreview(product.image_url);
          }
        }
      } catch (error) {
        toast.error('Failed to load form data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, isEdit]);

  const handleChange = (
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

  const handleSubmit = async (e: React.FormEvent) => {
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

      if (isEdit && id) {
        await updateProduct(parseInt(id), fd);
        toast.success('Product updated successfully');
      } else {
        await createProduct(fd);
        toast.success('Product created successfully');
      }
      navigate('/admin/products');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to save product';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading..." />;
  }

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Button variant="outline" onClick={() => navigate('/admin/products')}>
          <FiArrowLeft /> Back
        </Button>
        <h1 className={styles.pageTitle}>{isEdit ? 'Edit Product' : 'Create Product'}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.mainColumn}>
            <Card>
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>Product Details</h2>
                <div className={styles.fieldGrid}>
                  <Input
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="SKU"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Select
                  label="Category"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  options={categoryOptions}
                  placeholder="Select a category"
                />
                <div className={styles.formGroup}>
                  <label className={styles.label}>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className={styles.textarea}
                  />
                </div>
              </div>
            </Card>

            <Card>
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>Pricing & Stock</h2>
                <div className={styles.fieldGrid}>
                  <Input
                    label="Cost Price"
                    name="cost_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.cost_price}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Sell Price"
                    name="sell_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.sell_price}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Stock Quantity"
                    name="stock_quantity"
                    type="number"
                    min="0"
                    value={formData.stock_quantity}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </Card>

            <Card>
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>Vehicle Compatibility</h2>
                <div className={styles.vehicleList}>
                  {vehicles.length === 0 ? (
                    <p className={styles.emptyText}>No vehicles available.</p>
                  ) : (
                    vehicles.map((vehicle) => (
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
                    ))
                  )}
                </div>
              </div>
            </Card>
          </div>

          <div className={styles.sideColumn}>
            <Card>
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>Status</h2>
                <label className={styles.toggleLabel}>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                  />
                  <span>Active</span>
                </label>
                <label className={styles.toggleLabel}>
                  <input
                    type="checkbox"
                    name="is_visible"
                    checked={formData.is_visible}
                    onChange={handleChange}
                  />
                  <span>Visible</span>
                </label>
              </div>
            </Card>

            <Card>
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>Image</h2>
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
            </Card>

            <Button type="submit" variant="primary" fullWidth loading={submitting}>
              <FiSave /> {isEdit ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;
