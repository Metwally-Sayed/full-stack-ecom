import { AppError } from '../../utils/app-error.js';
import { getPaginationRange, buildMeta } from '../../utils/pagination.js';
import * as repo from './products.repository.js';
import { broadcastProductChange } from './products.realtime.js';
import type { Product, CreateProductInput, UpdateProductInput, ProductListQuery } from './products.types.js';

function mapProduct(row: Record<string, unknown>): Product {
  const cat = row.categories as Record<string, string> | null;
  return {
    id: row.id as string,
    name: row.name as string,
    description: (row.description as string | null) ?? null,
    price: Number(row.price),
    imageUrl: (row.image_url as string | null) ?? null,
    isActive: row.is_active as boolean,
    category: cat ? { id: cat.id, name: cat.name, slug: cat.slug } : null,
    createdAt: row.created_at as string,
  };
}

export async function listProducts(query: ProductListQuery) {
  const { from, to } = getPaginationRange(query.page, query.limit);
  const { data, count } = await repo.listProducts({
    search: query.search,
    category: query.category,
    status: query.status,
    from,
    to,
  });

  return {
    data: data.map((row) => mapProduct(row as Record<string, unknown>)),
    meta: buildMeta(query.page, query.limit, count),
  };
}

export async function getProduct(id: string): Promise<Product> {
  const row = await repo.getProductById(id);
  if (!row) throw new AppError(404, 'Not Found', 'Product not found');
  return mapProduct(row as Record<string, unknown>);
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const exists = await repo.categoryExists(input.categoryId);
  if (!exists) throw new AppError(404, 'Not Found', 'Category not found');

  const row = await repo.createProduct({
    name: input.name,
    description: input.description,
    price: input.price,
    image_url: input.imageUrl,
    category_id: input.categoryId,
  });

  const product = mapProduct(row as Record<string, unknown>);
  await broadcastProductChange('created', product);
  return product;
}

export async function updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
  const existing = await repo.getProductByIdAdmin(id);
  if (!existing) throw new AppError(404, 'Not Found', 'Product not found');

  if (input.categoryId) {
    const exists = await repo.categoryExists(input.categoryId);
    if (!exists) throw new AppError(404, 'Not Found', 'Category not found');
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (input.name !== undefined) updates.name = input.name;
  if (input.description !== undefined) updates.description = input.description;
  if (input.price !== undefined) updates.price = input.price;
  if (input.imageUrl !== undefined) updates.image_url = input.imageUrl;
  if (input.categoryId !== undefined) updates.category_id = input.categoryId;
  if (input.isActive !== undefined) updates.is_active = input.isActive;

  const row = await repo.updateProduct(id, updates);
  const product = mapProduct(row as Record<string, unknown>);
  await broadcastProductChange(product.isActive ? 'updated' : 'deactivated', product);
  return product;
}

export async function softDeleteProduct(id: string): Promise<void> {
  const existing = await repo.getProductByIdAdmin(id);
  if (!existing) throw new AppError(404, 'Not Found', 'Product not found');
  await repo.softDeleteProduct(id);
  const product = mapProduct({
    ...(existing as Record<string, unknown>),
    is_active: false,
  });
  await broadcastProductChange('deactivated', product);
}
