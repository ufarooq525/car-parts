import apiClient from './client';
import { MarginRule } from '../types';

export const getMarginRules = async (): Promise<MarginRule[]> => {
  const response = await apiClient.get('/admin/margin-rules');
  return response.data.data;
};

export const createMarginRule = async (data: Partial<MarginRule>): Promise<MarginRule> => {
  const response = await apiClient.post('/admin/margin-rules', data);
  return response.data.data;
};

export const updateMarginRule = async (
  id: number,
  data: Partial<MarginRule>
): Promise<MarginRule> => {
  const response = await apiClient.put(`/admin/margin-rules/${id}`, data);
  return response.data.data;
};

export const deleteMarginRule = async (id: number): Promise<void> => {
  await apiClient.delete(`/admin/margin-rules/${id}`);
};
