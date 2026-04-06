import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import StoreLayout from './components/Layout/StoreLayout';
import AdminLayout from './components/Layout/AdminLayout';

// Store pages
import HomePage from './pages/store/HomePage';
import ProductsPage from './pages/store/ProductsPage';
import ProductDetailPage from './pages/store/ProductDetailPage';
import CategoriesPage from './pages/store/CategoriesPage';
import CategoryPage from './pages/store/CategoryPage';
import CartPage from './pages/store/CartPage';
import CheckoutPage from './pages/store/CheckoutPage';
import OrdersPage from './pages/store/OrdersPage';
import OrderDetailPage from './pages/store/OrderDetailPage';
import AboutPage from './pages/store/AboutPage';
import ContactPage from './pages/store/ContactPage';
import PrivacyPage from './pages/store/PrivacyPage';
import TermsPage from './pages/store/TermsPage';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/auth/ProfilePage';

// Admin pages
import DashboardPage from './pages/admin/DashboardPage';
import ProductsAdminPage from './pages/admin/ProductsAdminPage';
import CategoriesAdminPage from './pages/admin/CategoriesAdminPage';
import SuppliersAdminPage from './pages/admin/SuppliersAdminPage';
import OrdersAdminPage from './pages/admin/OrdersAdminPage';
import OrderDetailAdminPage from './pages/admin/OrderDetailAdminPage';
import VehiclesAdminPage from './pages/admin/VehiclesAdminPage';
import UsersAdminPage from './pages/admin/UsersAdminPage';
import MarginRulesAdminPage from './pages/admin/MarginRulesAdminPage';

import './App.css';

function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--bg-elevated)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                boxShadow: 'var(--shadow-lg)',
              },
            }}
          />
          <Routes>
            {/* Public store routes */}
            <Route element={<StoreLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:slug" element={<ProductDetailPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/categories/:slug" element={<CategoryPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected customer routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/:orderNumber" element={<OrderDetailPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Route>

            {/* Admin routes */}
            <Route element={<ProtectedRoute requireAdmin />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<DashboardPage />} />
                <Route path="/admin/products" element={<ProductsAdminPage />} />
                <Route path="/admin/categories" element={<CategoriesAdminPage />} />
                <Route path="/admin/suppliers" element={<SuppliersAdminPage />} />
                <Route path="/admin/orders" element={<OrdersAdminPage />} />
                <Route path="/admin/orders/:id" element={<OrderDetailAdminPage />} />
                <Route path="/admin/vehicles" element={<VehiclesAdminPage />} />
                <Route path="/admin/users" element={<UsersAdminPage />} />
                <Route path="/admin/margin-rules" element={<MarginRulesAdminPage />} />
              </Route>
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
