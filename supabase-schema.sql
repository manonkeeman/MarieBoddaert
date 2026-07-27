-- ============================================================
-- Marie Boddaert — Supabase database schema
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

-- ── Row Level Security ──────────────────────────────────────

alter table public.posts     enable row level security;
alter table public.about     enable row level security;
alter table public.comments  enable row level security;
alter table public.reactions enable row level security;

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

-- Publiek: reactie plaatsen
create policy "Publiek comments schrijven"
  on public.comments for insert
  with check (
    length(name) > 0 and length(name) <= 100 and
    length(message) > 0 and length(message) <= 2000
  );

-- Publiek: emoji reacties lezen
create policy "Publiek reactions lezen"
  on public.reactions for select
  using (true);

-- Publiek: emoji reacties bijwerken
create policy "Publiek reactions bijwerken"
  on public.reactions for update
  using (true);

create policy "Publiek reactions aanmaken"
  on public.reactions for insert
  with check (true);

-- Admin (ingelogde beheerder) schrijfrechten
create policy "Admin about bijwerken"
  on public.about for update
  using (auth.role() = 'authenticated');

create policy "Admin about invoegen"
  on public.about for insert
  with check (auth.role() = 'authenticated');

create policy "Admin posts aanmaken"
  on public.posts for insert
  with check (auth.role() = 'authenticated');

create policy "Admin posts wijzigen"
  on public.posts for update
  using (auth.role() = 'authenticated');

create policy "Admin posts verwijderen"
  on public.posts for delete
  using (auth.role() = 'authenticated');

create policy "Admin alle posts lezen"
  on public.posts for select
  using (auth.role() = 'authenticated');

create policy "Admin alle comments lezen"
  on public.comments for select
  using (auth.role() = 'authenticated');

create policy "Admin comments wijzigen"
  on public.comments for update
  using (auth.role() = 'authenticated');

create policy "Admin comments verwijderen"
  on public.comments for delete
  using (auth.role() = 'authenticated');
