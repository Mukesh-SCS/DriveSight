-- DriveSight core schema (tables, RLS, helpers)
-- Included by supabase/schema.sql and migrations. Edit here, then run: npm run db:build

-- ---------------------------------------------------------------------------
-- Tables
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
  category text,
  difficulty text,
  source text,
  tags text[],
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.driving_test_questions
  drop constraint if exists driving_test_questions_difficulty_check;

alter table public.driving_test_questions
  add constraint driving_test_questions_difficulty_check
  check (difficulty is null or difficulty in ('easy', 'medium', 'hard'));

create index if not exists driving_test_questions_state_active_idx
  on public.driving_test_questions (state_code, is_active);

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

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.state_driving_tests enable row level security;
alter table public.driving_test_questions enable row level security;
alter table public.user_question_attempts enable row level security;
alter table public.user_progress enable row level security;

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

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.sync_state_question_counts()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.state_driving_tests s
  set
    question_count = coalesce(c.cnt, 0),
    updated_at = now()
  from (
    select
      st.state_code,
      count(q.id)::integer as cnt
    from public.state_driving_tests st
    left join public.driving_test_questions q
      on q.state_code = st.state_code
      and q.is_active = true
    group by st.state_code
  ) c
  where s.state_code = c.state_code;
end;
$$;

-- ---------------------------------------------------------------------------
-- All US states + DC (counts synced after seeds load)
-- ---------------------------------------------------------------------------

insert into public.state_driving_tests (state_code, state_name, question_count)
values
  ('AL', 'Alabama', 0),
  ('AK', 'Alaska', 0),
  ('AZ', 'Arizona', 0),
  ('AR', 'Arkansas', 0),
  ('CA', 'California', 0),
  ('CO', 'Colorado', 0),
  ('CT', 'Connecticut', 0),
  ('DE', 'Delaware', 0),
  ('DC', 'District of Columbia', 0),
  ('FL', 'Florida', 0),
  ('GA', 'Georgia', 0),
  ('HI', 'Hawaii', 0),
  ('ID', 'Idaho', 0),
  ('IL', 'Illinois', 0),
  ('IN', 'Indiana', 0),
  ('IA', 'Iowa', 0),
  ('KS', 'Kansas', 0),
  ('KY', 'Kentucky', 0),
  ('LA', 'Louisiana', 0),
  ('ME', 'Maine', 0),
  ('MD', 'Maryland', 0),
  ('MA', 'Massachusetts', 0),
  ('MI', 'Michigan', 0),
  ('MN', 'Minnesota', 0),
  ('MS', 'Mississippi', 0),
  ('MO', 'Missouri', 0),
  ('MT', 'Montana', 0),
  ('NE', 'Nebraska', 0),
  ('NV', 'Nevada', 0),
  ('NH', 'New Hampshire', 0),
  ('NJ', 'New Jersey', 0),
  ('NM', 'New Mexico', 0),
  ('NY', 'New York', 0),
  ('NC', 'North Carolina', 0),
  ('ND', 'North Dakota', 0),
  ('OH', 'Ohio', 0),
  ('OK', 'Oklahoma', 0),
  ('OR', 'Oregon', 0),
  ('PA', 'Pennsylvania', 0),
  ('RI', 'Rhode Island', 0),
  ('SC', 'South Carolina', 0),
  ('SD', 'South Dakota', 0),
  ('TN', 'Tennessee', 0),
  ('TX', 'Texas', 0),
  ('UT', 'Utah', 0),
  ('VT', 'Vermont', 0),
  ('VA', 'Virginia', 0),
  ('WA', 'Washington', 0),
  ('WV', 'West Virginia', 0),
  ('WI', 'Wisconsin', 0),
  ('WY', 'Wyoming', 0)
on conflict (state_code) do update set
  state_name = excluded.state_name,
  updated_at = now();
