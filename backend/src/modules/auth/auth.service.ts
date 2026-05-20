import { supabaseAdmin, supabaseAnon } from '../../config/supabase.js';
import { env } from '../../config/env.js';
import { AppError } from '../../utils/app-error.js';
import type { AuthResponse, Profile } from './auth.types.js';
import type { RegisterInput, LoginInput, ForgotPasswordInput } from './auth.schemas.js';

async function fetchProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('id, email, name, role, created_at')
    .eq('id', userId)
    .single();

  if (error || !data) {
    throw new AppError(500, 'Internal Server Error', 'Failed to fetch user profile');
  }

  return {
    id: data.id as string,
    email: data.email as string,
    name: data.name as string,
    role: data.role as 'customer' | 'admin',
    createdAt: data.created_at as string,
  };
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: { name: input.name },
  });

  if (createError) {
    if (createError.message.toLowerCase().includes('already')) {
      throw new AppError(409, 'Conflict', 'Email address is already registered');
    }
    throw new AppError(500, 'Internal Server Error', createError.message);
  }

  const authUser = createData.user!;

  const { error: profileError } = await supabaseAdmin.from('profiles').insert({
    id: authUser.id,
    email: input.email,
    name: input.name,
    role: 'customer',
  });

  if (profileError && !profileError.message.includes('duplicate')) {
    throw new AppError(500, 'Internal Server Error', 'Failed to create user profile');
  }

  const { data: signInData, error: signInError } = await supabaseAnon.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (signInError || !signInData.session) {
    throw new AppError(500, 'Internal Server Error', 'User created but failed to create session');
  }

  const profile = await fetchProfile(authUser.id);

  return {
    user: profile,
    accessToken: signInData.session.access_token,
    refreshToken: signInData.session.refresh_token,
  };
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const { data, error } = await supabaseAnon.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error || !data.session) {
    throw new AppError(401, 'Unauthorized', 'Invalid email or password');
  }

  const profile = await fetchProfile(data.user.id);

  return {
    user: profile,
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
  };
}

export async function forgotPassword(input: ForgotPasswordInput): Promise<void> {
  const redirectTo =
    env.PASSWORD_RESET_REDIRECT_URL ?? `${env.CORS_ORIGIN}/reset-password`;

  const { error } = await supabaseAnon.auth.resetPasswordForEmail(input.email, {
    redirectTo,
  });

  if (error) {
    throw new AppError(500, 'Internal Server Error', 'Failed to send reset email');
  }
}

export async function me(userId: string): Promise<Profile> {
  return fetchProfile(userId);
}
