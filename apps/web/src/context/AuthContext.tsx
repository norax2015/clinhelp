'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { AuthUser } from '@clinhelp/types';
import { authApi } from '@/lib/api';
import {
  getStoredUser,
  clearAuthStorage,
  storeAuthSession,
  getToken,
} from '@/lib/auth';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    // Optimistically restore from localStorage
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
    }

    try {
      const response = await authApi.me();
      // API returns the user object directly (no nested data wrapper)
      const freshUser = response.data as AuthUser;
      setUser(freshUser);
      // Update stored user
      import('@/lib/auth').then(({ setStoredUser }) => setStoredUser(freshUser));
    } catch {
      // Token invalid — clear session
      clearAuthStorage();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Listen for 401 events dispatched by the axios response interceptor
  useEffect(() => {
    const handleExpired = () => {
      setUser(null);
      // AppLayout will pick up isAuthenticated=false and redirect to /auth/login
    };
    window.addEventListener('clinhelp:auth:expired', handleExpired);
    return () => window.removeEventListener('clinhelp:auth:expired', handleExpired);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    // API returns { accessToken, user } flat (no nested data wrapper)
    const { user: authUser, accessToken } = response.data as {
      user: AuthUser;
      accessToken: string;
    };
    storeAuthSession(authUser, { accessToken, expiresIn: 0 });
    setUser(authUser);
  }, []);

  const logout = useCallback(() => {
    authApi.logout().catch(() => {});
    clearAuthStorage();
    setUser(null);
    window.location.href = '/auth/login';
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await authApi.me();
      // API returns the user object directly (no nested data wrapper)
      const freshUser = response.data as AuthUser;
      setUser(freshUser);
      import('@/lib/auth').then(({ setStoredUser }) => setStoredUser(freshUser));
    } catch {
      // ignore
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used inside <AuthProvider>');
  }
  return ctx;
}
