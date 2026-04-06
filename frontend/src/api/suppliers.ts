import apiClient from './client';
import { PaginatedResponse, Supplier, SyncLog, SupplierRegisterData, SupplierDashboardData } from '../types';

// ─── Admin endpoints ───────────────────────────
export const getSuppliers = async (
  params?: Record<string, any>
): Promise<PaginatedResponse<Supplier>> => {
  const response = await apiClient.get('/admin/suppliers', { params });
  return response.data;
};

export const getSupplier = async (id: number): Promise<Supplier> => {
  const response = await apiClient.get(`/admin/suppliers/${id}`);
  return response.data.data;
};

export const createSupplier = async (data: Partial<Supplier>): Promise<Supplier> => {
  const response = await apiClient.post('/admin/suppliers', data);
  return response.data.data;
};

export const updateSupplier = async (id: number, data: Partial<Supplier>): Promise<Supplier> => {
  const response = await apiClient.put(`/admin/suppliers/${id}`, data);
  return response.data.data;
};

export const deleteSupplier = async (id: number): Promise<void> => {
  await apiClient.delete(`/admin/suppliers/${id}`);
};

export const triggerSync = async (id: number): Promise<SyncLog> => {
  const response = await apiClient.post(`/admin/suppliers/${id}/sync`);
  return response.data.data;
};

// ─── Admin approval endpoints ──────────────────
export const getPendingSuppliers = async (
  params?: Record<string, any>
): Promise<PaginatedResponse<Supplier>> => {
  const response = await apiClient.get('/admin/supplier-approvals', { params });
  return response.data;
};

export const markSupplierUnderReview = async (id: number): Promise<Supplier> => {
  const response = await apiClient.post(`/admin/supplier-approvals/${id}/review`);
  return response.data.data;
};

export const approveSupplier = async (id: number): Promise<Supplier> => {
  const response = await apiClient.post(`/admin/supplier-approvals/${id}/approve`);
  return response.data.data;
};

export const rejectSupplier = async (id: number, reason: string): Promise<Supplier> => {
  const response = await apiClient.post(`/admin/supplier-approvals/${id}/reject`, { reason });
  return response.data.data;
};

// ─── Supplier registration ─────────────────────
export const registerSupplier = async (data: SupplierRegisterData): Promise<any> => {
  const formData = new FormData();

  // Append all text fields
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'csv_file') return; // handled separately
    if (value !== undefined && value !== null && value !== '') {
      formData.append(key, String(value));
    }
  });

  // Append CSV file if present
  if (data.csv_file) {
    formData.append('csv_file', data.csv_file);
  }

  const response = await apiClient.post('/supplier/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};

// ─── Supplier portal endpoints ─────────────────
export const getSupplierDashboard = async (): Promise<SupplierDashboardData> => {
  const response = await apiClient.get('/supplier/dashboard');
  return response.data.data;
};

export const getSupplierProducts = async (
  params?: Record<string, any>
): Promise<PaginatedResponse<any>> => {
  const response = await apiClient.get('/supplier/products', { params });
  return response.data;
};

export const getSupplierSyncLogs = async (
  params?: Record<string, any>
): Promise<PaginatedResponse<SyncLog>> => {
  const response = await apiClient.get('/supplier/sync-logs', { params });
  return response.data;
};

export const updateSupplierFeed = async (data: Record<string, any>): Promise<Supplier> => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === 'csv_file') return;
    if (value !== undefined && value !== null && value !== '') {
      formData.append(key, String(value));
    }
  });

  if (data.csv_file instanceof File) {
    formData.append('csv_file', data.csv_file);
  }

  const response = await apiClient.post('/supplier/feed', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};

export const downloadSampleCsv = (): string => {
  return `${apiClient.defaults.baseURL || ''}/supplier/sample-csv`;
};

export const updateSupplierProfile = async (data: Record<string, any>): Promise<Supplier> => {
  const response = await apiClient.put('/supplier/profile', data);
  return response.data.data;
};
