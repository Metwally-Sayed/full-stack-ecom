import { supabaseAdmin } from '../../config/supabase.js';
import { AppError } from '../../utils/app-error.js';
import { getPaginationRange, buildMeta } from '../../utils/pagination.js';
import * as repo from './orders.repository.js';
import type { Order, OrderItem, CreateOrderInput, OrderUser } from './orders.types.js';
import type { OrderStatus } from '../../types/common.js';

function mapItem(item: Record<string, unknown>): OrderItem {
  const product = item.products as Record<string, unknown> | null;
  return {
    id: item.id as string,
    productId: (item.product_id as string | null) ?? null,
    productName: (product?.name as string | null) ?? null,
    productImageUrl: (product?.image_url as string | null) ?? null,
    quantity: item.quantity as number,
    unitPrice: Number(item.unit_price),
    lineTotal: Number(item.unit_price) * (item.quantity as number),
  };
}

function mapOrder(
  row: Record<string, unknown>,
  profile?: { id: string; name: string; email: string } | null,
): Order {
  const items = (row.order_items as Record<string, unknown>[] | null) ?? [];
  return {
    id: row.id as string,
    status: row.status as OrderStatus,
    totalAmount: Number(row.total_amount),
    createdAt: row.created_at as string,
    ...(profile ? { user: profile as OrderUser } : {}),
    items: items.map(mapItem),
  };
}

export async function createOrder(userId: string, input: CreateOrderInput): Promise<Order> {
  const productIds = input.items.map((i) => i.productId);

  const { data: products, error } = await supabaseAdmin
    .from('products')
    .select('id, name, price, is_active')
    .in('id', productIds);

  if (error) throw error;

  if (!products || products.length !== productIds.length) {
    const foundIds = new Set((products ?? []).map((p) => p.id as string));
    const missing = productIds.filter((id) => !foundIds.has(id));
    throw new AppError(400, 'Bad Request', `Products not found: ${missing.join(', ')}`);
  }

  const inactive = products.filter((p) => !p.is_active);
  if (inactive.length > 0) {
    throw new AppError(
      400,
      'Bad Request',
      `Products not available: ${inactive.map((p) => p.name as string).join(', ')}`,
    );
  }

  const productMap = new Map(products.map((p) => [p.id as string, p]));

  const totalAmount = input.items.reduce((sum, item) => {
    const product = productMap.get(item.productId)!;
    return sum + Number(product.price) * item.quantity;
  }, 0);

  const orderId = await repo.insertOrder(userId, totalAmount);

  await repo.insertOrderItems(
    input.items.map((item) => ({
      order_id: orderId,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: Number(productMap.get(item.productId)!.price),
    })),
  );

  const row = await repo.getOrderById(orderId);
  if (!row) throw new AppError(500, 'Internal Server Error', 'Failed to fetch created order');
  return mapOrder(row as unknown as Record<string, unknown>);
}

export async function getMyOrders(userId: string, page: number, limit: number) {
  const { from, to } = getPaginationRange(page, limit);
  const { data, count } = await repo.listMyOrders(userId, from, to);
  return {
    data: data.map((row) => mapOrder(row as unknown as Record<string, unknown>)),
    meta: buildMeta(page, limit, count),
  };
}

export async function getAllOrders(opts: { status?: string; page: number; limit: number }) {
  const { from, to } = getPaginationRange(opts.page, opts.limit);
  const { data, count } = await repo.listAllOrders({ status: opts.status, from, to });
  return {
    data: data.map((row) =>
      mapOrder(
        row as Record<string, unknown>,
        (row.profile as { id: string; name: string; email: string } | null) ?? undefined,
      ),
    ),
    meta: buildMeta(opts.page, opts.limit, count),
  };
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  const existing = await repo.getOrderById(id);
  if (!existing) throw new AppError(404, 'Not Found', 'Order not found');

  const row = await repo.updateOrderStatus(id, status);
  return mapOrder(row as unknown as Record<string, unknown>);
}
