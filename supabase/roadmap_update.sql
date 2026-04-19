-- Run this in your Supabase SQL Editor to update the schema

-- 1. Add role to profiles
alter table if exists public.profiles add column if not exists role text default 'user';

-- 2. Create Learning Modules table
create table if not exists public.modules (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  "order" integer not null,
  xp_reward integer default 500,
  created_at timestamp with time zone default now()
);

-- 3. Create User Tasks table (The Roadmap)
create table if not exists public.user_tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  module_id uuid references public.modules(id) on delete cascade not null,
  title text not null,
  status text default 'locked', -- 'locked', 'available', 'done'
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- 4. Enable RLS
alter table public.modules enable row level security;
alter table public.user_tasks enable row level security;

-- 5. Policies
-- Everyone can view modules
create policy "Anyone can view modules" on public.modules for select using (true);

-- Admin can manage everything
create policy "Admins can manage modules" on public.modules for all 
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Users can view their own tasks
create policy "Users can view own tasks" on public.user_tasks for select 
  using (auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Users can update their own tasks (to mark as done)
create policy "Users can update own tasks" on public.user_tasks for update 
  using (auth.uid() = user_id or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- 6. Insert some default modules
insert into public.modules (title, description, "order", xp_reward) values
('HTML & CSS Fundamentals', 'Master the building blocks of the web.', 1, 500),
('JavaScript Essentials', 'Learn the logic of modern web apps.', 2, 750),
('React Development', 'Build complex UIs with ease.', 3, 1000),
('Backend & Databases', 'Connect your apps to the real world.', 4, 1200)
on conflict do nothing;
