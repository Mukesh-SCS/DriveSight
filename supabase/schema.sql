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

alter table public.state_driving_tests enable row level security;
alter table public.driving_test_questions enable row level security;

drop policy if exists "State tests are readable" on public.state_driving_tests;
create policy "State tests are readable"
on public.state_driving_tests
for select
using (true);

drop policy if exists "Driving questions are readable" on public.driving_test_questions;
create policy "Driving questions are readable"
on public.driving_test_questions
for select
using (true);

insert into public.state_driving_tests (state_code, state_name, question_count)
values
  ('CA', 'California', 334),
  ('NY', 'New York', 104),
  ('TX', 'Texas', 92)
on conflict (state_code) do update set
  state_name = excluded.state_name,
  question_count = excluded.question_count,
  updated_at = now();

insert into public.driving_test_questions (
  state_code,
  prompt,
  choices,
  answer_index,
  explanation
)
values
  (
    'CA',
    'What should you do at a steady red traffic signal before turning right?',
    '["Stop fully, yield, and turn only if no sign prohibits it", "Slow down and turn without stopping", "Wait only if another vehicle is present", "Turn from any available lane"]',
    0,
    'A full stop and yielding are required before a permitted right turn on red.'
  ),
  (
    'NY',
    'What does a flashing yellow signal mean?',
    '["Stop and wait for green", "Proceed with caution", "The road is closed", "Pedestrians only may cross"]',
    1,
    'A flashing yellow signal warns drivers to slow down and proceed carefully.'
  ),
  (
    'TX',
    'When approaching an emergency vehicle stopped with flashing lights, what should you do?',
    '["Move over or slow down as required by law", "Stop in your lane immediately", "Speed up to pass quickly", "Use the shoulder to pass"]',
    0,
    'Move-over laws require drivers to change lanes away from stopped emergency vehicles when possible or slow down.'
  );
