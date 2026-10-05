-- ============================================================
-- Marie Boddaert — Supabase database schema
-- Uitvoeren in een LEEG project (SQL Editor of psql).
-- ============================================================

-- Posts
create table public.posts (
  id           uuid    default gen_random_uuid() primary key,
  title        text    not null,
  slug         text    not null unique,
  date         date    not null,
  excerpt      text    default '',
  category     text    check (category in ('Verhalen', 'Gedichten', 'Kattenbellen')),
  color        text    default '#FAD5DA',
  emoji        text    default '✍️',
  content      text    default '',
  published    boolean default true,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Over mij (altijd 1 rij met id='about-page')
create table public.about (
  id         text    primary key default 'about-page',
  tagline    text    default 'Marie H. Boddaert schrijft.',
  bio        text    default '',
  services   text[]  default array['Blogs', 'Gedichten', 'Kattenbellen', 'Gevatte teksten'],
  slogan     text    default 'Gelukkig kan ze nog wel schrijven.',
  instagram  text    default 'https://www.instagram.com/bodhimari/',
  linkedin   text    default 'https://www.linkedin.com/in/marieboddaert/',
  blogger    text    default 'https://dewereldvanmarie.blogspot.com',
  substack   text    default 'https://substack.com/@marieboddaert',
  photo_url  text,
  updated_at timestamptz default now()
);

insert into public.about (id) values ('about-page') on conflict do nothing;

-- Reacties van lezers
create table public.comments (
  id         uuid    default gen_random_uuid() primary key,
  post_slug  text    not null,
  name       text    not null,
  message    text    not null,
  approved   boolean default false,
  created_at timestamptz default now()
);

-- Emoji reacties per post
create table public.reactions (
  id         uuid    default gen_random_uuid() primary key,
  post_slug  text    not null,
  emoji      text    not null,
  count      integer default 0,
  unique (post_slug, emoji)
);

-- ── Beheerders ──────────────────────────────────────────────
-- Alleen gebruikers in deze tabel mogen beheren. Ingelogd zijn alleen is
-- niet genoeg: zo kan iemand die zich via de Auth API aanmeldt niks wijzigen.
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

-- In een eigen schema dat niet via de Data API bereikbaar is, zodat de
-- functie niet als RPC aan te roepen is. Policies kunnen 'm wel gebruiken.
create schema if not exists private;
grant usage on schema private to anon, authenticated;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated;

-- Alleen als bij het aanmaken "Enable automatic RLS" aan stond: die
-- event-trigger functie hoeft niet via de API aanroepbaar te zijn.
-- revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

-- ── Row Level Security ──────────────────────────────────────

alter table public.posts     enable row level security;
alter table public.about     enable row level security;
alter table public.comments  enable row level security;
alter table public.reactions enable row level security;
alter table public.admins    enable row level security;

-- Publiek: alleen gepubliceerde posts lezen
create policy "Publiek posts lezen"
  on public.posts for select
  using (published = true);

-- Publiek: over-mij lezen
create policy "Publiek about lezen"
  on public.about for select
  using (true);

-- Publiek: goedgekeurde reacties lezen
create policy "Publiek comments lezen"
  on public.comments for select
  using (approved = true);

-- Publiek: emoji reacties lezen
create policy "Publiek reactions lezen"
  on public.reactions for select
  using (true);

-- Reacties plaatsen en emoji-tellers ophogen loopt via /api/comments en
-- /api/reactions (service role, met validatie). Daarom bewust geen publieke
-- insert/update policies: anders kan iedereen met de anon key tellers
-- overschrijven of de validatie omzeilen.

-- Beheerder: eigen rij in admins kunnen zien
create policy "Admin eigen rij lezen"
  on public.admins for select
  using (user_id = auth.uid());

-- Beheerder schrijfrechten (elke schrijf-policy heeft een bijbehorende
-- lees-policy, anders faalt .select() na een mutatie stil)
create policy "Admin about bijwerken"
  on public.about for update
  using (private.is_admin());

create policy "Admin about invoegen"
  on public.about for insert
  with check (private.is_admin());

create policy "Admin posts aanmaken"
  on public.posts for insert
  with check (private.is_admin());

create policy "Admin posts wijzigen"
  on public.posts for update
  using (private.is_admin());

create policy "Admin posts verwijderen"
  on public.posts for delete
  using (private.is_admin());

create policy "Admin alle posts lezen"
  on public.posts for select
  using (private.is_admin());

create policy "Admin alle comments lezen"
  on public.comments for select
  using (private.is_admin());

create policy "Admin comments wijzigen"
  on public.comments for update
  using (private.is_admin());

create policy "Admin comments verwijderen"
  on public.comments for delete
  using (private.is_admin());

-- ── Rate limiting ──────────────────────────────────────────
-- Rate limiting voor /api/comments en /api/reactions.

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

-- ── Storage ─────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('marie-images', 'marie-images', true, 10485760,
        array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do nothing;

create policy "Admin afbeeldingen uploaden"
  on storage.objects for insert
  with check (bucket_id = 'marie-images' and private.is_admin());

create policy "Admin afbeeldingen wijzigen"
  on storage.objects for update
  using (bucket_id = 'marie-images' and private.is_admin());

create policy "Admin afbeeldingen verwijderen"
  on storage.objects for delete
  using (bucket_id = 'marie-images' and private.is_admin());

create policy "Admin afbeeldingen lezen"
  on storage.objects for select
  using (bucket_id = 'marie-images' and private.is_admin());
