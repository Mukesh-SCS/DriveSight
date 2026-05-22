-- Extend driving_test_questions
alter table public.driving_test_questions
  add column if not exists category text,
  add column if not exists difficulty text,
  add column if not exists source text,
  add column if not exists is_active boolean not null default true;

alter table public.driving_test_questions
  drop constraint if exists driving_test_questions_difficulty_check;

alter table public.driving_test_questions
  add constraint driving_test_questions_difficulty_check
  check (difficulty is null or difficulty in ('easy', 'medium', 'hard'));

create index if not exists driving_test_questions_state_active_idx
  on public.driving_test_questions (state_code, is_active);

-- User attempt history
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

alter table public.user_question_attempts enable row level security;

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

-- Questions readable by authenticated users only (practice app)
drop policy if exists "Driving questions are readable" on public.driving_test_questions;
create policy "Driving questions are readable"
on public.driving_test_questions
for select
to authenticated
using (is_active = true);
