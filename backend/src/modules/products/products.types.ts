export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isActive: boolean;
  category: ProductCategory | null;
  createdAt: string;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId: string;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string | null;
  categoryId?: string;
  isActive?: boolean;
}

export interface ProductListQuery {
  search?: string;
  category?: string;
  status: 'all' | 'active' | 'inactive';
  page: number;
  limit: number;
}
