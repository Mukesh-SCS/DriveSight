-- User progress + question tags

alter table public.driving_test_questions
  add column if not exists tags text[];

create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  state_code text not null references public.state_driving_tests (state_code) on delete cascade,
  total_attempted integer not null default 0,
  total_correct integer not null default 0,
  weak_categories text[] not null default '{}',
  practice_streak integer not null default 0,
  last_practice_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, state_code)
);

create index if not exists user_progress_user_idx
  on public.user_progress (user_id, updated_at desc);

alter table public.user_progress enable row level security;

drop policy if exists "Users read own progress" on public.user_progress;
create policy "Users read own progress"
on public.user_progress
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users insert own progress" on public.user_progress;
create policy "Users insert own progress"
on public.user_progress
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users update own progress" on public.user_progress;
create policy "Users update own progress"
on public.user_progress
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users delete own progress" on public.user_progress;
create policy "Users delete own progress"
on public.user_progress
for delete
to authenticated
using (auth.uid() = user_id);
