import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiTruck,
  FiUser,
  FiGlobe,
  FiDatabase,
  FiUploadCloud,
  FiFile,
  FiX,
  FiDownload,
  FiCheckCircle,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { registerSupplier } from '../../api/suppliers';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';
import styles from './SupplierRegister.module.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const SupplierRegisterPage: React.FC = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    // Account
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    // Company
    company_name: '',
    contact_person: '',
    company_phone: '',
    website: '',
    business_license: '',
    tax_id: '',
    address: '',
    description: '',
    // Feed (all optional)
    feed_type: '' as '' | 'api' | 'xml' | 'csv',
    api_url: '',
    feed_url: '',
  });

  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
        setError('Please select a CSV file.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File must be under 10MB.');
        return;
      }
      setCsvFile(file);
      setError('');
    }
  };

  const removeFile = () => {
    setCsvFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validateStep1 = () => {
    if (!form.name || !form.email || !form.password || !form.password_confirmation) {
      setError('Please fill in all required fields.');
      return false;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return false;
    }
    if (form.password !== form.password_confirmation) {
      setError('Passwords do not match.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!form.company_name || !form.contact_person) {
      setError('Company name and contact person are required.');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    setError('');
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(s => s + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(s => s - 1);
  };

  const submitRegistration = async () => {
    setError('');
    setLoading(true);
    try {
      const submitData: any = { ...form };
      if (csvFile) submitData.csv_file = csvFile;
      // If no feed type selected, don't send it
      if (!submitData.feed_type) delete submitData.feed_type;

      const result = await registerSupplier(submitData);
      setAuth(result.user, result.token);
      toast.success('Registration submitted! Your application is pending review.');
      navigate('/supplier');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitRegistration();
  };

  const handleSkipAndSubmit = async () => {
    await submitRegistration();
  };

  const feedTypeOptions = [
    { value: '', label: 'Select feed type (optional)' },
    { value: 'api', label: 'API Integration' },
    { value: 'xml', label: 'XML Feed' },
    { value: 'csv', label: 'CSV File Upload' },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <FiTruck />
        </div>
        <h1 className={styles.title}>Become a Supplier</h1>
        <p className={styles.subtitle}>Register your business to supply auto parts</p>

        {/* Progress Steps */}
        <div className={styles.steps}>
          <div className={`${styles.step} ${step >= 1 ? styles.stepActive : ''}`}>
            <div className={styles.stepIcon}><FiUser /></div>
            <span>Account</span>
          </div>
          <div className={styles.stepLine} />
          <div className={`${styles.step} ${step >= 2 ? styles.stepActive : ''}`}>
            <div className={styles.stepIcon}><FiGlobe /></div>
            <span>Company</span>
          </div>
          <div className={styles.stepLine} />
          <div className={`${styles.step} ${step >= 3 ? styles.stepActive : ''}`}>
            <div className={styles.stepIcon}><FiDatabase /></div>
            <span>Feed Setup</span>
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Step 1: Account */}
          {step === 1 && (
            <div className={styles.stepContent}>
              <Input label="Full Name *" name="name" value={form.name} onChange={handleChange} required />
              <Input label="Email *" name="email" type="email" value={form.email} onChange={handleChange} required />
              <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
              <Input label="Password *" name="password" type="password" value={form.password} onChange={handleChange} required />
              <Input label="Confirm Password *" name="password_confirmation" type="password" value={form.password_confirmation} onChange={handleChange} required />
              <Button variant="primary" fullWidth onClick={nextStep} type="button">
                Continue to Company Details
              </Button>
            </div>
          )}

          {/* Step 2: Company Info */}
          {step === 2 && (
            <div className={styles.stepContent}>
              <Input label="Company Name *" name="company_name" value={form.company_name} onChange={handleChange} required />
              <Input label="Contact Person *" name="contact_person" value={form.contact_person} onChange={handleChange} required />
              <Input label="Company Phone" name="company_phone" value={form.company_phone} onChange={handleChange} />
              <Input label="Website" name="website" value={form.website} onChange={handleChange} />
              <div className={styles.gridTwo}>
                <Input label="Business License #" name="business_license" value={form.business_license} onChange={handleChange} />
                <Input label="Tax ID" name="tax_id" value={form.tax_id} onChange={handleChange} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Business Address</label>
                <textarea name="address" value={form.address} onChange={handleChange} rows={2} className={styles.textarea} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Company Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={styles.textarea} placeholder="Tell us about your business, product range, etc." />
              </div>
              <div className={styles.btnRow}>
                <Button variant="outline" onClick={prevStep} type="button">Back</Button>
                <Button variant="primary" onClick={nextStep} type="button">Continue to Feed Setup</Button>
              </div>
            </div>
          )}

          {/* Step 3: Feed Type (optional) */}
          {step === 3 && (
            <div className={styles.stepContent}>
              <Select
                label="Product Feed Type"
                name="feed_type"
                value={form.feed_type}
                onChange={handleChange}
                options={feedTypeOptions}
              />

              {form.feed_type === 'api' && (
                <Input label="API Endpoint URL" name="api_url" value={form.api_url} onChange={handleChange} placeholder="https://api.yoursite.com/products" />
              )}

              {form.feed_type === 'xml' && (
                <Input label="XML Feed URL" name="feed_url" value={form.feed_url} onChange={handleChange} placeholder="https://yoursite.com/feed.xml" />
              )}

              {form.feed_type === 'csv' && (
                <div className={styles.fileUpload}>
                  <label className={styles.fileUploadLabel}>Upload CSV File</label>
                  {!csvFile ? (
                    <>
                      <div
                        className={styles.fileUploadArea}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className={styles.fileUploadIcon}><FiUploadCloud /></div>
                        <div className={styles.fileUploadText}>
                          <strong>Click to upload</strong> or drag and drop
                        </div>
                        <div className={styles.fileUploadHint}>CSV files up to 10MB</div>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.txt"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                      />
                    </>
                  ) : (
                    <div className={styles.fileSelected}>
                      <FiCheckCircle />
                      <span>{csvFile.name}</span>
                      <span style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
                        ({(csvFile.size / 1024).toFixed(1)} KB)
                      </span>
                      <button type="button" className={styles.fileRemove} onClick={removeFile}>
                        <FiX />
                      </button>
                    </div>
                  )}
                  <a
                    href={`${API_BASE}/supplier/sample-csv`}
                    className={styles.sampleDownload}
                    download
                  >
                    <FiDownload /> Download sample CSV template
                  </a>
                </div>
              )}

              <div className={styles.infoBox}>
                <strong>What happens next?</strong>
                <ul>
                  <li>Our team will review your application</li>
                  <li>You'll receive a notification on approval</li>
                  <li>Once approved, your product feed will be synced automatically</li>
                  {!form.feed_type && (
                    <li>You can set up your product feed later from the supplier dashboard</li>
                  )}
                </ul>
              </div>

              <div className={styles.btnRow}>
                <Button variant="outline" onClick={prevStep} type="button">Back</Button>
                <Button variant="primary" type="submit" loading={loading}>
                  {form.feed_type ? 'Submit Application' : 'Submit Application'}
                </Button>
              </div>

              {!form.feed_type && (
                <div className={styles.skipLink}>
                  <button type="button" onClick={handleSkipAndSubmit} disabled={loading}>
                    Skip feed setup — I'll configure it later
                  </button>
                </div>
              )}
            </div>
          )}
        </form>

        <div className={styles.footer}>
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default SupplierRegisterPage;
