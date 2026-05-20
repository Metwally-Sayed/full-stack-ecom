import { supabaseAdmin } from '../../config/supabase.js';

export async function getAllCategories() {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('id, name, slug')
    .order('name');

  if (error) throw error;
  return data ?? [];
}
