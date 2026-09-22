-- CoteLind CMS schema
-- Run in the Supabase SQL editor for your project, or via `supabase db push`.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles: one row per admin user (Cote + developer fallback)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: users can read their own row"
  on public.profiles for select
  using (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- content_blocks: freeform editable text, one row per named field
-- ---------------------------------------------------------------------------
create table if not exists public.content_blocks (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.content_blocks enable row level security;

create policy "content_blocks: public can read"
  on public.content_blocks for select
  using (true);

create policy "content_blocks: admins can write"
  on public.content_blocks for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- ---------------------------------------------------------------------------
-- media_items: photos, audio files, and YouTube embeds, one table
-- ---------------------------------------------------------------------------
create type public.media_section as enum ('home', 'about', 'singing', 'acting', 'voiceovers');
create type public.media_type as enum ('photo', 'audio', 'video_embed');

create table if not exists public.media_items (
  id uuid primary key default gen_random_uuid(),
  section public.media_section not null,
  type public.media_type not null,
  title text not null default '',
  alt_text text not null default '',
  storage_path text,        -- set for photo/audio, null for video_embed
  external_url text,        -- set for video_embed (YouTube URL), null otherwise
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint media_items_storage_or_external check (
    (type in ('photo', 'audio') and storage_path is not null and external_url is null)
    or (type = 'video_embed' and external_url is not null and storage_path is null)
  )
);

create index if not exists media_items_section_idx on public.media_items (section, sort_order);

alter table public.media_items enable row level security;

create policy "media_items: public can read"
  on public.media_items for select
  using (true);

create policy "media_items: admins can write"
  on public.media_items for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- ---------------------------------------------------------------------------
-- contact_submissions: booking / contact form inquiries
-- ---------------------------------------------------------------------------
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null default '',
  email text not null,
  phone text not null default '',
  comments text not null default '',
  subscribed boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

create policy "contact_submissions: anyone can submit"
  on public.contact_submissions for insert
  with check (true);

create policy "contact_submissions: admins can read"
  on public.contact_submissions for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

create policy "contact_submissions: admins can delete"
  on public.contact_submissions for delete
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- ---------------------------------------------------------------------------
-- storage: public "media" bucket, admin-only writes
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media bucket: public read"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "media bucket: admins can upload"
  on storage.objects for insert
  with check (
    bucket_id = 'media'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

create policy "media bucket: admins can update"
  on storage.objects for update
  using (
    bucket_id = 'media'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

create policy "media bucket: admins can delete"
  on storage.objects for delete
  using (
    bucket_id = 'media'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );
