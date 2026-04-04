import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../../api/products';
import { getCategoryTree } from '../../api/categories';
import { getMakes, getModels, getYears, YearRange } from '../../api/vehicles';
import { ProductListItem, CategoryTree } from '../../types';
import ProductGrid from '../../components/Product/ProductGrid';
import SearchBar from '../../components/UI/SearchBar';
import Select from '../../components/UI/Select';
import Pagination from '../../components/UI/Pagination';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import EmptyState from '../../components/UI/EmptyState';
import { useCart } from '../../contexts/CartContext';
import { FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import styles from './ProductsPage.module.css';

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem } = useCart();

  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Filter state from URL
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('category') || '');
  const [selectedMake, setSelectedMake] = useState(searchParams.get('make') || '');
  const [selectedModel, setSelectedModel] = useState(searchParams.get('model') || '');
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('in_stock') === '1');

  // Filter options
  const [categories, setCategories] = useState<CategoryTree[]>([]);
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [years, setYears] = useState<YearRange[]>([]);

  // Load filter options
  useEffect(() => {
    getCategoryTree().then(setCategories).catch(() => {});
    getMakes().then(setMakes).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedMake) {
      setModels([]);
      setYears([]);
      getModels(selectedMake).then(setModels).catch(() => {});
    } else {
      setModels([]);
      setYears([]);
    }
  }, [selectedMake]);

  useEffect(() => {
    if (selectedMake && selectedModel) {
      setYears([]);
      getYears(selectedMake, selectedModel).then(setYears).catch(() => {});
    } else {
      setYears([]);
    }
  }, [selectedMake, selectedModel]);

  const fetchProducts = useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const params: Record<string, any> = { page, per_page: 12 };
      if (search) params.search = search;
      if (categoryId) params.category_id = categoryId;
      if (selectedMake) params.make = selectedMake;
      if (selectedModel) params.model = selectedModel;
      if (selectedYear) params.year = selectedYear;
      if (minPrice) params.min_price = minPrice;
      if (maxPrice) params.max_price = maxPrice;
      if (inStockOnly) params.in_stock = 1;

      const res = await getProducts(params);
      setProducts(res.data);
      setCurrentPage(res.meta.current_page);
      setLastPage(res.meta.last_page);
      setTotal(res.meta.total);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [search, categoryId, selectedMake, selectedModel, selectedYear, minPrice, maxPrice, inStockOnly]);

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  // Sync filters to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (categoryId) params.set('category', categoryId);
    if (selectedMake) params.set('make', selectedMake);
    if (selectedModel) params.set('model', selectedModel);
    if (selectedYear) params.set('year', selectedYear);
    if (minPrice) params.set('min_price', minPrice);
    if (maxPrice) params.set('max_price', maxPrice);
    if (inStockOnly) params.set('in_stock', '1');
    setSearchParams(params, { replace: true });
  }, [search, categoryId, selectedMake, selectedModel, selectedYear, minPrice, maxPrice, inStockOnly, setSearchParams]);

  const handlePageChange = (page: number) => {
    fetchProducts(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = async (productId: number) => {
    try {
      await addItem(productId);
      toast.success('Added to cart');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const flattenCategories = (cats: CategoryTree[]): { value: string | number; label: string }[] => {
    const result: { value: string | number; label: string }[] = [];
    const walk = (items: CategoryTree[], prefix = '') => {
      items.forEach((c) => {
        result.push({ value: c.id, label: prefix + c.name });
        if (c.children) walk(c.children, prefix + '  ');
      });
    };
    walk(cats);
    return result;
  };

  return (
    <div className={styles.page}>
      <div className={styles.sidebar}>
        <h3 className={styles.filterTitle}>Filters</h3>

        <Select
          label="Category"
          name="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          options={flattenCategories(categories)}
          placeholder="All Categories"
        />

        <Select
          label="Make"
          name="make"
          value={selectedMake}
          onChange={(e) => {
            setSelectedMake(e.target.value);
            setSelectedModel('');
            setSelectedYear('');
          }}
          options={makes.map((m) => ({ value: m, label: m }))}
          placeholder="All Makes"
        />

        <Select
          label="Model"
          name="model"
          value={selectedModel}
          onChange={(e) => {
            setSelectedModel(e.target.value);
            setSelectedYear('');
          }}
          options={models.map((m) => ({ value: m, label: m }))}
          placeholder="All Models"
          disabled={!selectedMake}
        />

        <Select
          label="Year"
          name="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          options={years.map((y) => ({
            value: String(y.year_from),
            label: y.year_from === y.year_to ? String(y.year_from) : `${y.year_from} - ${y.year_to}`,
          }))}
          placeholder="All Years"
          disabled={!selectedModel}
        />

        <div className={styles.priceRange}>
          <label className={styles.priceLabel}>Price Range</label>
          <div className={styles.priceInputs}>
            <input
              type="number"
              className={styles.priceInput}
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              min="0"
            />
            <span className={styles.priceSeparator}>-</span>
            <input
              type="number"
              className={styles.priceInput}
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              min="0"
            />
          </div>
        </div>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
          />
          In Stock Only
        </label>
      </div>

      <div className={styles.content}>
        <div className={styles.topBar}>
          <SearchBar
            value={search}
            onChange={setSearch}
            onSearch={() => fetchProducts(1)}
            placeholder="Search products..."
          />
          <span className={styles.resultCount}>{total} products found</span>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading products..." />
        ) : products.length === 0 ? (
          <EmptyState
            icon={<FiSearch size={48} />}
            title="No products found"
            message="Try adjusting your filters or search term."
          />
        ) : (
          <>
            <ProductGrid products={products} onAddToCart={handleAddToCart} />
            <div className={styles.paginationWrapper}>
              <Pagination
                currentPage={currentPage}
                lastPage={lastPage}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
