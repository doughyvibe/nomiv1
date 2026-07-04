import type { SupabaseClient } from "@supabase/supabase-js";

export type PushSubscriptionRow = {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth_key: string;
  created_at: string;
};

export async function listUserPushSubscriptions(
  supabase: SupabaseClient,
  userId: string,
): Promise<PushSubscriptionRow[]> {
  const { data } = await supabase
    .from("push_subscriptions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (data as PushSubscriptionRow[]) ?? [];
}

/** Load subscriptions for server-side push send (Task 5.4). */
export async function listPushSubscriptionsForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<PushSubscriptionRow[]> {
  return listUserPushSubscriptions(supabase, userId);
}
