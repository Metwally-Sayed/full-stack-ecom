import { FastifyRequest, FastifyReply } from 'fastify';
import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../utils/app-error.js';

export async function requireAuth(
  request: FastifyRequest,
  _reply: FastifyReply,
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError(401, 'Unauthorized', 'Missing or invalid Authorization header');
  }

  const token = authHeader.split(' ')[1];

  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token);

  if (authError || !user) {
    throw new AppError(401, 'Unauthorized', 'Invalid or expired token');
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id, email, name, role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    throw new AppError(401, 'Unauthorized', 'User profile not found');
  }

  request.user = {
    id: profile.id as string,
    email: profile.email as string,
    name: profile.name as string,
    role: profile.role as 'customer' | 'admin',
  };
}
