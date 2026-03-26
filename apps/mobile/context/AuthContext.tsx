import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import type { AuthUser } from '@clinhelp/types';
import { authApi } from '../lib/api';
import {
  storeToken,
  storeUser,
  getToken,
  getStoredUser,
  clearAuth,
} from '../lib/auth';
import { queryClient } from '../lib/queryClient';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    async function restore() {
      try {
        const [storedToken, storedUser] = await Promise.all([
          getToken(),
          getStoredUser(),
        ]);
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
        }
      } catch {
        // Silently ignore; user will be sent to login
      } finally {
        setIsLoading(false);
      }
    }
    restore();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    const { accessToken, user: authUser } = response.data.data ?? response.data;

    await Promise.all([storeToken(accessToken), storeUser(authUser)]);
    setToken(accessToken);
    setUser(authUser);
  }, []);

  const logout = useCallback(async () => {
    await clearAuth();
    queryClient.clear();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
