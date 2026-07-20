import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CircleCheck,
  ClipboardList,
  Clock,
  Hash,
  Package,
  Palette,
  Share2,
} from "lucide-react";

import { CopyStoreLinkButton } from "@/components/dashboard/copy-store-link-button";
import {
  DashboardEmptyState,
  DashboardPanel,
  DashboardPanelBody,
  DashboardPanelHeader,
  DashboardStatCard,
} from "@/components/dashboard/dashboard-ui";
import { PublishStoreCta } from "@/components/dashboard/publish-store-cta";
import { StoreReadinessChecklist } from "@/components/dashboard/store-readiness-checklist";
import {
  isBillingEnabled,
  subscriptionAllowsPublish,
} from "@/lib/billing/plans";
import { getStorefrontPreviewUrl } from "@/lib/host";
import type { OrderSummary } from "@/lib/orders/order-summary";
import { storePublishIssues } from "@/lib/stores/publish-readiness";
import type { Store } from "@/lib/stores/types";

type DashboardHomeProps = {
  store: Store;
  storeUrl: string;
  summary: OrderSummary;
  productCount: number;
};

const QUICK_ACTIONS = [
  {
    href: "/orders",
    label: "View orders",
    Icon: ClipboardList,
    tint: "bg-[var(--brand-purple-soft)] text-[var(--brand-purple)]",
  },
  {
    href: "/products/new",
    label: "Add product",
    Icon: Package,
    tint: "bg-primary text-foreground",
  },
  {
    href: "/storefront",
    label: "Edit storefront",
    Icon: Palette,
    tint: "bg-[var(--brand-mint-soft)] text-[var(--brand-mint)]",
  },
] as const;

export function DashboardHome({
  store,
  storeUrl,
  summary,
  productCount,
}: DashboardHomeProps) {
  const hasOrders = summary.total > 0;
  const displayUrl = storeUrl.replace(/^https?:\/\//, "");
  const isPublished = store.status === "published";
  const publishIssues = storePublishIssues(store, productCount);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-display text-[2rem] leading-tight font-extrabold tracking-[-0.02em] sm:text-[2.25rem]">
          👋 Welcome Back
        </h1>
      </header>

      <PublishStoreCta
        isPublished={isPublished}
        issues={publishIssues}
        billingEnabled={isBillingEnabled()}
        hasActivePlan={subscriptionAllowsPublish(store.subscription_status)}
      />

      <StoreReadinessChecklist
        store={store}
        productCount={productCount}
        storeUrl={storeUrl}
      />

      <DashboardPanel>
        <DashboardPanelHeader
          title="Store link"
          description={
            isPublished
              ? "Drop this in your bio, Stories, or WhatsApp status."
              : "Share this while you build — visitors will see Coming Soon until you publish."
          }
          action={
            isPublished ? (
              <span className="hidden items-center gap-1.5 rounded-full bg-[var(--brand-mint-soft)] px-3 py-1 text-xs font-semibold text-[var(--brand-mint)] sm:inline-flex">
                <Share2 className="size-3.5" strokeWidth={2.5} />
                Ready to share
              </span>
            ) : (
              <span className="hidden items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground sm:inline-flex">
                Coming soon
              </span>
            )
          }
        />
        <DashboardPanelBody className="space-y-4">
          <div className="rounded-2xl border border-border bg-[var(--brand-bg-soft)] px-4 py-4">
            <p className="break-all font-mono text-base font-medium text-foreground">
              {displayUrl}
            </p>
          </div>
          <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
            <CopyStoreLinkButton url={storeUrl} />
            {isPublished ? (
              <a
                href={storeUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-brand-dark inline-flex h-12 items-center justify-center gap-2 px-5 text-base"
              >
                Open storefront
                <ArrowUpRight className="size-4" strokeWidth={2.5} />
              </a>
            ) : (
              <a
                href={getStorefrontPreviewUrl(store.slug)}
                target="_blank"
                rel="noreferrer"
                className="btn-brand-dark inline-flex h-12 items-center justify-center gap-2 px-5 text-base"
              >
                Preview store
                <ArrowUpRight className="size-4" strokeWidth={2.5} />
              </a>
            )}
          </div>
        </DashboardPanelBody>
      </DashboardPanel>

      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-bold">
              Orders
            </h2>
            <p className="mt-1 text-base text-muted-foreground">
              {hasOrders
                ? "Tap a stat to filter your order list."
                : "Your first order will show up here."}
            </p>
          </div>
          {hasOrders ? (
            <Link
              href="/orders"
              className="text-base font-semibold text-foreground underline-offset-2 hover:underline"
            >
              View all
            </Link>
          ) : null}
        </div>

        {hasOrders ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <DashboardStatCard
              href="/orders?status=seller_verification_requested"
              label="Awaiting verification"
              value={summary.awaitingVerification}
              icon={Clock}
              tint="yellow"
            />
            <DashboardStatCard
              href="/orders?status=seller_confirmed_paid"
              label="Paid"
              value={summary.paid}
              icon={CircleCheck}
              tint="purple"
            />
            <DashboardStatCard
              href="/orders"
              label="Total orders"
              value={summary.total}
              icon={Hash}
              tint="mint"
            />
          </div>
        ) : (
          <DashboardPanel>
            <DashboardEmptyState
              title="No orders yet"
              description="Share your store link to start receiving PayNow orders from buyers."
            >
              <CopyStoreLinkButton url={storeUrl} />
              <a
                href={storeUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-brand-outline inline-flex h-11 items-center px-5"
              >
                Test checkout
              </a>
            </DashboardEmptyState>
          </DashboardPanel>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-bold">
          Quick actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="dashboard-stat group flex min-h-14 items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-all hover:border-foreground/15 hover:shadow-[0_4px_20px_rgba(22,19,14,0.06)] sm:p-5"
            >
              <span
                className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${action.tint}`}
              >
                <action.Icon className="size-5" strokeWidth={2} />
              </span>
              <span className="flex-1 text-base font-semibold">{action.label}</span>
              <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>

      {!hasOrders ? (
        <ul className="space-y-2.5 rounded-2xl border border-dashed border-border bg-card/50 px-5 py-4 text-base text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-foreground">·</span>
            Copy your store link and add it to Instagram or TikTok
          </li>
          <li className="flex gap-2">
            <span className="text-foreground">·</span>
            <Link href="/products" className="font-semibold text-foreground underline-offset-2 hover:underline">
              Add more products
            </Link>{" "}
            so buyers have more to browse
          </li>
        </ul>
      ) : null}
    </div>
  );
}
