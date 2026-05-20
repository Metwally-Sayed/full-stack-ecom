import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getProducts, type ProductsParams } from '@/services/products.service';

export function useProducts(params?: ProductsParams) {
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });

  return {
    products: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    isFetching,
    isError,
    refetch,
  };
}
