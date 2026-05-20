import type { Category } from './category';

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isActive: boolean;
  category: Category | null;
  createdAt: string;
};
