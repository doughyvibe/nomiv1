-- Seller-editable featured product section heading (e.g. "Signature Pick")
alter table public.stores
  add column if not exists featured_section_title text;
