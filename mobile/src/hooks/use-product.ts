import { useQuery } from '@tanstack/react-query';
import { getProductById } from '@/services/products.service';

export function useProduct(id: string) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
    enabled: !!id,
    staleTime: 30_000,
  });

  return { product: data, isLoading, isError, refetch };
}
