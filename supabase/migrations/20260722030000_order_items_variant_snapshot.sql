-- Phase 2: snapshot variant identity + human labels on order lines.
-- Snapshots are immutable; no FK to live catalog (product/variant may change later).

alter table public.order_items
  add column if not exists product_id uuid,
  add column if not exists variant_id uuid,
  add column if not exists variant_label text;
