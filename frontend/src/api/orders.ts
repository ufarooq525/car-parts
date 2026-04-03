import apiClient from './client';
import { PaginatedResponse, Order, OrderListItem } from '../types';

// Customer endpoints
export const getMyOrders = async (
  params?: Record<string, any>
): Promise<PaginatedResponse<OrderListItem>> => {
  const response = await apiClient.get('/orders', { params });
  return response.data;
};

export const getOrder = async (id: string | number): Promise<Order> => {
  const response = await apiClient.get(`/orders/${id}`);
  return response.data.data;
};

export const createOrder = async (data: {
  shipping_name: string;
  shipping_email: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  shipping_country: string;
  payment_method: string;
  notes?: string;
}): Promise<Order> => {
  const response = await apiClient.post('/orders', data);
  return response.data.data;
};

// Admin endpoints
export const getOrders = async (
  params?: Record<string, any>
): Promise<PaginatedResponse<OrderListItem>> => {
  const response = await apiClient.get('/admin/orders', { params });
  return response.data;
};

export const updateOrderStatus = async (
  id: number,
  data: {
    status: string;
    tracking_number?: string;
    tracking_company?: string;
  }
): Promise<Order> => {
  const response = await apiClient.put(`/admin/orders/${id}/status`, data);
  return response.data.data;
};
