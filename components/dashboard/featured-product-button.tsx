"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Star } from "lucide-react";

import { setFeaturedProductAction } from "@/app/(dashboard)/dashboard/products/actions";
import { cn } from "@/lib/utils";

export function FeaturedProductButton({
  productId,
  isFeatured,
}: {
  productId: string;
  isFeatured: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (isFeatured || pending) return;

    startTransition(async () => {
      await setFeaturedProductAction(productId);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending || isFeatured}
      aria-label={isFeatured ? "Featured on storefront" : "Feature on storefront"}
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors",
        isFeatured
          ? "border-primary bg-primary text-foreground"
          : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
      )}
    >
      <Star className={cn("size-4", isFeatured && "fill-current")} />
    </button>
  );
}
