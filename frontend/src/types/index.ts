// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

// Auth
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: 'admin' | 'staff' | 'customer' | 'supplier';
  is_active: boolean;
  supplier_id?: number | null;
  approval_status?: 'pending' | 'under_review' | 'approved' | 'rejected' | null;
  orders_count?: number;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

// Category
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parent_id: number | null;
  parent?: Category;
  children?: Category[];
  products_count?: number;
  is_active: boolean;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
}

export interface CategoryTree {
  id: number;
  name: string;
  slug: string;
  children?: CategoryTree[];
}

// Product
export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  category?: Category;
  cost_price: number;
  sell_price: number;
  stock_quantity: number;
  is_active: boolean;
  is_visible: boolean;
  image_url: string | null;
  vehicles?: Vehicle[];
  suppliers?: ProductSupplier[];
  created_at: string;
}

export interface ProductListItem {
  id: number;
  name: string;
  slug: string;
  sku: string;
  sell_price: number;
  stock_quantity: number;
  is_visible: boolean;
  image_url: string | null;
  category_name: string | null;
  created_at: string;
}

export interface ProductSupplier {
  id: number;
  supplier_id: number;
  supplier_name?: string;
  supplier_sku: string;
  cost_price: number;
  stock_quantity: number;
  last_synced_at: string | null;
}

// Vehicle
export interface Vehicle {
  id: number;
  make: string;
  model: string;
  year_from: number;
  year_to: number;
  engine: string | null;
  slug: string;
  products_count?: number;
}

// Supplier
export interface Supplier {
  id: number;
  name: string;
  code: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  business_license: string | null;
  tax_id: string | null;
  address: string | null;
  description: string | null;
  type: 'api' | 'xml' | 'csv' | 'none';
  api_endpoint: string | null;
  api_url: string | null;
  feed_url: string | null;
  csv_file_path: string | null;
  csv_original_name: string | null;
  sync_interval_minutes: number;
  is_active: boolean;
  approval_status: 'pending' | 'under_review' | 'approved' | 'rejected';
  rejection_reason: string | null;
  approved_at: string | null;
  products_count?: number;
  latest_sync?: SyncLog;
  created_at: string;
}

export interface SupplierRegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  company_name: string;
  contact_person: string;
  company_phone?: string;
  website?: string;
  business_license?: string;
  tax_id?: string;
  address?: string;
  description?: string;
  feed_type?: 'api' | 'xml' | 'csv' | '';
  api_url?: string;
  feed_url?: string;
  csv_file?: File;
}

export interface SupplierDashboardData {
  supplier: Supplier;
  stats: {
    products_count: number;
    approval_status: string;
    is_active: boolean;
    last_synced_at: string | null;
  };
}

export interface SyncLog {
  id: number;
  supplier_id: number;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  records_processed: number;
  errors: string | null;
  started_at: string | null;
  completed_at: string | null;
}

// Margin Rule
export interface MarginRule {
  id: number;
  supplier_id: number | null;
  supplier_name?: string;
  category_id: number | null;
  category_name?: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_price: number | null;
  max_price: number | null;
  priority: number;
}

// Order
export interface Order {
  id: number;
  order_number: string;
  user?: User;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  subtotal: number;
  tax: number;
  shipping_cost: number;
  total: number;
  shipping_name: string;
  shipping_email: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
  payment_method: string;
  tracking_number: string | null;
  tracking_company: string | null;
  notes: string | null;
  items?: OrderItem[];
  created_at: string;
}

export interface OrderListItem {
  id: number;
  order_number: string;
  status: string;
  total: number;
  items_count: number;
  user_name: string;
  created_at: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  total: number;
}

// Cart
export interface Cart {
  id: number;
  items: CartItem[];
  total: number;
}

export interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image: string | null;
  sell_price: number;
  quantity: number;
  subtotal: number;
}
