import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiChevronDown } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getProducts } from '../../api/products';
import { getCategoryTree } from '../../api/categories';
import { getMakes, getModels, getYears, YearRange } from '../../api/vehicles';
import { ProductListItem, CategoryTree } from '../../types';
import ProductGrid from '../../components/Product/ProductGrid';
import Pagination from '../../components/UI/Pagination';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import EmptyState from '../../components/UI/EmptyState';
import { useCart } from '../../contexts/CartContext';
import styles from './ProductsPage.module.css';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
];

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem } = useCart();

  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage, setPerPage] = useState(12);

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('category') || '');
  const [selectedMake, setSelectedMake] = useState(searchParams.get('make') || '');
  const [selectedModel, setSelectedModel] = useState(searchParams.get('model') || '');
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('in_stock') === '1');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');

  // Filter options
  const [categories, setCategories] = useState<CategoryTree[]>([]);
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [years, setYears] = useState<YearRange[]>([]);

  // Selected category name for the page title
  const [activeCategoryName, setActiveCategoryName] = useState('');

  // Load filter options
  useEffect(() => {
    getCategoryTree().then(setCategories).catch(() => {});
    getMakes().then(setMakes).catch(() => {});
  }, []);

  // Find active category name
  useEffect(() => {
    if (categoryId && categories.length > 0) {
      const findCat = (cats: CategoryTree[]): string => {
        for (const c of cats) {
          if (String(c.id) === categoryId) return c.name;
          if (c.children) {
            const found = findCat(c.children);
            if (found) return found;
          }
        }
        return '';
      };
      setActiveCategoryName(findCat(categories));
    } else {
      setActiveCategoryName('');
    }
  }, [categoryId, categories]);

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
      const params: Record<string, any> = { page, per_page: perPage };
      if (search) params.search = search;
      if (categoryId) params.category_id = categoryId;
      if (selectedMake) params.make = selectedMake;
      if (selectedModel) params.model = selectedModel;
      if (selectedYear) params.year = selectedYear;
      if (minPrice) params.min_price = minPrice;
      if (maxPrice) params.max_price = maxPrice;
      if (inStockOnly) params.in_stock = 1;

      // Sort
      if (sortBy === 'price_low') { params.sort = 'sell_price'; params.direction = 'asc'; }
      else if (sortBy === 'price_high') { params.sort = 'sell_price'; params.direction = 'desc'; }
      else if (sortBy === 'name') { params.sort = 'name'; params.direction = 'asc'; }
      else { params.sort = 'created_at'; params.direction = 'desc'; }

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
  }, [search, categoryId, selectedMake, selectedModel, selectedYear, minPrice, maxPrice, inStockOnly, sortBy, perPage]);

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
    if (sortBy !== 'newest') params.set('sort', sortBy);
    setSearchParams(params, { replace: true });
  }, [search, categoryId, selectedMake, selectedModel, selectedYear, minPrice, maxPrice, inStockOnly, sortBy, setSearchParams]);

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

  const handleResetFilters = () => {
    setSearch('');
    setCategoryId('');
    setSelectedMake('');
    setSelectedModel('');
    setSelectedYear('');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setSortBy('newest');
  };

  const fromItem = total > 0 ? (currentPage - 1) * perPage + 1 : 0;
  const toItem = Math.min(currentPage * perPage, total);

  return (
    <div className={styles.page}>
      {/* Sidebar Filters */}
      <aside className={styles.sidebar}>
        <h3 className={styles.filterTitle}>FILTER RESULTS</h3>

        {/* Vehicle Configuration */}
        <div className={styles.filterSection}>
          <h4 className={styles.filterLabel}>Vehicle Configuration</h4>
          <div className={styles.filterSelect}>
            <select
              value={selectedMake}
              onChange={(e) => {
                setSelectedMake(e.target.value);
                setSelectedModel('');
                setSelectedYear('');
              }}
            >
              <option value="">Select Make</option>
              {makes.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <FiChevronDown className={styles.selectArrow} />
          </div>
          <div className={styles.filterSelect}>
            <select
              value={selectedModel}
              onChange={(e) => {
                setSelectedModel(e.target.value);
                setSelectedYear('');
              }}
              disabled={!selectedMake}
            >
              <option value="">Select Model</option>
              {models.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <FiChevronDown className={styles.selectArrow} />
          </div>
        </div>

        {/* Category */}
        <div className={styles.filterSection}>
          <h4 className={styles.filterLabel}>Category</h4>
          <div className={styles.categoryList}>
            {categories.map((cat) => (
              <label key={cat.id} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={categoryId === String(cat.id)}
                  onChange={(e) => setCategoryId(e.target.checked ? String(cat.id) : '')}
                />
                <span className={styles.checkmark} />
                <span>{cat.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className={styles.filterSection}>
          <h4 className={styles.filterLabel}>Price Range</h4>
          <div className={styles.priceInputs}>
            <input
              type="number"
              className={styles.priceInput}
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              min="0"
            />
            <span className={styles.priceSeparator}>/</span>
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

        {/* Availability */}
        <div className={styles.filterSection}>
          <h4 className={styles.filterLabel}>Availability</h4>
          <label className={styles.toggleLabel}>
            <span>In Stock Only</span>
            <div className={`${styles.toggle} ${inStockOnly ? styles.toggleActive : ''}`} onClick={() => setInStockOnly(!inStockOnly)}>
              <div className={styles.toggleKnob} />
            </div>
          </label>
        </div>

        <button className={styles.resetBtn} onClick={handleResetFilters}>
          RESET FILTERS
        </button>
      </aside>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Top Bar */}
        <div className={styles.topBar}>
          <div>
            <h1 className={styles.pageTitle}>
              {activeCategoryName || 'All Products'}
            </h1>
            <p className={styles.resultCount}>
              Showing {fromItem}-{toItem} of {total} parts
            </p>
          </div>

          <div className={styles.sortWrapper}>
            <span className={styles.sortLabel}>SORT BY</span>
            <div className={styles.sortSelect}>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <FiChevronDown className={styles.selectArrow} />
            </div>
          </div>
        </div>

        {loading ? (
          <div className={styles.loadingWrapper}>
            <LoadingSpinner text="Loading products..." />
          </div>
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
