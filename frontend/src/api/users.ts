import apiClient from './client';
import { PaginatedResponse, User } from '../types';

export const getUsers = async (
  params?: Record<string, any>
): Promise<PaginatedResponse<User>> => {
  const response = await apiClient.get('/admin/users', { params });
  return response.data;
};

export const getUser = async (id: number): Promise<User> => {
  const response = await apiClient.get(`/admin/users/${id}`);
  return response.data.data;
};

export const updateUser = async (id: number, data: Partial<User>): Promise<User> => {
  const response = await apiClient.put(`/admin/users/${id}`, data);
  return response.data.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await apiClient.delete(`/admin/users/${id}`);
};
