import { RealtimeClient } from '@supabase/realtime-js';
import { ENV } from '@/config/env';

let client: RealtimeClient | null = null;

export function getSupabaseClient(): RealtimeClient | null {
  if (!ENV.SUPABASE_URL || !ENV.SUPABASE_ANON_KEY) {
    return null;
  }

  if (!client) {
    client = new RealtimeClient(`${ENV.SUPABASE_URL}/realtime/v1`, {
      params: {
        apikey: ENV.SUPABASE_ANON_KEY,
      },
    });
  }

  return client;
}
