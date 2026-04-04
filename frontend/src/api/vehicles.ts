import apiClient from './client';
import { PaginatedResponse, Vehicle } from '../types';

export const getVehicles = async (
  params?: Record<string, any>
): Promise<PaginatedResponse<Vehicle>> => {
  const response = await apiClient.get('/vehicles', { params });
  return response.data;
};

export const getVehicle = async (slug: string): Promise<Vehicle> => {
  const response = await apiClient.get(`/vehicles/${slug}`);
  return response.data.data;
};

export const getMakes = async (): Promise<string[]> => {
  const response = await apiClient.get('/vehicles/makes');
  return response.data.data;
};

export const getModels = async (make: string): Promise<string[]> => {
  const response = await apiClient.get(`/vehicles/makes/${encodeURIComponent(make)}/models`);
  return response.data.data;
};

export interface YearRange {
  year_from: number;
  year_to: number;
}

export const getYears = async (
  make: string,
  model: string
): Promise<YearRange[]> => {
  const response = await apiClient.get(`/vehicles/makes/${encodeURIComponent(make)}/models/${encodeURIComponent(model)}/years`);
  return response.data.data;
};

export const createVehicle = async (data: Partial<Vehicle>): Promise<Vehicle> => {
  const response = await apiClient.post('/admin/vehicles', data);
  return response.data.data;
};

export const updateVehicle = async (id: number, data: Partial<Vehicle>): Promise<Vehicle> => {
  const response = await apiClient.put(`/admin/vehicles/${id}`, data);
  return response.data.data;
};

export const deleteVehicle = async (id: number): Promise<void> => {
  await apiClient.delete(`/admin/vehicles/${id}`);
};
