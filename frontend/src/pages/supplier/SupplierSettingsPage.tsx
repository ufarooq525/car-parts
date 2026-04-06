import React, { useEffect, useState, useRef } from 'react';
import {
  FiSave,
  FiUploadCloud,
  FiCheckCircle,
  FiX,
  FiDownload,
  FiFile,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';
import Card from '../../components/UI/Card';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { getSupplierDashboard, updateSupplierFeed, updateSupplierProfile } from '../../api/suppliers';
import { Supplier } from '../../types';
import styles from './SupplierDashboard.module.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const feedTypeOptions = [
  { value: 'none', label: 'Not configured yet' },
  { value: 'api', label: 'API Integration' },
  { value: 'xml', label: 'XML Feed' },
  { value: 'csv', label: 'CSV File Upload' },
];

const SupplierSettingsPage: React.FC = () => {
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingFeed, setSavingFeed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileForm, setProfileForm] = useState({
    contact_person: '',
    phone: '',
    website: '',
    address: '',
    description: '',
  });

  const [feedForm, setFeedForm] = useState({
    feed_type: 'none',
    api_url: '',
    api_key: '',
    feed_url: '',
    sync_interval_minutes: '60',
  });

  const [csvFile, setCsvFile] = useState<File | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getSupplierDashboard();
        setSupplier(data.supplier);
        setProfileForm({
          contact_person: data.supplier.contact_person || '',
          phone: data.supplier.phone || '',
          website: data.supplier.website || '',
          address: data.supplier.address || '',
          description: data.supplier.description || '',
        });
        setFeedForm({
          feed_type: data.supplier.type || 'none',
          api_url: data.supplier.api_url || '',
          api_key: '',
          feed_url: data.supplier.feed_url || '',
          sync_interval_minutes: String(data.supplier.sync_interval_minutes || 60),
        });
      } catch (error) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
        toast.error('Please select a CSV file.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File must be under 10MB.');
        return;
      }
      setCsvFile(file);
    }
  };

  const removeFile = () => {
    setCsvFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      await updateSupplierProfile(profileForm);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleFeedSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingFeed(true);
      const data: Record<string, any> = {
        feed_type: feedForm.feed_type,
        sync_interval_minutes: parseInt(feedForm.sync_interval_minutes),
      };
      if (feedForm.api_url) data.api_url = feedForm.api_url;
      if (feedForm.api_key) data.api_key = feedForm.api_key;
      if (feedForm.feed_url) data.feed_url = feedForm.feed_url;
      if (csvFile) data.csv_file = csvFile;

      await updateSupplierFeed(data);
      setCsvFile(null);
      toast.success('Feed settings updated successfully');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update feed settings');
    } finally {
      setSavingFeed(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading settings..." />;

  const isApproved = supplier?.approval_status === 'approved';

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Settings</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 700 }}>
        {/* Profile Settings */}
        <Card>
          <form onSubmit={handleProfileSave} style={{ padding: '1.25rem' }}>
            <h2 className={styles.sectionTitle}>Company Profile</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <Input label="Contact Person" name="contact_person" value={profileForm.contact_person} onChange={e => setProfileForm(p => ({ ...p, contact_person: e.target.value }))} />
              <Input label="Phone" name="phone" value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} />
              <Input label="Website" name="website" value={profileForm.website} onChange={e => setProfileForm(p => ({ ...p, website: e.target.value }))} />
              <Input label="Address" name="address" value={profileForm.address} onChange={e => setProfileForm(p => ({ ...p, address: e.target.value }))} />
            </div>
            <div style={{ marginTop: '1rem' }}>
              <Button variant="primary" type="submit" loading={savingProfile}>
                <FiSave /> Save Profile
              </Button>
            </div>
          </form>
        </Card>

        {/* Feed Settings */}
        <Card>
          <form onSubmit={handleFeedSave} style={{ padding: '1.25rem' }}>
            <h2 className={styles.sectionTitle}>Feed Settings</h2>
            {!isApproved && (
              <div style={{
                background: 'rgba(var(--color-accent-rgb), 0.08)',
                border: '1px solid rgba(var(--color-accent-rgb), 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                marginBottom: '1rem',
              }}>
                Feed settings can only be modified after your account is approved.
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <Select
                label="Feed Type"
                name="feed_type"
                value={feedForm.feed_type}
                onChange={e => setFeedForm(p => ({ ...p, feed_type: e.target.value }))}
                options={feedTypeOptions}
                disabled={!isApproved}
              />

              {feedForm.feed_type === 'api' && (
                <>
                  <Input label="API Endpoint" name="api_url" value={feedForm.api_url} onChange={e => setFeedForm(p => ({ ...p, api_url: e.target.value }))} disabled={!isApproved} />
                  <Input label="API Key" name="api_key" type="password" value={feedForm.api_key} onChange={e => setFeedForm(p => ({ ...p, api_key: e.target.value }))} disabled={!isApproved} placeholder="Enter new key to update" />
                </>
              )}

              {feedForm.feed_type === 'xml' && (
                <Input label="XML Feed URL" name="feed_url" value={feedForm.feed_url} onChange={e => setFeedForm(p => ({ ...p, feed_url: e.target.value }))} disabled={!isApproved} />
              )}

              {feedForm.feed_type === 'csv' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                    Upload CSV File
                  </label>

                  {/* Show current file if one exists */}
                  {supplier?.csv_original_name && !csvFile && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                    }}>
                      <FiFile />
                      Current: <strong>{supplier.csv_original_name}</strong>
                    </div>
                  )}

                  {isApproved && (
                    <>
                      {!csvFile ? (
                        <div
                          style={{
                            border: '2px dashed var(--border-input)',
                            borderRadius: 'var(--radius-md)',
                            padding: '1.25rem',
                            textAlign: 'center',
                            cursor: 'pointer',
                            background: 'var(--bg-input)',
                          }}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <div style={{ fontSize: '1.5rem', color: 'var(--text-tertiary)', marginBottom: '0.35rem' }}>
                            <FiUploadCloud />
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            <strong style={{ color: 'var(--color-primary)' }}>Click to upload</strong> a new CSV file
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.2rem' }}>
                            CSV files up to 10MB
                          </div>
                        </div>
                      ) : (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.65rem 0.875rem',
                          background: 'rgba(var(--color-accent-rgb), 0.08)',
                          border: '1px solid rgba(var(--color-accent-rgb), 0.2)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.85rem',
                        }}>
                          <FiCheckCircle style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                          <span>{csvFile.name}</span>
                          <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                            ({(csvFile.size / 1024).toFixed(1)} KB)
                          </span>
                          <button
                            type="button"
                            onClick={removeFile}
                            style={{
                              marginLeft: 'auto',
                              background: 'none',
                              border: 'none',
                              color: 'var(--text-tertiary)',
                              cursor: 'pointer',
                              padding: '0.2rem',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <FiX />
                          </button>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.txt"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                      />
                    </>
                  )}

                  <a
                    href={`${API_BASE}/supplier/sample-csv`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.8rem',
                      color: 'var(--color-primary)',
                      textDecoration: 'none',
                    }}
                    download
                  >
                    <FiDownload /> Download sample CSV template
                  </a>
                </div>
              )}

              <Input
                label="Sync Interval (minutes)"
                name="sync_interval_minutes"
                type="number"
                min="15"
                value={feedForm.sync_interval_minutes}
                onChange={e => setFeedForm(p => ({ ...p, sync_interval_minutes: e.target.value }))}
                disabled={!isApproved}
              />
            </div>
            <div style={{ marginTop: '1rem' }}>
              <Button variant="primary" type="submit" loading={savingFeed} disabled={!isApproved}>
                <FiSave /> Save Feed Settings
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SupplierSettingsPage;
