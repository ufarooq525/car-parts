import apiClient from './client';
import { PaginatedResponse, Category, CategoryTree } from '../types';

export const getCategories = async (
  params?: Record<string, any>
): Promise<PaginatedResponse<Category>> => {
  const response = await apiClient.get('/categories', { params });
  return response.data;
};

export const getCategoryTree = async (): Promise<CategoryTree[]> => {
  const response = await apiClient.get('/categories/tree');
  return response.data.data;
};

export const getCategory = async (slug: string): Promise<Category> => {
  const response = await apiClient.get(`/categories/${slug}`);
  return response.data.data;
};

export const createCategory = async (data: FormData): Promise<Category> => {
  const response = await apiClient.post('/admin/categories', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};

export const updateCategory = async (id: number, data: FormData): Promise<Category> => {
  data.append('_method', 'PUT');
  const response = await apiClient.post(`/admin/categories/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await apiClient.delete(`/admin/categories/${id}`);
};
