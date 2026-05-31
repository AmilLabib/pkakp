-- Full schema for Supabase: tables for articles, prestasi, and members (anggota)
-- Usage: copy & paste into Supabase SQL Editor and run. This file creates tables and example permissive
-- Row Level Security (RLS) policies useful for local/dev testing. DO NOT use permissive policies in production.

-- Ensure uuid helper is available (pgcrypto provides gen_random_uuid)
create extension if not exists pgcrypto;

-- === Table: articles ===
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  "desc" text,
  image text,
  slug text unique,
  published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_articles_created_at on articles(created_at desc);

-- === Table: prestasi ===
create table if not exists prestasi (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  year text,
  image text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_prestasi_created_at on prestasi(created_at desc);

-- === Table: members ===
create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  position integer,
  photo text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_members_created_at on members(created_at desc);
create index if not exists idx_members_position on members(position asc nulls last);

-- === Row Level Security (RLS) & example policies ===
-- The policies below are permissive and intended for quick testing only.
-- In production, restrict access based on authentication and roles.

-- Enable RLS for all tables
alter table articles enable row level security;
alter table prestasi enable row level security;
alter table members enable row level security;

-- Allow anonymous SELECT on all tables (dev only)
-- Ensure policies are idempotent: drop if exist then create
drop policy if exists "allow anon select articles" on articles;
create policy "allow anon select articles" on articles for select using (true);
drop policy if exists "allow anon select prestasi" on prestasi;
create policy "allow anon select prestasi" on prestasi for select using (true);
drop policy if exists "allow anon select members" on members;
create policy "allow anon select members" on members for select using (true);

drop policy if exists "allow anon insert articles" on articles;
create policy "allow anon insert articles" on articles for insert with check (true);
drop policy if exists "allow anon insert prestasi" on prestasi;
create policy "allow anon insert prestasi" on prestasi for insert with check (true);
drop policy if exists "allow anon insert members" on members;
create policy "allow anon insert members" on members for insert with check (true);

drop policy if exists "allow anon delete articles" on articles;
create policy "allow anon delete articles" on articles for delete using (true);
drop policy if exists "allow anon delete prestasi" on prestasi;
create policy "allow anon delete prestasi" on prestasi for delete using (true);
drop policy if exists "allow anon delete members" on members;
create policy "allow anon delete members" on members for delete using (true);

drop policy if exists "allow anon update articles" on articles;
create policy "allow anon update articles" on articles for update using (true) with check (true);
drop policy if exists "allow anon update prestasi" on prestasi;
create policy "allow anon update prestasi" on prestasi for update using (true) with check (true);
drop policy if exists "allow anon update members" on members;
create policy "allow anon update members" on members for update using (true) with check (true);

insert into articles (title, "desc", image, slug, published)
values
  ('Contoh Artikel 1', 'Ringkasan artikel 1', '/artikel/1.jpg', 'contoh-artikel-1', true),
  ('Contoh Artikel 2', 'Ringkasan artikel 2', '/artikel/2.jpeg', 'contoh-artikel-2', false)
on conflict do nothing;

insert into prestasi (title, year, image)
values
  ('Juara 1 Lomba Akuntansi Nasional', '2025', '/prestasi/1.png'),
  ('Juara 2 Lomba Debat', '2024', '/prestasi/2.png')
on conflict do nothing;

insert into members (name, role, photo)
values
  ('Rona Alifah', 'President', ''),
  ('Novinka Anggraini', 'Vice President', '')
on conflict do nothing;


-- Ensure articles table has an author column (safe to run repeatedly)
alter table articles add column if not exists author text;
