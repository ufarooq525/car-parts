import apiClient from './client';
import { Cart } from '../types';

export const getCart = async (): Promise<Cart> => {
  const response = await apiClient.get('/cart');
  return response.data.data;
};

export const addToCart = async (productId: number, quantity: number = 1): Promise<Cart> => {
  const response = await apiClient.post('/cart/items', {
    product_id: productId,
    quantity,
  });
  return response.data.data;
};

export const updateCartItem = async (itemId: number, quantity: number): Promise<Cart> => {
  const response = await apiClient.put(`/cart/items/${itemId}`, { quantity });
  return response.data.data;
};

export const removeCartItem = async (itemId: number): Promise<Cart> => {
  const response = await apiClient.delete(`/cart/items/${itemId}`);
  return response.data.data;
};

export const clearCart = async (): Promise<void> => {
  await apiClient.delete('/cart');
};
