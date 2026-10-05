-- Rate limiting voor /api/comments en /api/reactions, gedeeld door alle
-- serverless instanties. Uitvoeren in de SQL Editor van het project.

create table if not exists public.rate_limits (
  key     text        not null,
  hit_at  timestamptz not null default now()
);

create index if not exists rate_limits_key_hit_at on public.rate_limits (key, hit_at);

-- RLS aan zonder policies: anon en ingelogde gebruikers kunnen er niks mee
alter table public.rate_limits enable row level security;

-- Telt een verzoek en geeft true terug als de limiet overschreden is.
-- Alleen aanroepbaar met de service role (de API routes).
create or replace function public.hit_rate_limit(p_key text, p_limit int, p_window_seconds int)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  n int;
begin
  -- Af en toe oude rijen opruimen
  if random() < 0.01 then
    delete from public.rate_limits where hit_at < now() - interval '1 day';
  end if;

  select count(*) into n
  from public.rate_limits
  where key = p_key
    and hit_at > now() - make_interval(secs => p_window_seconds);

  insert into public.rate_limits (key) values (p_key);

  return n >= p_limit;
end;
$$;

revoke all on function public.hit_rate_limit(text, int, int) from public, anon, authenticated;
grant execute on function public.hit_rate_limit(text, int, int) to service_role;
