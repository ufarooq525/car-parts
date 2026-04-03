import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, LoginCredentials, RegisterData } from '../types';
import * as authApi from '../api/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(true);

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === 'admin';
  const isStaff = user?.role === 'admin' || user?.role === 'staff';

  const setAuth = useCallback((authUser: User, authToken: string) => {
    setUser(authUser);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(authUser));
    localStorage.setItem('token', authToken);
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  // On mount, verify token by fetching profile
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const profile = await authApi.getProfile();
        setUser(profile);
        localStorage.setItem('user', JSON.stringify(profile));
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (credentials: LoginCredentials) => {
    const data = await authApi.login(credentials);
    setAuth(data.user, data.token);
  }, [setAuth]);

  const register = useCallback(async (registerData: RegisterData) => {
    const data = await authApi.register(registerData);
    setAuth(data.user, data.token);
  }, [setAuth]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    const updated = await authApi.updateProfile(data);
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        isStaff,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
