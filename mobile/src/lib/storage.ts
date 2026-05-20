import * as SecureStore from 'expo-secure-store';

const KEYS = {
  ACCESS_TOKEN: 'mini_shop_access_token',
  REFRESH_TOKEN: 'mini_shop_refresh_token',
} as const;

export async function saveAccessToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, token);
}

export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
}

export async function removeAccessToken(): Promise<void> {
  await SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN);
}

export async function saveRefreshToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, token);
}

export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
}

export async function removeRefreshToken(): Promise<void> {
  await SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN);
}

export async function clearAuthStorage(): Promise<void> {
  await Promise.all([removeAccessToken(), removeRefreshToken()]);
}
