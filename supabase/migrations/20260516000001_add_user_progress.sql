-- Tracks per-user XP, level, streak, and latest profile data for the gamification system

create table if not exists user_progress (
  id                   uuid        default gen_random_uuid() primary key,
  user_id              uuid        not null unique references auth.users (id) on delete cascade,
  xp                   integer     default 0 not null,
  level                integer     default 1 not null,
  current_streak       integer     default 0 not null,
  longest_streak       integer     default 0 not null,
  last_activity_date   date,
  quizzes_completed    integer     default 0 not null,
  journals_completed   integer     default 0 not null,
  latest_profile_code  text,
  latest_gut_score     integer,
  created_at           timestamptz default now() not null,
  updated_at           timestamptz default now() not null
);

alter table user_progress enable row level security;

create policy "user_progress_select_own"
  on user_progress
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "user_progress_insert_own"
  on user_progress
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "user_progress_update_own"
  on user_progress
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create index if not exists idx_user_progress_user_id
  on user_progress (user_id);

create index if not exists idx_user_progress_xp
  on user_progress (xp desc);

-- Leaderboard function — returns anonymous top entries with no user_id exposed
create or replace function get_leaderboard(limit_n integer default 10)
returns table (
  rank                bigint,
  level               integer,
  xp                  integer,
  latest_profile_code text
)
language sql
security definer
stable
as $$
  select
    row_number() over (order by up.xp desc) as rank,
    up.level,
    up.xp,
    up.latest_profile_code
  from user_progress up
  order by up.xp desc
  limit limit_n
$$;
