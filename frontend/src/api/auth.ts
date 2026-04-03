import apiClient from './client';
import { AuthResponse, LoginCredentials, RegisterData, User } from '../types';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data.data;
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/register', data);
  return response.data.data;
};

export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout');
};

export const getProfile = async (): Promise<User> => {
  const response = await apiClient.get('/auth/profile');
  return response.data.data;
};

export const updateProfile = async (data: Partial<User>): Promise<User> => {
  const response = await apiClient.put('/auth/profile', data);
  return response.data.data;
};

export const changePassword = async (data: {
  current_password: string;
  password: string;
  password_confirmation: string;
}): Promise<void> => {
  await apiClient.put('/auth/password', data);
};
