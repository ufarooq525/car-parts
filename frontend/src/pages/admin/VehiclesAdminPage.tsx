import React, { useEffect, useState, useCallback } from 'react';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from '../../api/vehicles';
import { Vehicle, PaginatedResponse } from '../../types';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Modal from '../../components/UI/Modal';
import Pagination from '../../components/UI/Pagination';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import SearchBar from '../../components/UI/SearchBar';
import styles from './Admin.module.css';

const VehiclesAdminPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [deleting, setDeleting] = useState<Vehicle | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ make: '', model: '', year_from: '', year_to: '', engine: '' });

  const fetchVehicles = useCallback(() => {
    setLoading(true);
    getVehicles({ page, search }).then((res: PaginatedResponse<Vehicle>) => {
      setVehicles(res.data); setMeta(res.meta);
    }).finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  const openCreate = () => { setEditing(null); setForm({ make: '', model: '', year_from: '', year_to: '', engine: '' }); setModalOpen(true); };
  const openEdit = (v: Vehicle) => { setEditing(v); setForm({ make: v.make, model: v.model, year_from: v.year_from.toString(), year_to: v.year_to.toString(), engine: v.engine || '' }); setModalOpen(true); };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const data = { ...form, year_from: parseInt(form.year_from), year_to: parseInt(form.year_to) };
      if (editing) { await updateVehicle(editing.id, data); toast.success('Vehicle updated'); }
      else { await createVehicle(data); toast.success('Vehicle created'); }
      setModalOpen(false); fetchVehicles();
    } catch (err: any) { toast.error(err?.response?.data?.message || 'Error'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setSubmitting(true);
    try { await deleteVehicle(deleting.id); toast.success('Vehicle deleted'); setDeleteModalOpen(false); fetchVehicles(); }
    catch (err: any) { toast.error(err?.response?.data?.message || 'Cannot delete'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Vehicles</h1>
        <Button variant="primary" onClick={openCreate}><FiPlus /> Add Vehicle</Button>
      </div>
      <div className={styles.filters}>
        <SearchBar value={search} onChange={setSearch} onSearch={() => { setPage(1); fetchVehicles(); }} placeholder="Search vehicles..." />
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>Make</th><th>Model</th><th>Years</th><th>Engine</th><th>Products</th><th>Actions</th></tr></thead>
            <tbody>
              {vehicles.map(v => (
                <tr key={v.id}>
                  <td><strong>{v.make}</strong></td>
                  <td>{v.model}</td>
                  <td>{v.year_from} – {v.year_to}</td>
                  <td>{v.engine || '—'}</td>
                  <td>{v.products_count ?? '—'}</td>
                  <td>
                    <div className={styles.actions}>
                      <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => openEdit(v)}><FiEdit2 /></button>
                      <button className={styles.actionBtn} onClick={() => { setDeleting(v); setDeleteModalOpen(true); }}><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {meta && <Pagination currentPage={meta.current_page} lastPage={meta.last_page} onPageChange={setPage} />}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Vehicle' : 'Add Vehicle'} footer={
        <div className={styles.modalActions}><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button variant="primary" onClick={handleSubmit} loading={submitting}>{editing ? 'Update' : 'Create'}</Button></div>
      }>
        <div className={styles.modalForm}>
          <div className={styles.formGrid}>
            <Input label="Make" value={form.make} onChange={e => setForm(p => ({...p, make: e.target.value}))} required />
            <Input label="Model" value={form.model} onChange={e => setForm(p => ({...p, model: e.target.value}))} required />
            <Input label="Year From" type="number" value={form.year_from} onChange={e => setForm(p => ({...p, year_from: e.target.value}))} required />
            <Input label="Year To" type="number" value={form.year_to} onChange={e => setForm(p => ({...p, year_to: e.target.value}))} required />
          </div>
          <Input label="Engine (optional)" value={form.engine} onChange={e => setForm(p => ({...p, engine: e.target.value}))} />
        </div>
      </Modal>

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Vehicle" footer={
        <div className={styles.modalActions}><Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Cancel</Button><Button variant="danger" onClick={handleDelete} loading={submitting}>Delete</Button></div>
      }><p>Are you sure you want to delete <strong>{deleting?.make} {deleting?.model}</strong>?</p></Modal>
    </div>
  );
};

export default VehiclesAdminPage;
