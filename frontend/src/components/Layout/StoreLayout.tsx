import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  FiShoppingCart,
  FiMenu,
  FiX,
  FiHeart,
  FiUser,
  FiSearch,
  FiMail,
  FiGlobe,
  FiArrowRight,
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import ThemeToggle from '../UI/ThemeToggle';
import styles from './StoreLayout.module.css';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/products', label: 'Products' },
  { to: '/categories', label: 'Categories' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const StoreLayout: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className={styles.layout}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoText}>DEEPCAR</span>
            <span className={styles.logoAccent}>AUTO</span>
          </Link>

          <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ''}`}>
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <form className={styles.searchBar} onSubmit={handleSearch}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search components..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <div className={styles.headerActions}>
            <ThemeToggle />
            <button className={styles.iconBtn} onClick={() => navigate('/products')} aria-label="Wishlist">
              <FiHeart />
            </button>
            <button className={styles.iconBtn} onClick={() => navigate('/cart')} aria-label="Cart">
              <FiShoppingCart />
              {itemCount > 0 && <span className={styles.cartBadge}>{itemCount}</span>}
            </button>
            {isAuthenticated ? (
              <div className={styles.accountMenu}>
                <Link to="/profile" className={styles.accountLink}>
                  <FiUser />
                  <span>{user?.name?.split(' ')[0]}</span>
                </Link>
                <button className={styles.accountLogout} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className={styles.accountLink}>
                <FiUser />
                <span>Account</span>
              </Link>
            )}
            <button
              className={styles.mobileMenuBtn}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}><Outlet /></main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerCol}>
            <h3 className={styles.footerBrand}>DEEPCAR<span>AUTO</span></h3>
            <p className={styles.footerAbout}>
              Engineering excellence since 2024. Europe's leading curator for performance automotive hardware and precision components.
            </p>
            <div className={styles.footerSocial}>
              <a href="/" className={styles.socialIcon} aria-label="Website"><FiGlobe /></a>
              <a href="/" className={styles.socialIcon} aria-label="Email"><FiMail /></a>
            </div>
          </div>

          <div className={styles.footerCol}>
            <h4 className={styles.footerHeading}>SUPPORT</h4>
            <Link to="/about" className={styles.footerLink}>Shipping Policy</Link>
            <Link to="/terms" className={styles.footerLink}>Returns</Link>
            <Link to="/terms" className={styles.footerLink}>Warranty</Link>
          </div>

          <div className={styles.footerCol}>
            <h4 className={styles.footerHeading}>COMPANY</h4>
            <Link to="/contact" className={styles.footerLink}>Contact Us</Link>
            <Link to="/about" className={styles.footerLink}>About Us</Link>
            <Link to="/privacy" className={styles.footerLink}>Privacy</Link>
          </div>

          <div className={styles.footerCol}>
            <h4 className={styles.footerHeading}>NEWSLETTER</h4>
            <p className={styles.footerNewsText}>Technical updates & new releases.</p>
            <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email Address"
                className={styles.newsletterInput}
              />
              <button type="submit" className={styles.newsletterBtn}>
                <FiArrowRight />
              </button>
            </form>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span>&copy; {new Date().getFullYear()} DEEPCARAUTO. Engineering Excellence.</span>
        </div>
      </footer>
    </div>
  );
};

export default StoreLayout;
