import React, { useEffect, useState, useCallback } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getUsers, updateUser, deleteUser } from '../../api/users';
import { User, PaginatedResponse } from '../../types';
import Button from '../../components/UI/Button';
import Select from '../../components/UI/Select';
import Modal from '../../components/UI/Modal';
import Pagination from '../../components/UI/Pagination';
import Badge from '../../components/UI/Badge';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import SearchBar from '../../components/UI/SearchBar';
import { formatDate } from '../../utils/formatters';
import styles from './Admin.module.css';

const UsersAdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleting, setDeleting] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editForm, setEditForm] = useState({ role: '', is_active: 'true' });

  const fetchUsers = useCallback(() => {
    setLoading(true);
    getUsers({ page, search, role: roleFilter || undefined }).then((res: PaginatedResponse<User>) => {
      setUsers(res.data); setMeta(res.meta);
    }).finally(() => setLoading(false));
  }, [page, search, roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const openEdit = (u: User) => { setEditing(u); setEditForm({ role: u.role, is_active: u.is_active ? 'true' : 'false' }); setEditModalOpen(true); };

  const handleUpdate = async () => {
    if (!editing) return;
    setSubmitting(true);
    try {
      await updateUser(editing.id, { role: editForm.role as 'admin' | 'staff' | 'customer', is_active: editForm.is_active === 'true' });
      toast.success('User updated'); setEditModalOpen(false); fetchUsers();
    } catch (err: any) { toast.error(err?.response?.data?.message || 'Error'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setSubmitting(true);
    try { await deleteUser(deleting.id); toast.success('User deleted'); setDeleteModalOpen(false); fetchUsers(); }
    catch (err: any) { toast.error(err?.response?.data?.message || 'Cannot delete'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}><h1 className={styles.title}>Users</h1></div>
      <div className={styles.filters}>
        <SearchBar value={search} onChange={setSearch} onSearch={() => { setPage(1); fetchUsers(); }} placeholder="Search users..." />
        <Select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }} options={[{value:'',label:'All Roles'},{value:'admin',label:'Admin'},{value:'staff',label:'Staff'},{value:'customer',label:'Customer'}]} />
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Orders</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td>{u.phone || '—'}</td>
                  <td><Badge variant={u.role === 'admin' ? 'danger' : u.role === 'staff' ? 'warning' : 'info'}>{u.role}</Badge></td>
                  <td><Badge variant={u.is_active ? 'success' : 'default'}>{u.is_active ? 'Active' : 'Inactive'}</Badge></td>
                  <td>{u.orders_count ?? '—'}</td>
                  <td>{formatDate(u.created_at)}</td>
                  <td>
                    <div className={styles.actions}>
                      <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => openEdit(u)}><FiEdit2 /></button>
                      <button className={styles.actionBtn} onClick={() => { setDeleting(u); setDeleteModalOpen(true); }}><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {meta && <Pagination currentPage={meta.current_page} lastPage={meta.last_page} onPageChange={setPage} />}

      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title={`Edit User: ${editing?.name}`} footer={
        <div className={styles.modalActions}><Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancel</Button><Button variant="primary" onClick={handleUpdate} loading={submitting}>Update</Button></div>
      }>
        <div className={styles.modalForm}>
          <Select label="Role" value={editForm.role} onChange={e => setEditForm(p => ({...p, role: e.target.value}))} options={[{value:'admin',label:'Admin'},{value:'staff',label:'Staff'},{value:'customer',label:'Customer'}]} />
          <Select label="Status" value={editForm.is_active} onChange={e => setEditForm(p => ({...p, is_active: e.target.value}))} options={[{value:'true',label:'Active'},{value:'false',label:'Inactive'}]} />
        </div>
      </Modal>

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete User" footer={
        <div className={styles.modalActions}><Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Cancel</Button><Button variant="danger" onClick={handleDelete} loading={submitting}>Delete</Button></div>
      }><p>Are you sure you want to delete <strong>{deleting?.name}</strong>?</p></Modal>
    </div>
  );
};

export default UsersAdminPage;
