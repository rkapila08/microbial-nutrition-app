-- Tracks which badges each authenticated user has earned

create table if not exists earned_badges (
  id         uuid        default gen_random_uuid() primary key,
  user_id    uuid        not null references auth.users (id) on delete cascade,
  badge_id   text        not null,
  earned_at  timestamptz default now() not null,
  unique (user_id, badge_id)
);

alter table earned_badges enable row level security;

create policy "earned_badges_select_own"
  on earned_badges
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "earned_badges_insert_own"
  on earned_badges
  for insert
  to authenticated
  with check (user_id = auth.uid());

create index if not exists idx_earned_badges_user_id
  on earned_badges (user_id);

create index if not exists idx_earned_badges_user_badge
  on earned_badges (user_id, badge_id);
