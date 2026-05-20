import { api } from '@/lib/api';
import type { Product } from '@/types/product';
import type { PaginatedResponse } from '@/types/api';

export type ProductsParams = {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
};

export async function getProducts(
  params?: ProductsParams,
): Promise<PaginatedResponse<Product>> {
  const res = await api.get<PaginatedResponse<Product>>('/products', { params });
  return res.data;
}

export async function getProductById(id: string): Promise<Product> {
  const res = await api.get<{ data: Product }>(`/products/${id}`);
  return res.data.data;
}
