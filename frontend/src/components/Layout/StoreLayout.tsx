import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiMenu, FiX, FiTruck } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { getMakes, getModels, getYears, YearRange } from '../../api/vehicles';
import ThemeToggle from '../UI/ThemeToggle';
import styles from './StoreLayout.module.css';

const StoreLayout: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Vehicle search state
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [years, setYears] = useState<YearRange[]>([]);
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    getMakes()
      .then(setMakes)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedMake) {
      setSelectedModel('');
      setSelectedYear('');
      setModels([]);
      setYears([]);
      getModels(selectedMake)
        .then(setModels)
        .catch(() => {});
    }
  }, [selectedMake]);

  useEffect(() => {
    if (selectedMake && selectedModel) {
      setSelectedYear('');
      setYears([]);
      getYears(selectedMake, selectedModel)
        .then(setYears)
        .catch(() => {});
    }
  }, [selectedMake, selectedModel]);

  const handleVehicleSearch = () => {
    const params = new URLSearchParams();
    if (selectedMake) params.set('make', selectedMake);
    if (selectedModel) params.set('model', selectedModel);
    if (selectedYear) params.set('year', selectedYear);
    navigate(`/products?${params.toString()}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className={styles.layout}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <Link to="/" className={styles.logo}>
            <FiTruck />
            Car Parts <span className={styles.logoAccent}>Store</span>
          </Link>

          <button
            className={styles.mobileMenuBtn}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>

          <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ''}`}>
            <NavLink
              to="/"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </NavLink>
            <NavLink
              to="/categories"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Categories
            </NavLink>
          </nav>

          <div className={styles.headerActions}>
            <ThemeToggle />
            <button className={styles.cartButton} onClick={() => navigate('/cart')} aria-label="Cart">
              <FiShoppingCart />
              {itemCount > 0 && <span className={styles.cartBadge}>{itemCount}</span>}
            </button>

            {isAuthenticated ? (
              <>
                <Link to="/profile" className={styles.authLink}>
                  {user?.name}
                </Link>
                <span className={styles.authDivider}>|</span>
                <button className={styles.authButton} onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.authLink}>
                  Login
                </Link>
                <span className={styles.authDivider}>|</span>
                <Link to="/register" className={styles.authLink}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Vehicle search bar */}
        <div className={styles.vehicleBar}>
          <div className={styles.vehicleBarInner}>
            <span className={styles.vehicleLabel}>
              <FiTruck /> Find parts for your vehicle:
            </span>
            <select
              className={styles.vehicleSelect}
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
            >
              <option value="">Select Make</option>
              {makes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              className={styles.vehicleSelect}
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!selectedMake}
            >
              <option value="">Select Model</option>
              {models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              className={styles.vehicleSelect}
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              disabled={!selectedModel}
            >
              <option value="">Select Year</option>
              {years.map((y) => (
                <option key={`${y.year_from}-${y.year_to}`} value={String(y.year_from)}>
                  {y.year_from === y.year_to ? y.year_from : `${y.year_from}-${y.year_to}`}
                </option>
              ))}
            </select>
            <button
              className={styles.vehicleSearchBtn}
              onClick={handleVehicleSearch}
              disabled={!selectedMake}
            >
              Search Parts
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}><Outlet /></main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span className={styles.footerCopyright}>
            &copy; {new Date().getFullYear()} Car Parts Store. All rights reserved.
          </span>
          <div className={styles.footerLinks}>
            <Link to="/about" className={styles.footerLink}>
              About Us
            </Link>
            <Link to="/contact" className={styles.footerLink}>
              Contact
            </Link>
            <Link to="/privacy" className={styles.footerLink}>
              Privacy Policy
            </Link>
            <Link to="/terms" className={styles.footerLink}>
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StoreLayout;
