import { useRealtimeSubscriptions } from '@/hooks/use-realtime-subscriptions';

export function RealtimeBridge() {
  useRealtimeSubscriptions();
  return null;
}
