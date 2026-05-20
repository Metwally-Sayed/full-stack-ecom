import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getAccessToken } from '@/lib/storage';
import { getSupabaseClient } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth-store';
import type { PaginatedResponse } from '@/types/api';
import type { Product } from '@/types/product';

type ProductRealtimePayload = {
  event?: 'created' | 'updated' | 'deactivated';
  productId?: string;
  product?: Product;
};

function syncProductCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  payload: ProductRealtimePayload,
) {
  if (payload.product) {
    const changedProduct = payload.product;
    queryClient.setQueryData(['product', payload.product.id], payload.product);
    queryClient.setQueriesData<PaginatedResponse<Product>>(
      { queryKey: ['products'] },
      (current) => {
        if (!current) return current;

        return {
          ...current,
          data: current.data.map((product) =>
            product.id === changedProduct.id ? changedProduct : product,
          ),
        };
      },
    );
  }

  void queryClient.invalidateQueries({ queryKey: ['products'] });
  void queryClient.invalidateQueries({ queryKey: ['product'] });
}

export function useRealtimeSubscriptions() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      return undefined;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return undefined;
    }
    const supabaseClient = supabase;

    let isMounted = true;
    let cleanup: (() => void) | undefined;

    async function subscribe() {
      const accessToken = await getAccessToken();
      if (!isMounted || !accessToken) {
        return;
      }

      await supabaseClient.setAuth(accessToken);

      const channel = supabaseClient
        .channel('mobile-store-realtime')
        .on(
          'broadcast',
          { event: 'product_changed' },
          ({ payload }: { payload: ProductRealtimePayload }) => {
            syncProductCaches(queryClient, payload);
          },
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'products',
          },
          () => {
            syncProductCaches(queryClient, {});
          },
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders',
          },
          () => {
            void queryClient.invalidateQueries({ queryKey: ['my-orders'] });
          },
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'order_items',
          },
          () => {
            void queryClient.invalidateQueries({ queryKey: ['my-orders'] });
          },
        )
        .subscribe();

      cleanup = () => {
        void supabaseClient.removeChannel(channel);
      };
    }

    void subscribe();

    return () => {
      isMounted = false;
      if (cleanup) {
        cleanup();
      }
    };
  }, [isAuthenticated, queryClient]);
}
