import * as repo from './categories.repository.js';
import type { Category } from './categories.types.js';

export async function getCategories(): Promise<Category[]> {
  const rows = await repo.getAllCategories();
  return rows.map((row) => ({
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
  }));
}
