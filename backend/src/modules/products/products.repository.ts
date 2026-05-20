import { supabaseAdmin } from '../../config/supabase.js';

const PRODUCT_SELECT =
  'id, name, description, price, image_url, is_active, created_at, categories(id, name, slug)';

export async function listProducts(opts: {
  search?: string;
  category?: string;
  status: 'all' | 'active' | 'inactive';
  from: number;
  to: number;
}) {
  let categoryId: string | undefined;
  if (opts.category) {
    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isUUID = UUID_RE.test(opts.category);
    let catQuery = supabaseAdmin.from('categories').select('id');
    catQuery = isUUID
      ? catQuery.or(`slug.eq.${opts.category},id.eq.${opts.category}`)
      : catQuery.eq('slug', opts.category);
    const { data: cat } = await catQuery.maybeSingle();
    if (!cat) return { data: [], count: 0 };
    categoryId = cat.id as string;
  }

  let query = supabaseAdmin
    .from('products')
    .select(PRODUCT_SELECT, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(opts.from, opts.to);

  if (opts.status === 'active') query = query.eq('is_active', true);
  if (opts.status === 'inactive') query = query.eq('is_active', false);
  if (opts.search) query = query.ilike('name', `%${opts.search}%`);
  if (categoryId) query = query.eq('category_id', categoryId);

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: data ?? [], count: count ?? 0 };
}

export async function getProductById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getProductByIdAdmin(id: string) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function categoryExists(categoryId: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('categories')
    .select('id')
    .eq('id', categoryId)
    .single();
  return !!data;
}

export async function createProduct(input: {
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category_id: string;
}) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .insert(input)
    .select(PRODUCT_SELECT)
    .single();

  if (error || !data) throw error ?? new Error('Failed to create product');
  return data;
}

export async function updateProduct(
  id: string,
  updates: Record<string, unknown>,
) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .update(updates)
    .eq('id', id)
    .select(PRODUCT_SELECT)
    .single();

  if (error || !data) throw error ?? new Error('Failed to update product');
  return data;
}

export async function softDeleteProduct(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('products')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}
