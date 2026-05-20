import { api } from '@/lib/api';
import type { AuthResponse, LoginInput, RegisterInput, ForgotPasswordInput, User } from '@/types/auth';

export async function login(data: LoginInput): Promise<AuthResponse> {
  const res = await api.post<{ data: AuthResponse }>('/auth/login', data);
  return res.data.data;
}

export async function register(data: RegisterInput): Promise<AuthResponse> {
  const res = await api.post<{ data: AuthResponse }>('/auth/register', data);
  return res.data.data;
}

export async function forgotPassword(data: ForgotPasswordInput): Promise<void> {
  await api.post('/auth/forgot-password', data);
}

export async function me(): Promise<User> {
  const res = await api.get<{ data: User }>('/auth/me');
  return res.data.data;
}
