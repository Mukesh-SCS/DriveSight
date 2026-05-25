-- DriveSight schema bootstrap + upgrades
-- Safe to run on a fresh Supabase project OR an existing one missing tables/columns.

-- ---------------------------------------------------------------------------
-- Core tables
-- ---------------------------------------------------------------------------

create table if not exists public.state_driving_tests (
  state_code text primary key,
  state_name text not null,
  question_count integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.driving_test_questions (
  id uuid primary key default gen_random_uuid(),
  state_code text not null references public.state_driving_tests(state_code) on delete cascade,
  prompt text not null,
  choices jsonb not null,
  answer_index integer not null,
  explanation text,
  created_at timestamptz not null default now()
);

-- Add columns when upgrading an older database (no-op if already present)
alter table public.driving_test_questions
  add column if not exists category text,
  add column if not exists difficulty text,
  add column if not exists source text;

alter table public.driving_test_questions
  add column if not exists is_active boolean;

update public.driving_test_questions
set is_active = true
where is_active is null;

alter table public.driving_test_questions
  alter column is_active set default true;

alter table public.driving_test_questions
  alter column is_active set not null;

alter table public.driving_test_questions
  drop constraint if exists driving_test_questions_difficulty_check;

alter table public.driving_test_questions
  add constraint driving_test_questions_difficulty_check
  check (difficulty is null or difficulty in ('easy', 'medium', 'hard'));

create index if not exists driving_test_questions_state_active_idx
  on public.driving_test_questions (state_code, is_active);

-- ---------------------------------------------------------------------------
-- Attempt history
-- ---------------------------------------------------------------------------

create table if not exists public.user_question_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id uuid not null references public.driving_test_questions (id) on delete cascade,
  selected_answer_index integer not null,
  is_correct boolean not null,
  attempted_at timestamptz not null default now()
);

create index if not exists user_question_attempts_user_idx
  on public.user_question_attempts (user_id, attempted_at desc);

create index if not exists user_question_attempts_question_idx
  on public.user_question_attempts (question_id);

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.state_driving_tests enable row level security;
alter table public.driving_test_questions enable row level security;
alter table public.user_question_attempts enable row level security;

drop policy if exists "State tests are readable" on public.state_driving_tests;
create policy "State tests are readable"
on public.state_driving_tests
for select
using (true);

drop policy if exists "Driving questions are readable" on public.driving_test_questions;
create policy "Driving questions are readable"
on public.driving_test_questions
for select
to authenticated
using (is_active = true);

drop policy if exists "Users read own attempts" on public.user_question_attempts;
create policy "Users read own attempts"
on public.user_question_attempts
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users insert own attempts" on public.user_question_attempts;
create policy "Users insert own attempts"
on public.user_question_attempts
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users update own attempts" on public.user_question_attempts;
create policy "Users update own attempts"
on public.user_question_attempts
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users delete own attempts" on public.user_question_attempts;
create policy "Users delete own attempts"
on public.user_question_attempts
for delete
to authenticated
using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Starter state rows (optional)
-- ---------------------------------------------------------------------------

insert into public.state_driving_tests (state_code, state_name, question_count)
values
  ('CA', 'California', 100),
  ('NY', 'New York', 104),
  ('TX', 'Texas', 92)
on conflict (state_code) do update set
  state_name = excluded.state_name,
  question_count = excluded.question_count,
  updated_at = now();
