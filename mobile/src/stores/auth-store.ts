import { create } from 'zustand';
import type { User } from '@/types/auth';
import { getAccessToken, clearAuthStorage } from '@/lib/storage';
import { api } from '@/lib/api';

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  hydrateAuth: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: true }),

  clearUser: () => set({ user: null, isAuthenticated: false }),

  hydrateAuth: async () => {
    set({ isLoading: true });
    try {
      const token = await getAccessToken();
      if (!token) {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }
      const res = await api.get<{ data: User }>('/auth/me');
      set({ user: res.data.data, isAuthenticated: true, isLoading: false });
    } catch {
      await clearAuthStorage();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  logout: async () => {
    await clearAuthStorage();
    set({ user: null, isAuthenticated: false });
  },
}));
