-- Cyberpunk vibe rename (was futuristic)

alter table public.stores drop constraint if exists stores_vibe_check;

update public.stores set vibe = 'cyberpunk' where vibe = 'futuristic';

alter table public.stores add constraint stores_vibe_check check (
  vibe is null
  or vibe in ('atelier', 'expedition', 'cyberpunk', 'epicurean')
);
