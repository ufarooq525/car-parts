import apiClient from './client';
import { PaginatedResponse, Product, ProductListItem } from '../types';

export const getProducts = async (
  params?: Record<string, any>
): Promise<PaginatedResponse<ProductListItem>> => {
  const response = await apiClient.get('/products', { params });
  return response.data;
};

export const getProduct = async (slug: string): Promise<Product> => {
  const response = await apiClient.get(`/products/${slug}`);
  return response.data.data;
};

export const createProduct = async (data: FormData): Promise<Product> => {
  const response = await apiClient.post('/admin/products', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};

export const updateProduct = async (id: number, data: FormData): Promise<Product> => {
  data.append('_method', 'PUT');
  const response = await apiClient.post(`/admin/products/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await apiClient.delete(`/admin/products/${id}`);
};
