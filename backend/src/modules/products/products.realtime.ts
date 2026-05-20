import { supabaseAdmin } from '../../config/supabase.js';
import type { Product } from './products.types.js';

type ProductRealtimeEvent = 'created' | 'updated' | 'deactivated';

export async function broadcastProductChange(
  event: ProductRealtimeEvent,
  product: Product,
): Promise<void> {
  const channel = supabaseAdmin.channel('mobile-store-realtime', {
    config: {
      broadcast: { ack: true },
    },
  });

  try {
    const response = await channel.httpSend(
      'product_changed',
      {
        event,
        productId: product.id,
        product,
      },
    );

    if (!response.success) {
      console.warn('Failed to broadcast product realtime event', response);
    }
  } catch (error) {
    console.warn('Failed to broadcast product realtime event', error);
  } finally {
    await supabaseAdmin.removeChannel(channel);
  }
}
