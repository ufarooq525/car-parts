import React, { useEffect, useState, useCallback } from 'react';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/categories';
import { Category, PaginatedResponse } from '../../types';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';
import Modal from '../../components/UI/Modal';
import Pagination from '../../components/UI/Pagination';
import Badge from '../../components/UI/Badge';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import SearchBar from '../../components/UI/SearchBar';
import styles from './Admin.module.css';

const CategoriesAdminPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', parent_id: '', description: '', sort_order: '0', is_active: 'true' });

  const fetchCategories = useCallback(() => {
    setLoading(true);
    getCategories({ page, search }).then((res: PaginatedResponse<Category>) => {
      setCategories(res.data);
      setMeta(res.meta);
    }).finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);
  useEffect(() => { getCategories({ per_page: 100 }).then(res => setAllCategories(res.data)).catch(() => {}); }, []);

  const openCreate = () => { setEditing(null); setForm({ name: '', parent_id: '', description: '', sort_order: '0', is_active: 'true' }); setModalOpen(true); };
  const openEdit = (c: Category) => { setEditing(c); setForm({ name: c.name, parent_id: c.parent_id?.toString() || '', description: c.description || '', sort_order: c.sort_order?.toString() || '0', is_active: c.is_active ? 'true' : 'false' }); setModalOpen(true); };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      if (form.parent_id) fd.append('parent_id', form.parent_id);
      if (form.description) fd.append('description', form.description);
      fd.append('sort_order', form.sort_order);
      fd.append('is_active', form.is_active === 'true' ? '1' : '0');
      if (editing) { await updateCategory(editing.id, fd); toast.success('Category updated'); }
      else { await createCategory(fd); toast.success('Category created'); }
      setModalOpen(false); fetchCategories();
    } catch (err: any) { toast.error(err?.response?.data?.message || 'Error'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setSubmitting(true);
    try { await deleteCategory(deleting.id); toast.success('Category deleted'); setDeleteModalOpen(false); setDeleting(null); fetchCategories(); }
    catch (err: any) { toast.error(err?.response?.data?.message || 'Cannot delete'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Categories</h1>
        <Button variant="primary" onClick={openCreate}><FiPlus /> Add Category</Button>
      </div>
      <div className={styles.filters}>
        <SearchBar value={search} onChange={setSearch} onSearch={() => { setPage(1); fetchCategories(); }} placeholder="Search categories..." />
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>Name</th><th>Parent</th><th>Sort</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id}>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.parent?.name || '—'}</td>
                  <td>{c.sort_order}</td>
                  <td><Badge variant={c.is_active ? 'success' : 'default'}>{c.is_active ? 'Active' : 'Inactive'}</Badge></td>
                  <td>
                    <div className={styles.actions}>
                      <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => openEdit(c)}><FiEdit2 /></button>
                      <button className={styles.actionBtn} onClick={() => { setDeleting(c); setDeleteModalOpen(true); }}><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {meta && <Pagination currentPage={meta.current_page} lastPage={meta.last_page} onPageChange={setPage} />}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Category' : 'Add Category'} footer={
        <div className={styles.modalActions}>
          <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} loading={submitting}>{editing ? 'Update' : 'Create'}</Button>
        </div>
      }>
        <div className={styles.modalForm}>
          <Input label="Name" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required />
          <Select label="Parent Category" value={form.parent_id} onChange={e => setForm(p => ({...p, parent_id: e.target.value}))} options={[{value:'',label:'None (Root)'},...allCategories.filter(c => c.id !== editing?.id).map(c => ({value: c.id.toString(), label: c.name}))]} />
          <Input label="Description" value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} />
          <Input label="Sort Order" type="number" value={form.sort_order} onChange={e => setForm(p => ({...p, sort_order: e.target.value}))} />
          <Select label="Status" value={form.is_active} onChange={e => setForm(p => ({...p, is_active: e.target.value}))} options={[{value:'true',label:'Active'},{value:'false',label:'Inactive'}]} />
        </div>
      </Modal>

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Category" footer={
        <div className={styles.modalActions}>
          <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} loading={submitting}>Delete</Button>
        </div>
      }>
        <p>Are you sure you want to delete <strong>{deleting?.name}</strong>? This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default CategoriesAdminPage;
