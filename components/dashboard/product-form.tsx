"use client";

import { ChevronDown, Plus } from "lucide-react";
import { useState, useTransition, type ReactNode } from "react";

import {
  ChoicesSection,
  useChoicesState,
} from "@/components/dashboard/choices-editor";
import {
  CustomisationsSection,
  useCustomisationsState,
} from "@/components/dashboard/customisations-editor";
import { FeatureToggle } from "@/components/dashboard/feature-toggle";
import {
  StockSection,
  useStockState,
} from "@/components/dashboard/stock-editor";
import { CategoryPicker } from "@/components/dashboard/category-picker";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ImageUploadField } from "@/components/ui/image-upload-field";
import { Input } from "@/components/ui/input";
import { getStorefrontPreviewUrl } from "@/lib/host";
import { uploadStoreImage } from "@/lib/images/compress";
import { normalizeCategory } from "@/lib/products/category";
import type { ProductCustomisation } from "@/lib/products/customisations";
import type { SoldOutPolicy } from "@/lib/products/inventory";
import { parsePriceToCents, type ProductInput } from "@/lib/products/validate";
import type {
  ProductOption,
  ProductVariant,
} from "@/lib/products/variants";
import { createClient } from "@/lib/supabase/client";
import { useSavedFlash } from "@/lib/ui/use-saved-flash";
import { fieldLabelClass } from "@/components/dashboard/field-label";
import { cn } from "@/lib/utils";

const fieldInputClass =
  "h-12 rounded-xl border border-border/60 bg-card px-4 text-[15px] font-medium shadow-none placeholder:font-normal placeholder:text-muted-foreground/60 focus-visible:border-foreground/25 focus-visible:ring-2 focus-visible:ring-primary/35";

type ProductFormProps = {
  initial?: Partial<ProductInput> & {
    options?: ProductOption[];
    variants?: ProductVariant[];
    customisations?: ProductCustomisation[];
    track_inventory?: boolean;
    stock_qty?: number | null;
    sold_out_policy?: SoldOutPolicy;
  };
  submitLabel: string;
  disabled?: boolean;
  storeSlug?: string;
  /** Categories already used by products in this store (shared pills). */
  storeCategories?: string[];
  showChoices?: boolean;
  showCustomisations?: boolean;
  showStock?: boolean;
  showPrep?: boolean;
  optionsFooter?: ReactNode;
  onSubmit: (product: ProductInput) => Promise<
    | { error: string }
    | { success: true; filtersLive?: boolean; categories?: string[] }
  >;
  onSuccess?: (result: { filtersLive?: boolean; categories?: string[] }) => void;
};

export function ProductForm({
  initial,
  submitLabel,
  disabled = false,
  storeSlug,
  storeCategories = [],
  showChoices = true,
  showCustomisations = true,
  showStock = true,
  showPrep = true,
  optionsFooter,
  onSubmit,
  onSuccess,
}: ProductFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState(
    initial?.price_cents != null
      ? (initial.price_cents / 100).toFixed(2)
      : "",
  );
  const [description, setDescription] = useState(initial?.description ?? "");
  const [descriptionOpen, setDescriptionOpen] = useState(
    Boolean(initial?.description?.trim()),
  );
  const [category, setCategory] = useState(
    () => normalizeCategory(initial?.category) ?? "",
  );
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const initialLead = initial?.lead_time_days ?? 0;
  const [prepEnabled, setPrepEnabled] = useState(initialLead > 0);
  const [prepDays, setPrepDays] = useState(
    initialLead > 0 ? String(initialLead) : "3",
  );
  const choicesState = useChoicesState({
    options: initial?.options,
    variants: initial?.variants,
  });
  const customisationsState = useCustomisationsState({
    customisations: initial?.customisations,
  });
  const stockState = useStockState({
    track_inventory: initial?.track_inventory,
    stock_qty: initial?.stock_qty,
    options: initial?.options,
    variants: initial?.variants,
  });

  const hasOptionsSeed =
    Boolean(normalizeCategory(category)) ||
    choicesState.enabled ||
    customisationsState.enabled ||
    stockState.enabled ||
    prepEnabled;

  const [optionsOpen, setOptionsOpen] = useState(hasOptionsSeed);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<"name" | "price" | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const { flashSaved, saveLabel } = useSavedFlash();

  async function handleImage(file: File) {
    setError(null);
    setUploading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");
      const url = await uploadStoreImage(supabase, user.id, file, "product");
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleSave() {
    setError(null);
    setToast(null);
    setFieldError(null);

    if (!name.trim()) {
      setFieldError("name");
      setError("Product name is required");
      return;
    }

    const priceCents = parsePriceToCents(price);
    if (priceCents == null) {
      setFieldError("price");
      setError("Enter a valid price, e.g. 9.50");
      return;
    }

    let leadTimeDays = 0;
    if (showPrep && prepEnabled) {
      const n = Number.parseInt(prepDays, 10);
      if (!Number.isInteger(n) || n < 0 || prepDays.trim() === "") {
        setError("Enter how many prep days you need (0 or more)");
        return;
      }
      leadTimeDays = n;
    }

    startTransition(async () => {
      const inventory = showStock ? stockState.toInventoryInput() : undefined;
      let choices = showChoices ? choicesState.toChoicesInput() : undefined;
      if (choices && inventory?.track_inventory) {
        choices = {
          ...choices,
          variants: choices.variants.map((v) => {
            const key = v.valueNames.map((n) => n.toLowerCase()).join("\0");
            return {
              ...v,
              stock_qty: stockState.stockQtyForKey(key),
            };
          }),
        };
      } else if (choices) {
        choices = {
          ...choices,
          variants: choices.variants.map((v) => ({
            ...v,
            stock_qty: null,
          })),
        };
      }

      const result = await onSubmit({
        name,
        price_cents: priceCents,
        description,
        image_url: imageUrl || undefined,
        category: normalizeCategory(category) || undefined,
        ...(showPrep ? { lead_time_days: leadTimeDays } : {}),
        ...(showChoices ? { choices } : {}),
        ...(showCustomisations
          ? { customisations: customisationsState.toCustomisationsInput() }
          : {}),
        ...(showStock && inventory ? { inventory } : {}),
      });
      if ("error" in result) {
        setError(result.error);
        return;
      }

      flashSaved();

      if (result.filtersLive && result.categories?.length) {
        const preview = storeSlug ? getStorefrontPreviewUrl(storeSlug) : null;
        setToast(
          `Storefront filters are live: ${result.categories.join(", ")}${preview ? " — preview your store to see them." : "."}`,
        );
      }

      onSuccess?.({
        filtersLive: result.filtersLive,
        categories: result.categories,
      });
    });
  }

  const showOptionsBlock =
    showChoices ||
    showCustomisations ||
    showStock ||
    showPrep ||
    Boolean(optionsFooter);

  return (
    <div className="flex flex-col gap-8">
      {/* Required — primary surface */}
      <section className="dashboard-panel overflow-hidden">
        <div className="border-b border-border/70 px-5 pt-5 pb-5 sm:px-6">
          <ImageUploadField
            id="product-image"
            label="Product image"
            labelClassName={fieldLabelClass}
            valueUrl={imageUrl}
            onFile={handleImage}
            onClear={() => setImageUrl("")}
            uploading={uploading}
            disabled={disabled}
            emptyTitleMobile="Tap to add a photo"
            emptyTitleDesktop="Drop a photo or click to browse"
            hint="Recommended 1200×1200 or larger"
            objectFit="cover"
          />
        </div>

        <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="product-name" className={fieldLabelClass}>
              Product name
            </label>
            <Input
              id="product-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Signature item"
              maxLength={80}
              disabled={disabled}
              aria-invalid={fieldError === "name" || undefined}
              aria-describedby={
                error && fieldError === "name" ? "product-form-error" : undefined
              }
              className={fieldInputClass}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="product-price" className={fieldLabelClass}>
              Price
            </label>
            <Input
              id="product-price"
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="9.50"
              disabled={disabled}
              aria-invalid={fieldError === "price" || undefined}
              aria-describedby={
                error && fieldError === "price"
                  ? "product-form-error"
                  : undefined
              }
              className={fieldInputClass}
            />
          </div>

          {descriptionOpen ? (
            <div className="flex flex-col gap-2">
              <label htmlFor="product-description" className={fieldLabelClass}>
                Description
              </label>
              <textarea
                id="product-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Materials, sizing, what is included…"
                maxLength={300}
                disabled={disabled}
                rows={3}
                autoFocus={!initial?.description?.trim()}
                className={cn(
                  "w-full min-w-0 resize-none rounded-xl border border-border/60 bg-card px-4 py-3.5 text-[15px] font-medium transition-colors outline-none",
                  "placeholder:font-normal placeholder:text-muted-foreground/60",
                  "focus-visible:border-foreground/25 focus-visible:ring-2 focus-visible:ring-primary/35",
                  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                )}
              />
            </div>
          ) : (
            <button
              type="button"
              disabled={disabled}
              onClick={() => setDescriptionOpen(true)}
              className={cn(
                "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold text-foreground shadow-sm transition-colors",
                "hover:border-foreground/25 hover:bg-muted/40 active:scale-[0.99]",
                "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                "disabled:pointer-events-none disabled:opacity-50",
              )}
            >
              <Plus className="size-4 shrink-0" aria-hidden strokeWidth={2.25} />
              Add Description
              <span className="font-medium text-muted-foreground">
                (Optional)
              </span>
            </button>
          )}
        </div>
      </section>

      {/* Optional */}
      {showOptionsBlock ? (
        <section className="pt-1">
          <div className="overflow-hidden rounded-[24px] border border-primary/25 bg-primary/12 shadow-[0_8px_32px_rgb(22_19_14/0.06)]">
            <Collapsible open={optionsOpen} onOpenChange={setOptionsOpen}>
              <CollapsibleTrigger
                className={cn(
                  "group flex min-h-14 w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors",
                  "hover:bg-primary/10",
                  "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset",
                )}
              >
                <span className="text-base font-bold tracking-tight">
                  More Product Options
                </span>
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/25 text-foreground transition-transform duration-200",
                    "group-hover:bg-primary/35",
                    optionsOpen && "rotate-180",
                  )}
                >
                  <ChevronDown className="size-4" aria-hidden strokeWidth={2.25} />
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="divide-y divide-border/50 border-t border-primary/20 bg-card/80 px-4 sm:px-5">
                  <div className="flex flex-col gap-3 py-7">
                    <div>
                      <h3 className="font-display text-lg leading-snug font-bold tracking-tight text-foreground">
                        Category
                      </h3>
                      <p className="mt-1 max-w-[22rem] text-sm leading-snug text-muted-foreground">
                        Group this product on your storefront.
                      </p>
                    </div>
                    <CategoryPicker
                      value={category}
                      onChange={setCategory}
                      storeCategories={storeCategories}
                      disabled={disabled}
                    />
                  </div>

                  {showChoices ? (
                    <div className="py-7">
                      <FeatureToggle
                        label="Add Variants"
                        enabled={choicesState.enabled}
                        onEnabledChange={choicesState.setEnabled}
                        disabled={disabled}
                      >
                        <ChoicesSection
                          state={choicesState}
                          disabled={disabled}
                          productPrice={price}
                        />
                      </FeatureToggle>
                    </div>
                  ) : null}

                  {showCustomisations ? (
                    <div className="py-7">
                      <FeatureToggle
                        label="Allow Customization"
                        enabled={customisationsState.enabled}
                        onEnabledChange={customisationsState.setEnabled}
                        disabled={disabled}
                      >
                        <CustomisationsSection
                          state={customisationsState}
                          disabled={disabled}
                        />
                      </FeatureToggle>
                    </div>
                  ) : null}

                  {showStock ? (
                    <div className="py-7">
                      <FeatureToggle
                        label="Track inventory"
                        enabled={stockState.enabled}
                        onEnabledChange={stockState.setEnabled}
                        disabled={disabled}
                      >
                        <StockSection
                          state={stockState}
                          choicesEnabled={
                            showChoices && choicesState.enabled
                          }
                          combinations={choicesState.generated}
                          disabled={disabled}
                        />
                      </FeatureToggle>
                    </div>
                  ) : null}

                  {showPrep ? (
                    <div className="py-7">
                      <FeatureToggle
                        label="Preparation Time"
                        enabled={prepEnabled}
                        onEnabledChange={setPrepEnabled}
                        disabled={disabled}
                      >
                        <div className="flex flex-col gap-2">
                          <label
                            htmlFor="product-lead-time"
                            className="text-sm leading-snug text-muted-foreground"
                          >
                            Customers will only be able to select fulfilment
                            date after preparation time
                          </label>
                          <div className="relative">
                            <Input
                              id="product-lead-time"
                              inputMode="numeric"
                              value={prepDays}
                              onChange={(e) =>
                                setPrepDays(
                                  e.target.value.replace(/[^\d]/g, ""),
                                )
                              }
                              placeholder="3"
                              disabled={disabled}
                              className={cn(
                                fieldInputClass,
                                "h-12 rounded-full border-border/50 bg-card pr-16 pl-4",
                              )}
                            />
                            <span
                              className="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2 text-[15px] text-muted-foreground"
                              aria-hidden
                            >
                              days
                            </span>
                          </div>
                        </div>
                      </FeatureToggle>
                    </div>
                  ) : null}

                  {optionsFooter ? (
                    <div className="py-5">{optionsFooter}</div>
                  ) : null}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </section>
      ) : null}

      {error && (
        <p
          id="product-form-error"
          className="text-destructive text-sm"
          role="alert"
        >
          {error}
        </p>
      )}

      {toast && (
        <p
          className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
          role="status"
        >
          {toast}
          {storeSlug ? (
            <>
              {" "}
              <a
                href={getStorefrontPreviewUrl(storeSlug)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold underline"
              >
                Preview store
              </a>
            </>
          ) : null}
        </p>
      )}

      {/* Primary page action */}
      <div className="-mx-1 sticky bottom-3 z-10 sm:static sm:bottom-auto">
        <Button
          type="button"
          onClick={handleSave}
          disabled={
            disabled || pending || uploading || !name.trim() || !price.trim()
          }
          className="h-14 w-full rounded-2xl text-base font-bold shadow-[0_8px_24px_rgb(0_0_0/0.12)]"
          aria-live="polite"
        >
          {saveLabel(pending, submitLabel)}
        </Button>
      </div>
    </div>
  );
}
