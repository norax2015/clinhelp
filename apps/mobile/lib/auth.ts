import * as SecureStore from 'expo-secure-store';
import type { AuthUser } from '@clinhelp/types';

const TOKEN_KEY = 'clinhelp_token';
const USER_KEY = 'clinhelp_user';

export async function storeToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function removeToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function storeUser(user: AuthUser): Promise<void> {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}

export async function getStoredUser(): Promise<AuthUser | null> {
  try {
    const raw = await SecureStore.getItemAsync(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export async function removeUser(): Promise<void> {
  await SecureStore.deleteItemAsync(USER_KEY);
}

export async function clearAuth(): Promise<void> {
  await Promise.all([removeToken(), removeUser()]);
}
