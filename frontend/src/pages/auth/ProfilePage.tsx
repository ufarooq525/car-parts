import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { changePassword } from '../../api/auth';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import styles from './Auth.module.css';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [passwords, setPasswords] = useState({ current_password: '', password: '', password_confirmation: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      await updateProfile(profile);
      toast.success('Profile updated!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    try {
      await changePassword(passwords);
      toast.success('Password changed!');
      setPasswords({ current_password: '', password: '', password_confirmation: '' });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.profileTitle}>My Profile</h1>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Personal Information</h3>
        <form onSubmit={handleProfileSubmit} className={styles.form}>
          <Input label="Name" name="name" value={profile.name} onChange={e => setProfile(p => ({...p, name: e.target.value}))} />
          <Input label="Email" name="email" type="email" value={profile.email} onChange={e => setProfile(p => ({...p, email: e.target.value}))} />
          <Input label="Phone" name="phone" value={profile.phone} onChange={e => setProfile(p => ({...p, phone: e.target.value}))} />
          <Button variant="primary" type="submit" loading={profileLoading}>Save Changes</Button>
        </form>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Change Password</h3>
        <form onSubmit={handlePasswordSubmit} className={styles.form}>
          <Input label="Current Password" name="current_password" type="password" value={passwords.current_password} onChange={e => setPasswords(p => ({...p, current_password: e.target.value}))} required />
          <Input label="New Password" name="password" type="password" value={passwords.password} onChange={e => setPasswords(p => ({...p, password: e.target.value}))} required />
          <Input label="Confirm New Password" name="password_confirmation" type="password" value={passwords.password_confirmation} onChange={e => setPasswords(p => ({...p, password_confirmation: e.target.value}))} required />
          <Button variant="primary" type="submit" loading={passwordLoading}>Change Password</Button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
