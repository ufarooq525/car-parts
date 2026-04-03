import React, { useEffect, useState, useCallback } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier, triggerSync } from '../../api/suppliers';
import { Supplier, PaginatedResponse } from '../../types';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';
import Modal from '../../components/UI/Modal';
import Pagination from '../../components/UI/Pagination';
import Badge from '../../components/UI/Badge';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import SearchBar from '../../components/UI/SearchBar';
import { formatDateTime } from '../../utils/formatters';
import styles from './Admin.module.css';

const SuppliersAdminPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [deleting, setDeleting] = useState<Supplier | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', type: 'api', api_endpoint: '', api_key: '', feed_url: '', sync_interval_minutes: '60', is_active: 'true' });

  const fetchSuppliers = useCallback(() => {
    setLoading(true);
    getSuppliers({ page, search }).then((res: PaginatedResponse<Supplier>) => {
      setSuppliers(res.data); setMeta(res.meta);
    }).finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { fetchSuppliers(); }, [fetchSuppliers]);

  const openCreate = () => { setEditing(null); setForm({ name: '', code: '', type: 'api', api_endpoint: '', api_key: '', feed_url: '', sync_interval_minutes: '60', is_active: 'true' }); setModalOpen(true); };
  const openEdit = (s: Supplier) => { setEditing(s); setForm({ name: s.name, code: s.code, type: s.type, api_endpoint: s.api_endpoint || '', api_key: '', feed_url: s.feed_url || '', sync_interval_minutes: s.sync_interval_minutes.toString(), is_active: s.is_active ? 'true' : 'false' }); setModalOpen(true); };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const data: any = { ...form, sync_interval_minutes: parseInt(form.sync_interval_minutes), is_active: form.is_active === 'true' };
      if (!data.api_endpoint) delete data.api_endpoint;
      if (!data.api_key) delete data.api_key;
      if (!data.feed_url) delete data.feed_url;
      if (editing) { await updateSupplier(editing.id, data); toast.success('Supplier updated'); }
      else { await createSupplier(data); toast.success('Supplier created'); }
      setModalOpen(false); fetchSuppliers();
    } catch (err: any) { toast.error(err?.response?.data?.message || 'Error'); }
    finally { setSubmitting(false); }
  };

  const handleSync = async (id: number) => {
    try { await triggerSync(id); toast.success('Sync triggered'); }
    catch { toast.error('Failed to trigger sync'); }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setSubmitting(true);
    try { await deleteSupplier(deleting.id); toast.success('Supplier deleted'); setDeleteModalOpen(false); fetchSuppliers(); }
    catch (err: any) { toast.error(err?.response?.data?.message || 'Cannot delete'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Suppliers</h1>
        <Button variant="primary" onClick={openCreate}><FiPlus /> Add Supplier</Button>
      </div>
      <div className={styles.filters}>
        <SearchBar value={search} onChange={setSearch} onSearch={() => { setPage(1); fetchSuppliers(); }} placeholder="Search suppliers..." />
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>Name</th><th>Code</th><th>Type</th><th>Interval</th><th>Last Sync</th><th>Products</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {suppliers.map(s => (
                <tr key={s.id}>
                  <td><strong>{s.name}</strong></td>
                  <td>{s.code}</td>
                  <td><Badge variant="info">{s.type.toUpperCase()}</Badge></td>
                  <td>{s.sync_interval_minutes}m</td>
                  <td>{s.latest_sync ? <><Badge variant={s.latest_sync.status === 'completed' ? 'success' : s.latest_sync.status === 'failed' ? 'danger' : 'warning'}>{s.latest_sync.status}</Badge> {s.latest_sync.completed_at && formatDateTime(s.latest_sync.completed_at)}</> : '—'}</td>
                  <td>{s.products_count ?? '—'}</td>
                  <td><Badge variant={s.is_active ? 'success' : 'default'}>{s.is_active ? 'Active' : 'Inactive'}</Badge></td>
                  <td>
                    <div className={styles.actions}>
                      <button className={`${styles.actionBtn} ${styles.syncBtn}`} onClick={() => handleSync(s.id)} title="Sync Now"><FiRefreshCw /></button>
                      <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => openEdit(s)}><FiEdit2 /></button>
                      <button className={styles.actionBtn} onClick={() => { setDeleting(s); setDeleteModalOpen(true); }}><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {meta && <Pagination currentPage={meta.current_page} lastPage={meta.last_page} onPageChange={setPage} />}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Supplier' : 'Add Supplier'} footer={
        <div className={styles.modalActions}><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button variant="primary" onClick={handleSubmit} loading={submitting}>{editing ? 'Update' : 'Create'}</Button></div>
      }>
        <div className={styles.modalForm}>
          <div className={styles.formGrid}>
            <Input label="Name" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required />
            <Input label="Code" value={form.code} onChange={e => setForm(p => ({...p, code: e.target.value}))} required disabled={!!editing} />
          </div>
          <Select label="Type" value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value}))} options={[{value:'api',label:'API'},{value:'xml',label:'XML Feed'},{value:'csv',label:'CSV File'}]} />
          {form.type === 'api' && (<><Input label="API Endpoint" value={form.api_endpoint} onChange={e => setForm(p => ({...p, api_endpoint: e.target.value}))} /><Input label="API Key" value={form.api_key} onChange={e => setForm(p => ({...p, api_key: e.target.value}))} type="password" /></>)}
          {(form.type === 'xml' || form.type === 'csv') && (<Input label="Feed URL" value={form.feed_url} onChange={e => setForm(p => ({...p, feed_url: e.target.value}))} />)}
          <div className={styles.formGrid}>
            <Input label="Sync Interval (minutes)" type="number" value={form.sync_interval_minutes} onChange={e => setForm(p => ({...p, sync_interval_minutes: e.target.value}))} />
            <Select label="Status" value={form.is_active} onChange={e => setForm(p => ({...p, is_active: e.target.value}))} options={[{value:'true',label:'Active'},{value:'false',label:'Inactive'}]} />
          </div>
        </div>
      </Modal>

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Supplier" footer={
        <div className={styles.modalActions}><Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Cancel</Button><Button variant="danger" onClick={handleDelete} loading={submitting}>Delete</Button></div>
      }><p>Are you sure you want to delete <strong>{deleting?.name}</strong>?</p></Modal>
    </div>
  );
};

export default SuppliersAdminPage;
