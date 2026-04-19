-- Run this in your Supabase SQL Editor

-- Profiles table (auto-created on signup via trigger)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  goal text,
  experience_level text,
  xp integer default 0,
  streak integer default 0,
  created_at timestamp with time zone default now()
);

-- Projects table
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  goal text,
  experience text,
  status text default 'Active',
  progress integer default 0,
  tasks_done integer default 0,
  tasks_total integer default 50,
  xp integer default 0,
  streak integer default 0,
  color text default 'indigo',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Activities table
create table if not exists public.activities (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null,        -- 'quiz', 'module', 'interview', 'badge'
  title text not null,
  xp_earned integer default 0,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.activities enable row level security;

-- Policies: users only see their own data
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can view own projects" on public.projects for all using (auth.uid() = user_id);
create policy "Users can manage own activities" on public.activities for all using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
