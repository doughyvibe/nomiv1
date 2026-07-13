-- Add provisional vibes: laura, atlantic, vows, strada

alter table public.stores drop constraint if exists stores_vibe_check;

alter table public.stores add constraint stores_vibe_check check (
  vibe is null
  or vibe in (
    'atelier',
    'expedition',
    'cyberpunk',
    'epicurean',
    'candyland',
    'gallery',
    'market',
    'studio',
    'laura',
    'atlantic',
    'vows',
    'strada'
  )
);
