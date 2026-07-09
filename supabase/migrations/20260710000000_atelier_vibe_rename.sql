-- Atelier vibe rename (was unicorn)

alter table public.stores drop constraint if exists stores_vibe_check;

update public.stores set vibe = 'atelier' where vibe = 'unicorn';

alter table public.stores add constraint stores_vibe_check check (
  vibe is null
  or vibe in ('atelier', 'outback', 'futuristic', 'epicurean')
);
