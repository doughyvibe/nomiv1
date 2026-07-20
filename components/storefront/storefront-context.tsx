"use client";

import { createContext, useContext } from "react";

import type { PublishedStorefront } from "@/lib/stores/load-storefront";

const StorefrontContext = createContext<PublishedStorefront | null>(null);

export function StorefrontProvider({
  value,
  children,
}: {
  value: PublishedStorefront;
  children: React.ReactNode;
}) {
  return (
    <StorefrontContext.Provider value={value}>
      {children}
    </StorefrontContext.Provider>
  );
}

export function useStorefront(): PublishedStorefront {
  const ctx = useContext(StorefrontContext);
  if (!ctx) {
    throw new Error("useStorefront must be used within StorefrontProvider");
  }
  return ctx;
}

export function usePreviewMode(): boolean {
  return Boolean(useStorefront().previewMode);
}
