import { supabaseAdmin } from '../../config/supabase.js';

const ORDER_SELECT = `
  id, status, total_amount, created_at, user_id,
  order_items(
    id, quantity, unit_price, product_id,
    products(id, name, image_url)
  )
`.trim();

export async function insertOrder(userId: string, totalAmount: number): Promise<string> {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .insert({ user_id: userId, status: 'Pending', total_amount: totalAmount })
    .select('id')
    .single();

  if (error || !data) throw error ?? new Error('Failed to create order');
  return data.id as string;
}

export async function insertOrderItems(
  items: { order_id: string; product_id: string; quantity: number; unit_price: number }[],
): Promise<void> {
  const { error } = await supabaseAdmin.from('order_items').insert(items);
  if (error) throw error;
}

export async function getOrderById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select(ORDER_SELECT)
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}

export async function listMyOrders(userId: string, from: number, to: number) {
  const { data, error, count } = await supabaseAdmin
    .from('orders')
    .select(ORDER_SELECT, { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { data: data ?? [], count: count ?? 0 };
}

export async function listAllOrders(opts: { status?: string; from: number; to: number }) {
  let query = supabaseAdmin
    .from('orders')
    .select(ORDER_SELECT, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(opts.from, opts.to);

  if (opts.status) query = query.eq('status', opts.status);

  const { data: rawOrders, error, count } = await query;
  if (error) throw error;

  const orders = (rawOrders ?? []) as unknown as Record<string, unknown>[];

  // Fetch profiles separately (orders.user_id → auth.users → profiles is not a direct FK join)
  const userIds = [...new Set(orders.map((o) => o.user_id as string))];
  let profileMap = new Map<string, { id: string; name: string; email: string }>();

  if (userIds.length > 0) {
    const { data: profiles } = await supabaseAdmin
      .from('profiles')
      .select('id, name, email')
      .in('id', userIds);

    profileMap = new Map(
      (profiles ?? []).map((p) => [
        p.id as string,
        { id: p.id as string, name: p.name as string, email: p.email as string },
      ]),
    );
  }

  return {
    data: orders.map((order) => ({
      ...order,
      profile: profileMap.get(order.user_id as string) ?? null,
    })),
    count: count ?? 0,
  };
}

export async function updateOrderStatus(id: string, status: string) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(ORDER_SELECT)
    .single();

  if (error || !data) throw error ?? new Error('Failed to update order');
  return data;
}
