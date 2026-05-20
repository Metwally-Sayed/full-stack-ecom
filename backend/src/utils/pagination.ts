export interface PaginationRange {
  from: number;
  to: number;
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function getPaginationRange(page: number, limit: number): PaginationRange {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  return { from, to, page, limit };
}

export function buildMeta(page: number, limit: number, total: number): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
