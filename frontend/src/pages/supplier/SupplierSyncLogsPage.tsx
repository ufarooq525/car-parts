import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Table from '../../components/UI/Table';
import Badge from '../../components/UI/Badge';
import Pagination from '../../components/UI/Pagination';
import { getSupplierSyncLogs } from '../../api/suppliers';
import { SyncLog } from '../../types';
import styles from './SupplierDashboard.module.css';

const SupplierSyncLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getSupplierSyncLogs({ page: currentPage, per_page: 15 });
      setLogs(res.data);
      setCurrentPage(res.meta.current_page);
      setLastPage(res.meta.last_page);
    } catch (error) {
      toast.error('Failed to load sync logs');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const getStatusVariant = (status: string): 'success' | 'warning' | 'danger' | 'default' => {
    switch (status) {
      case 'completed': return 'success';
      case 'running': return 'warning';
      case 'failed': return 'danger';
      default: return 'default';
    }
  };

  const columns = [
    {
      key: 'type',
      label: 'Type',
      render: (item: SyncLog) => <span style={{ textTransform: 'capitalize' }}>{item.type}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: SyncLog) => (
        <Badge variant={getStatusVariant(item.status)}>
          {item.status}
        </Badge>
      ),
    },
    {
      key: 'records_processed',
      label: 'Records',
      render: (item: SyncLog) => item.records_processed,
    },
    {
      key: 'errors',
      label: 'Errors',
      render: (item: SyncLog) => item.errors || '-',
    },
    {
      key: 'started_at',
      label: 'Started',
      render: (item: SyncLog) => item.started_at ? new Date(item.started_at).toLocaleString() : '-',
    },
    {
      key: 'completed_at',
      label: 'Completed',
      render: (item: SyncLog) => item.completed_at ? new Date(item.completed_at).toLocaleString() : '-',
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Sync Logs</h1>
      </div>

      <Table columns={columns} data={logs} loading={loading} emptyMessage="No sync logs found." />
      <Pagination currentPage={currentPage} lastPage={lastPage} onPageChange={setCurrentPage} />
    </div>
  );
};

export default SupplierSyncLogsPage;
