-- 1. Upgrade User Tasks with rich content types
alter table public.user_tasks 
add column if not exists type text default 'text', -- 'text', 'video', 'link', 'quiz'
add column if not exists content_url text,      -- URL for video or website
add column if not exists content_body text,     -- Text content or instructions
add column if not exists questions jsonb,        -- JSON array of questions for quizzes
add column if not exists xp_value integer default 100;

-- 2. Add some sample content-rich tasks to the modules for testing
-- (Only if you want pre-made data)
