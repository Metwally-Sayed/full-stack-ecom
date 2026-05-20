import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/services/categories.service';

export function useCategories() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 60_000,
  });

  return { categories: data ?? [], isLoading, isError, refetch };
}
