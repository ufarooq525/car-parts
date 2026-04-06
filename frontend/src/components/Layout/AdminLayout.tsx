import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import {
  FiGrid,
  FiPackage,
  FiFolder,
  FiTruck,
  FiSettings,
  FiShoppingBag,
  FiUsers,
  FiPercent,
  FiMenu,
  FiX,
  FiLogOut,
  FiExternalLink,
  FiUserCheck,
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../UI/ThemeToggle';
import styles from './AdminLayout.module.css';

const navItems = [
  { to: '/admin', icon: FiGrid, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: FiPackage, label: 'Products' },
  { to: '/admin/categories', icon: FiFolder, label: 'Categories' },
  { to: '/admin/suppliers', icon: FiTruck, label: 'Suppliers' },
  { to: '/admin/supplier-approvals', icon: FiUserCheck, label: 'Approvals' },
  { to: '/admin/vehicles', icon: FiSettings, label: 'Vehicles' },
  { to: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
  { to: '/admin/users', icon: FiUsers, label: 'Users' },
  { to: '/admin/margin-rules', icon: FiPercent, label: 'Margin Rules' },
];

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <Link to="/admin" className={styles.sidebarLogo}>
          <FiSettings />
          Admin <span className={styles.sidebarLogoAccent}>Panel</span>
        </Link>

        <nav className={styles.sidebarNav}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${styles.sidebarNavItem} ${isActive ? styles.sidebarNavItemActive : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className={styles.sidebarNavIcon} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Content */}
      <div className={styles.contentWrapper}>
        <div className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <button
              className={styles.menuToggle}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
          <div className={styles.topBarRight}>
            <Link to="/" className={styles.storeLink}>
              <FiExternalLink /> View Store
            </Link>
            <ThemeToggle />
            <span className={styles.userName}>{user?.name}</span>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <FiLogOut /> Logout
            </button>
          </div>
        </div>

        <main className={styles.main}><Outlet /></main>
      </div>
    </div>
  );
};

export default AdminLayout;
