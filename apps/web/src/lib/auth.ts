import type { AuthUser, AuthTokens } from '@clinhelp/types';

const TOKEN_KEY = 'clinhelp_token';
const USER_KEY = 'clinhelp_user';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function removeStoredUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_KEY);
}

export function clearAuthStorage(): void {
  removeToken();
  removeStoredUser();
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function storeAuthTokens(tokens: AuthTokens): void {
  setToken(tokens.accessToken);
}

export function storeAuthSession(user: AuthUser, tokens: AuthTokens): void {
  storeAuthTokens(tokens);
  setStoredUser(user);
}
