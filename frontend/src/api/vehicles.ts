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

export const getMakes = async (): Promise<{ make: string }[]> => {
  const response = await apiClient.get('/vehicles/makes');
  return response.data.data;
};

export const getModels = async (make: string): Promise<{ model: string }[]> => {
  const response = await apiClient.get(`/vehicles/models`, { params: { make } });
  return response.data.data;
};

export const getYears = async (
  make: string,
  model: string
): Promise<{ year_from: number; year_to: number }[]> => {
  const response = await apiClient.get(`/vehicles/years`, { params: { make, model } });
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
