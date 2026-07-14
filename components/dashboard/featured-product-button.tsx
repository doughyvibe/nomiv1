"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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
  const [error, setError] = useState<string | null>(null);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;

    setError(null);
    startTransition(async () => {
      const result = await setFeaturedProductAction(productId);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-pressed={isFeatured}
        aria-label={
          isFeatured
            ? "Remove featured from storefront"
            : "Feature on storefront"
        }
        title={isFeatured ? "Remove featured" : "Feature on storefront"}
        className={cn(
          "flex size-10 items-center justify-center rounded-full border transition-colors",
          isFeatured
            ? "border-primary bg-primary text-foreground"
            : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
        )}
      >
        <Star className={cn("size-4", isFeatured && "fill-current")} />
      </button>
      {error ? (
        <p
          className="text-destructive absolute top-full right-0 z-10 mt-1 w-40 text-right text-[10px] leading-tight"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
