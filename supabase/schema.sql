-- ArmeriaDigital Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Profiles ───────────────────────────────────────────────────────────────
create table public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  username    text unique not null,
  full_name   text,
  whatsapp    text not null,        -- e.g. "17871234567" (country code + number)
  avatar_url  text,
  created_at  timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name, whatsapp)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'whatsapp', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Categories ─────────────────────────────────────────────────────────────
create table public.categories (
  id    serial primary key,
  name  text not null,
  slug  text unique not null
);

insert into public.categories (name, slug) values
  ('Pistolas', 'pistolas'),
  ('Rifles', 'rifles'),
  ('Escopetas', 'escopetas'),
  ('Revólveres', 'revolvers'),
  ('Municiones', 'municiones'),
  ('Accesorios', 'accesorios'),
  ('Miras y Ópticas', 'miras-opticas'),
  ('Partes y Piezas', 'partes-piezas'),
  ('Equipo Táctico', 'equipo-tactico'),
  ('Otros', 'otros');

alter table public.categories enable row level security;
create policy "Categories readable by all" on public.categories for select using (true);

-- ─── Listings ────────────────────────────────────────────────────────────────
create type listing_condition as enum ('nuevo', 'como_nuevo', 'bueno', 'aceptable');
create type listing_status as enum ('active', 'sold', 'paused');

create table public.listings (
  id            uuid default uuid_generate_v4() primary key,
  user_id       uuid references public.profiles(id) on delete cascade not null,
  category_id   int references public.categories(id),
  title         text not null,
  description   text not null,
  price         numeric(10,2) not null check (price >= 0),
  condition     listing_condition not null,
  location      text not null default 'Puerto Rico',
  images        text[] not null default '{}',
  whatsapp      text not null,          -- seller's WhatsApp for this listing
  status        listing_status not null default 'active',
  views         int not null default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table public.listings enable row level security;

create policy "Active listings viewable by all"
  on public.listings for select using (status = 'active');

create policy "Users see own listings regardless of status"
  on public.listings for select using (auth.uid() = user_id);

create policy "Auth users can insert listings"
  on public.listings for insert with check (auth.uid() = user_id);

create policy "Users can update own listings"
  on public.listings for update using (auth.uid() = user_id);

create policy "Users can delete own listings"
  on public.listings for delete using (auth.uid() = user_id);

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger listings_updated_at before update on public.listings
  for each row execute procedure update_updated_at();

-- View counter function (bypasses RLS to increment safely)
create or replace function increment_listing_views(listing_id uuid)
returns void language plpgsql security definer as $$
begin
  update public.listings set views = views + 1 where id = listing_id;
end;
$$;

-- ─── Storage ─────────────────────────────────────────────────────────────────
-- Create a 'listings' bucket in Supabase Storage (public)
-- Run this separately or via Supabase dashboard:
--
-- insert into storage.buckets (id, name, public) values ('listings', 'listings', true);
--
-- create policy "Anyone can view listing images"
--   on storage.objects for select using (bucket_id = 'listings');
--
-- create policy "Auth users can upload listing images"
--   on storage.objects for insert with check (
--     bucket_id = 'listings' and auth.role() = 'authenticated'
--   );
--
-- create policy "Users can delete own listing images"
--   on storage.objects for delete using (
--     bucket_id = 'listings' and auth.uid()::text = (storage.foldername(name))[1]
--   );

-- ─── Indexes ─────────────────────────────────────────────────────────────────
create index listings_user_id_idx on public.listings(user_id);
create index listings_category_id_idx on public.listings(category_id);
create index listings_status_idx on public.listings(status);
create index listings_created_at_idx on public.listings(created_at desc);
