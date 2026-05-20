import axios from 'axios';
import { ENV } from '@/config/env';
import { getAccessToken, clearAuthStorage } from '@/lib/storage';

export const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      await clearAuthStorage();
      // Lazy import avoids circular dependency with auth-store
      const { useAuthStore } = await import('@/stores/auth-store');
      useAuthStore.getState().clearUser();
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const msg = error.response?.data?.message as string | undefined;
    if (typeof msg === 'string' && msg.length > 0) return msg;
  }
  return 'Something went wrong';
}
