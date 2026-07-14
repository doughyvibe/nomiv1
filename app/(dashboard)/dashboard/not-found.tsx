import Link from "next/link";

import {
  BrandLink,
  BrandLinkOutline,
  DashboardPanel,
  DashboardPanelBody,
} from "@/components/dashboard/dashboard-ui";
import { Wordmark } from "@/components/marketing/wordmark";

export default function DashboardNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-12">
      <DashboardPanel className="w-full max-w-md text-center">
        <DashboardPanelBody className="flex flex-col items-center gap-4 py-10">
          <Wordmark />
          <div>
            <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              404
            </p>
            <h1 className="font-display mt-2 text-2xl font-extrabold tracking-[-0.02em]">
              Page not found
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              That product, order, or link doesn&apos;t exist — or you don&apos;t
              have access to it.
            </p>
          </div>
          <div className="mt-2 flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
            <BrandLink href="/" className="sm:min-w-32">
              Home
            </BrandLink>
            <BrandLinkOutline href="/orders" className="sm:min-w-32">
              Orders
            </BrandLinkOutline>
            <BrandLinkOutline href="/products" className="sm:min-w-32">
              Products
            </BrandLinkOutline>
          </div>
          <p className="text-muted-foreground text-xs">
            Or open{" "}
            <Link href="/settings" className="underline underline-offset-2">
              Settings
            </Link>
            .
          </p>
        </DashboardPanelBody>
      </DashboardPanel>
    </div>
  );
}
