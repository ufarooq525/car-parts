import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import styles from './StaticPage.module.css';

const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simulate sending
    setTimeout(() => {
      toast.success('Message sent successfully! We will get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
      setSending(false);
    }, 1000);
  };

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Contact Us</h1>
        <p className={styles.heroSubtitle}>
          We'd love to hear from you. Get in touch with our team.
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.contactGrid}>
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}><FiMail size={20} /></div>
              <div>
                <h3 className={styles.contactLabel}>Email</h3>
                <p className={styles.contactValue}>support@carpartsstore.com</p>
              </div>
            </div>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}><FiPhone size={20} /></div>
              <div>
                <h3 className={styles.contactLabel}>Phone</h3>
                <p className={styles.contactValue}>+1 (555) 123-4567</p>
              </div>
            </div>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}><FiMapPin size={20} /></div>
              <div>
                <h3 className={styles.contactLabel}>Address</h3>
                <p className={styles.contactValue}>123 Auto Parts Blvd, Suite 100<br />Los Angeles, CA 90001</p>
              </div>
            </div>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Name</label>
                <input
                  className={styles.formInput}
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email</label>
                <input
                  className={styles.formInput}
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Subject</label>
              <input
                className={styles.formInput}
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Message</label>
              <textarea
                className={styles.formTextarea}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={5}
                required
              />
            </div>
            <button className={styles.submitBtn} type="submit" disabled={sending}>
              <FiArrowRight />
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
