import React, { useEffect, useState } from 'react';
import { FiPackage, FiRefreshCw, FiClock, FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { getSupplierDashboard } from '../../api/suppliers';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import Badge from '../../components/UI/Badge';
import Card from '../../components/UI/Card';
import { SupplierDashboardData } from '../../types';
import styles from './SupplierDashboard.module.css';

const SupplierDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<SupplierDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const result = await getSupplierDashboard();
        setData(result);
      } catch (error) {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;

  const approvalStatus = data?.stats.approval_status || user?.approval_status || 'pending';
  const isPending = approvalStatus === 'pending' || approvalStatus === 'under_review';
  const isRejected = approvalStatus === 'rejected';
  const isApproved = approvalStatus === 'approved';

  const getStatusBadge = () => {
    switch (approvalStatus) {
      case 'approved': return <Badge variant="success">Approved</Badge>;
      case 'rejected': return <Badge variant="danger">Rejected</Badge>;
      case 'under_review': return <Badge variant="warning">Under Review</Badge>;
      default: return <Badge variant="default">Pending Review</Badge>;
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Supplier Dashboard</h1>
          <p className={styles.welcomeText}>Welcome back, {user?.name}</p>
        </div>
        <div className={styles.statusBadge}>
          {getStatusBadge()}
        </div>
      </div>

      {/* Pending / Rejected Banner */}
      {isPending && (
        <div className={styles.banner}>
          <FiClock className={styles.bannerIcon} />
          <div>
            <strong>Application {approvalStatus === 'under_review' ? 'Under Review' : 'Pending'}</strong>
            <p>Our team is reviewing your application. You'll be notified once a decision is made. This usually takes 1-2 business days.</p>
          </div>
        </div>
      )}

      {isRejected && (
        <div className={`${styles.banner} ${styles.bannerDanger}`}>
          <FiXCircle className={styles.bannerIcon} />
          <div>
            <strong>Application Rejected</strong>
            <p>{data?.supplier.rejection_reason || 'Your application was not approved. Please contact support for more details.'}</p>
          </div>
        </div>
      )}

      {isApproved && (
        <div className={`${styles.banner} ${styles.bannerSuccess}`}>
          <FiCheckCircle className={styles.bannerIcon} />
          <div>
            <strong>Account Active</strong>
            <p>Your supplier account is approved and active. You can manage your products and feed settings.</p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><FiPackage /></div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{data?.stats.products_count ?? 0}</div>
            <div className={styles.statLabel}>Products</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><FiRefreshCw /></div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>
              {data?.stats.last_synced_at
                ? new Date(data.stats.last_synced_at).toLocaleDateString()
                : 'Never'}
            </div>
            <div className={styles.statLabel}>Last Sync</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><FiAlertCircle /></div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{data?.supplier.type?.toUpperCase() || '-'}</div>
            <div className={styles.statLabel}>Feed Type</div>
          </div>
        </div>
      </div>

      {/* Supplier Info */}
      {data?.supplier && (
        <Card>
          <div className={styles.infoSection}>
            <h2 className={styles.sectionTitle}>Company Information</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Company</span>
                <span className={styles.infoValue}>{data.supplier.name}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Code</span>
                <span className={styles.infoValue}>{data.supplier.code}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Contact</span>
                <span className={styles.infoValue}>{data.supplier.contact_person || '-'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>{data.supplier.email || '-'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Phone</span>
                <span className={styles.infoValue}>{data.supplier.phone || '-'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Website</span>
                <span className={styles.infoValue}>{data.supplier.website || '-'}</span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SupplierDashboardPage;
