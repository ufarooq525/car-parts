import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Cart } from '../types';
import * as cartApi from '../api/cart';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  itemCount: number;
  total: number;
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const total = cart?.total ?? 0;

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const data = await cartApi.getCart();
      setCart(data);
    } catch {
      // user might not be logged in
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch cart when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated, fetchCart]);

  const addItem = useCallback(async (productId: number, quantity: number = 1) => {
    const data = await cartApi.addToCart(productId, quantity);
    setCart(data);
  }, []);

  const updateItem = useCallback(async (itemId: number, quantity: number) => {
    const data = await cartApi.updateCartItem(itemId, quantity);
    setCart(data);
  }, []);

  const removeItem = useCallback(async (itemId: number) => {
    const data = await cartApi.removeCartItem(itemId);
    setCart(data);
  }, []);

  const clearCart = useCallback(async () => {
    await cartApi.clearCart();
    setCart(null);
  }, []);

  return (
    <CartContext.Provider
      value={{ cart, loading, itemCount, total, fetchCart, addItem, updateItem, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
