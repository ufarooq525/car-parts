import React, { useCallback, useEffect, useState } from 'react';
import { FiCheckCircle, FiXCircle, FiEye, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Table from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Select from '../../components/UI/Select';
import SearchBar from '../../components/UI/SearchBar';
import Pagination from '../../components/UI/Pagination';
import Modal from '../../components/UI/Modal';
import Input from '../../components/UI/Input';
import { getPendingSuppliers, approveSupplier, rejectSupplier, markSupplierUnderReview } from '../../api/suppliers';
import { Supplier } from '../../types';
import styles from './SupplierApprovalsPage.module.css';

const SupplierApprovalsPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Detail modal
  const [detailModal, setDetailModal] = useState<{ open: boolean; supplier: Supplier | null }>({
    open: false,
    supplier: null,
  });

  // Reject modal
  const [rejectModal, setRejectModal] = useState<{ open: boolean; supplier: Supplier | null }>({
    open: false,
    supplier: null,
  });
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, any> = { page: currentPage, per_page: 15 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const res = await getPendingSuppliers(params);
      setSuppliers(res.data);
      setCurrentPage(res.meta.current_page);
      setLastPage(res.meta.last_page);
      setTotal(res.meta.total);
    } catch (error) {
      toast.error('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, statusFilter]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleApprove = async (supplier: Supplier) => {
    try {
      setProcessing(true);
      await approveSupplier(supplier.id);
      toast.success(`${supplier.name} approved successfully`);
      setDetailModal({ open: false, supplier: null });
      fetchSuppliers();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to approve supplier');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectModal.supplier || !rejectReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    try {
      setProcessing(true);
      await rejectSupplier(rejectModal.supplier.id, rejectReason);
      toast.success(`${rejectModal.supplier.name} rejected`);
      setRejectModal({ open: false, supplier: null });
      setRejectReason('');
      fetchSuppliers();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to reject supplier');
    } finally {
      setProcessing(false);
    }
  };

  const handleMarkReview = async (supplier: Supplier) => {
    try {
      await markSupplierUnderReview(supplier.id);
      toast.success(`${supplier.name} marked as under review`);
      fetchSuppliers();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge variant="success">Approved</Badge>;
      case 'rejected': return <Badge variant="danger">Rejected</Badge>;
      case 'under_review': return <Badge variant="warning">Under Review</Badge>;
      default: return <Badge variant="default">Pending</Badge>;
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Company',
      render: (item: Supplier) => (
        <div>
          <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.name}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.email}</div>
        </div>
      ),
    },
    { key: 'code', label: 'Code', render: (item: Supplier) => item.code },
    { key: 'contact_person', label: 'Contact', render: (item: Supplier) => item.contact_person || '-' },
    {
      key: 'type',
      label: 'Feed Type',
      render: (item: Supplier) => <Badge variant="default">{item.type.toUpperCase()}</Badge>,
    },
    {
      key: 'approval_status',
      label: 'Status',
      render: (item: Supplier) => getStatusBadge(item.approval_status),
    },
    {
      key: 'created_at',
      label: 'Applied',
      render: (item: Supplier) => new Date(item.created_at).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item: Supplier) => (
        <div className={styles.actions}>
          <button
            className={styles.actionBtn}
            onClick={() => setDetailModal({ open: true, supplier: item })}
            title="View Details"
          >
            <FiEye />
          </button>
          {item.approval_status === 'pending' && (
            <button
              className={`${styles.actionBtn} ${styles.reviewBtn}`}
              onClick={() => handleMarkReview(item)}
              title="Mark Under Review"
            >
              <FiClock />
            </button>
          )}
          {(item.approval_status === 'pending' || item.approval_status === 'under_review') && (
            <>
              <button
                className={`${styles.actionBtn} ${styles.approveBtn}`}
                onClick={() => handleApprove(item)}
                title="Approve"
              >
                <FiCheckCircle />
              </button>
              <button
                className={`${styles.actionBtn} ${styles.rejectBtn}`}
                onClick={() => { setRejectModal({ open: true, supplier: item }); setRejectReason(''); }}
                title="Reject"
              >
                <FiXCircle />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Supplier Approvals ({total})</h1>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchWrapper}>
          <SearchBar value={search} onChange={setSearch} onSearch={handleSearch} placeholder="Search suppliers..." />
        </div>
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          placeholder="All Statuses"
        />
      </div>

      <Table columns={columns} data={suppliers} loading={loading} emptyMessage="No supplier applications found." />
      <Pagination currentPage={currentPage} lastPage={lastPage} onPageChange={setCurrentPage} />

      {/* Detail Modal */}
      <Modal
        isOpen={detailModal.open}
        onClose={() => setDetailModal({ open: false, supplier: null })}
        title="Supplier Application Details"
        size="large"
        footer={
          detailModal.supplier && (detailModal.supplier.approval_status === 'pending' || detailModal.supplier.approval_status === 'under_review') ? (
            <div className={styles.modalFooter}>
              <Button variant="outline" onClick={() => setDetailModal({ open: false, supplier: null })}>Close</Button>
              <Button variant="danger" onClick={() => { setDetailModal({ open: false, supplier: null }); setRejectModal({ open: true, supplier: detailModal.supplier }); setRejectReason(''); }}>
                <FiXCircle /> Reject
              </Button>
              <Button variant="primary" onClick={() => handleApprove(detailModal.supplier!)} loading={processing}>
                <FiCheckCircle /> Approve
              </Button>
            </div>
          ) : (
            <div className={styles.modalFooter}>
              <Button variant="outline" onClick={() => setDetailModal({ open: false, supplier: null })}>Close</Button>
            </div>
          )
        }
      >
        {detailModal.supplier && (
          <div className={styles.detailGrid}>
            <div className={styles.detailSection}>
              <h3>Company Information</h3>
              <div className={styles.detailRow}><span>Company Name:</span><strong>{detailModal.supplier.name}</strong></div>
              <div className={styles.detailRow}><span>Code:</span><strong>{detailModal.supplier.code}</strong></div>
              <div className={styles.detailRow}><span>Contact Person:</span><strong>{detailModal.supplier.contact_person || '-'}</strong></div>
              <div className={styles.detailRow}><span>Email:</span><strong>{detailModal.supplier.email || '-'}</strong></div>
              <div className={styles.detailRow}><span>Phone:</span><strong>{detailModal.supplier.phone || '-'}</strong></div>
              <div className={styles.detailRow}><span>Website:</span><strong>{detailModal.supplier.website || '-'}</strong></div>
              <div className={styles.detailRow}><span>Business License:</span><strong>{detailModal.supplier.business_license || '-'}</strong></div>
              <div className={styles.detailRow}><span>Tax ID:</span><strong>{detailModal.supplier.tax_id || '-'}</strong></div>
              <div className={styles.detailRow}><span>Address:</span><strong>{detailModal.supplier.address || '-'}</strong></div>
            </div>
            <div className={styles.detailSection}>
              <h3>Feed Information</h3>
              <div className={styles.detailRow}><span>Feed Type:</span><strong>{detailModal.supplier.type.toUpperCase()}</strong></div>
              <div className={styles.detailRow}><span>API URL:</span><strong>{detailModal.supplier.api_url || '-'}</strong></div>
              <div className={styles.detailRow}><span>Feed URL:</span><strong>{detailModal.supplier.feed_url || '-'}</strong></div>
              <div className={styles.detailRow}><span>Status:</span>{getStatusBadge(detailModal.supplier.approval_status)}</div>
              <div className={styles.detailRow}><span>Applied:</span><strong>{new Date(detailModal.supplier.created_at).toLocaleString()}</strong></div>
            </div>
            {detailModal.supplier.description && (
              <div className={styles.detailSection}>
                <h3>Description</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>{detailModal.supplier.description}</p>
              </div>
            )}
            {detailModal.supplier.rejection_reason && (
              <div className={styles.detailSection}>
                <h3>Rejection Reason</h3>
                <p style={{ color: 'var(--color-danger)', fontSize: '0.9rem', margin: 0 }}>{detailModal.supplier.rejection_reason}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModal.open}
        onClose={() => setRejectModal({ open: false, supplier: null })}
        title="Reject Supplier"
        footer={
          <div className={styles.modalFooter}>
            <Button variant="outline" onClick={() => setRejectModal({ open: false, supplier: null })}>Cancel</Button>
            <Button variant="danger" onClick={handleReject} loading={processing}>
              <FiXCircle /> Reject Supplier
            </Button>
          </div>
        }
      >
        <p>Are you sure you want to reject <strong>{rejectModal.supplier?.name}</strong>?</p>
        <div style={{ marginTop: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 500, marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            Rejection Reason *
          </label>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
            placeholder="Provide a reason for rejection..."
            style={{
              width: '100%',
              padding: '0.65rem 0.875rem',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-input)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default SupplierApprovalsPage;
