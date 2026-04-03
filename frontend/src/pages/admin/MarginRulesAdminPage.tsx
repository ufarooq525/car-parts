import React, { useEffect, useState, useCallback } from 'react';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getMarginRules, createMarginRule, updateMarginRule, deleteMarginRule } from '../../api/marginRules';
import { getSuppliers } from '../../api/suppliers';
import { getCategories } from '../../api/categories';
import { MarginRule, Supplier, Category } from '../../types';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';
import Modal from '../../components/UI/Modal';
import Badge from '../../components/UI/Badge';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters';
import styles from './Admin.module.css';

const MarginRulesAdminPage: React.FC = () => {
  const [rules, setRules] = useState<MarginRule[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editing, setEditing] = useState<MarginRule | null>(null);
  const [deleting, setDeleting] = useState<MarginRule | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ supplier_id: '', category_id: '', type: 'percentage', value: '', min_price: '', max_price: '', priority: '0' });

  const fetchRules = useCallback(() => {
    setLoading(true);
    getMarginRules().then(setRules).finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchRules(); }, [fetchRules]);
  useEffect(() => {
    getSuppliers({ per_page: 100 }).then(res => setSuppliers(res.data)).catch(() => {});
    getCategories({ per_page: 100 }).then(res => setCategories(res.data)).catch(() => {});
  }, []);

  const openCreate = () => { setEditing(null); setForm({ supplier_id: '', category_id: '', type: 'percentage', value: '', min_price: '', max_price: '', priority: '0' }); setModalOpen(true); };
  const openEdit = (r: MarginRule) => { setEditing(r); setForm({ supplier_id: r.supplier_id?.toString() || '', category_id: r.category_id?.toString() || '', type: r.type, value: r.value.toString(), min_price: r.min_price?.toString() || '', max_price: r.max_price?.toString() || '', priority: r.priority.toString() }); setModalOpen(true); };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const data: any = { type: form.type, value: parseFloat(form.value), priority: parseInt(form.priority) };
      if (form.supplier_id) data.supplier_id = parseInt(form.supplier_id);
      if (form.category_id) data.category_id = parseInt(form.category_id);
      if (form.min_price) data.min_price = parseFloat(form.min_price);
      if (form.max_price) data.max_price = parseFloat(form.max_price);
      if (editing) { await updateMarginRule(editing.id, data); toast.success('Rule updated'); }
      else { await createMarginRule(data); toast.success('Rule created'); }
      setModalOpen(false); fetchRules();
    } catch (err: any) { toast.error(err?.response?.data?.message || 'Error'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setSubmitting(true);
    try { await deleteMarginRule(deleting.id); toast.success('Rule deleted'); setDeleteModalOpen(false); fetchRules(); }
    catch (err: any) { toast.error(err?.response?.data?.message || 'Error'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Margin Rules</h1>
        <Button variant="primary" onClick={openCreate}><FiPlus /> Add Rule</Button>
      </div>
      <div className={styles.infoBox}>
        Margin rules determine the sell price of products. The most specific rule wins: product-level overrides category, which overrides supplier, which overrides global. Higher priority numbers take precedence when rules are equally specific.
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>Supplier</th><th>Category</th><th>Type</th><th>Value</th><th>Price Range</th><th>Priority</th><th>Actions</th></tr></thead>
            <tbody>
              {rules.map(r => (
                <tr key={r.id}>
                  <td>{r.supplier_name || <em style={{color:'#999'}}>All</em>}</td>
                  <td>{r.category_name || <em style={{color:'#999'}}>All</em>}</td>
                  <td><Badge variant={r.type === 'percentage' ? 'info' : 'warning'}>{r.type}</Badge></td>
                  <td><strong>{r.type === 'percentage' ? `${r.value}%` : formatCurrency(r.value)}</strong></td>
                  <td>{r.min_price || r.max_price ? `${r.min_price ? formatCurrency(r.min_price) : '—'} – ${r.max_price ? formatCurrency(r.max_price) : '—'}` : '—'}</td>
                  <td>{r.priority}</td>
                  <td>
                    <div className={styles.actions}>
                      <button className={`${styles.actionBtn} ${styles.editBtn}`} onClick={() => openEdit(r)}><FiEdit2 /></button>
                      <button className={styles.actionBtn} onClick={() => { setDeleting(r); setDeleteModalOpen(true); }}><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Margin Rule' : 'Add Margin Rule'} footer={
        <div className={styles.modalActions}><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button variant="primary" onClick={handleSubmit} loading={submitting}>{editing ? 'Update' : 'Create'}</Button></div>
      }>
        <div className={styles.modalForm}>
          <Select label="Supplier (optional)" value={form.supplier_id} onChange={e => setForm(p => ({...p, supplier_id: e.target.value}))} options={[{value:'',label:'All Suppliers'},...suppliers.map(s => ({value:s.id.toString(),label:s.name}))]} />
          <Select label="Category (optional)" value={form.category_id} onChange={e => setForm(p => ({...p, category_id: e.target.value}))} options={[{value:'',label:'All Categories'},...categories.map(c => ({value:c.id.toString(),label:c.name}))]} />
          <div className={styles.formGrid}>
            <Select label="Type" value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value}))} options={[{value:'percentage',label:'Percentage (%)'},{value:'fixed',label:'Fixed Amount (€)'}]} />
            <Input label="Value" type="number" value={form.value} onChange={e => setForm(p => ({...p, value: e.target.value}))} required />
          </div>
          <div className={styles.formGrid}>
            <Input label="Min Price (optional)" type="number" value={form.min_price} onChange={e => setForm(p => ({...p, min_price: e.target.value}))} />
            <Input label="Max Price (optional)" type="number" value={form.max_price} onChange={e => setForm(p => ({...p, max_price: e.target.value}))} />
          </div>
          <Input label="Priority" type="number" value={form.priority} onChange={e => setForm(p => ({...p, priority: e.target.value}))} />
        </div>
      </Modal>

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Margin Rule" footer={
        <div className={styles.modalActions}><Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Cancel</Button><Button variant="danger" onClick={handleDelete} loading={submitting}>Delete</Button></div>
      }><p>Are you sure you want to delete this margin rule?</p></Modal>
    </div>
  );
};

export default MarginRulesAdminPage;
