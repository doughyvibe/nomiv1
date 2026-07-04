import {
  saveFulfillmentAction,
  savePayNowAction,
} from "@/app/(dashboard)/dashboard/settings/actions";
import { FulfillmentForm } from "@/components/dashboard/fulfillment-form";
import { PayNowForm } from "@/components/dashboard/paynow-form";
import { PushAlertsSettings } from "@/components/dashboard/push-alerts-settings";
import { StoreStatusSettings } from "@/components/dashboard/store-status-settings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listUserPushSubscriptions } from "@/lib/push/subscriptions";
import { getVapidPublicKey } from "@/lib/push/vapid";
import { storePublishReadiness } from "@/lib/stores/publish-readiness";
import { requireSellerStore } from "@/lib/stores/require-seller";

export default async function SettingsPage() {
  const { supabase, store } = await requireSellerStore();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ count: productCount }, subscriptions] = await Promise.all([
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("store_id", store.id)
      .eq("archived", false),
    user ? listUserPushSubscriptions(supabase, user.id) : Promise.resolve([]),
  ]);

  const { issues: publishIssues } = storePublishReadiness(
    store,
    productCount ?? 0,
  );

  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-col gap-6 p-4 pb-8">
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Fulfillment, payments, store status, and notifications
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Store status</CardTitle>
          <CardDescription>Publish or hide your storefront</CardDescription>
        </CardHeader>
        <CardContent>
          <StoreStatusSettings store={store} publishIssues={publishIssues} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fulfillment</CardTitle>
          <CardDescription>Pickup and delivery options for buyers</CardDescription>
        </CardHeader>
        <CardContent>
          <FulfillmentForm store={store} onSave={saveFulfillmentAction} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">PayNow payment</CardTitle>
          <CardDescription>
            QR details and manual verification reminder
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PayNowForm store={store} onSave={savePayNowAction} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Push notifications</CardTitle>
          <CardDescription>
            Browser alerts when buyers request payment verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PushAlertsSettings
            vapidPublicKey={getVapidPublicKey()}
            serverSubscriptionCount={subscriptions.length}
          />
        </CardContent>
      </Card>
    </main>
  );
}
