import apiClient from './client';
import { PaginatedResponse, Supplier, SyncLog } from '../types';

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
