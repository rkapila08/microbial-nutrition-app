-- Longitudinal gut tracker: stores week-long dietary practice sessions
-- and the daily check-in responses that feed into them.

-- ── Sessions ───────────────────────────────────────────────────────────────

create table if not exists tracker_sessions (
  id         uuid        default gen_random_uuid() primary key,
  code       text        not null unique,
  created_at timestamptz default now() not null
);

alter table tracker_sessions enable row level security;

-- Anyone can create a new session
create policy "tracker_sessions_insert_anon"
  on tracker_sessions
  for insert
  to anon
  with check (true);

-- Anyone can read sessions (the code is the shared secret)
create policy "tracker_sessions_select_anon"
  on tracker_sessions
  for select
  to anon
  using (true);

-- Code lookups are the hot path — index it
create index if not exists idx_tracker_sessions_code
  on tracker_sessions (code);

-- ── Daily logs ─────────────────────────────────────────────────────────────

create table if not exists daily_logs (
  id          uuid        default gen_random_uuid() primary key,
  session_id  uuid        not null references tracker_sessions (id) on delete cascade,
  day_number  int         not null check (day_number between 1 and 7),
  responses   jsonb       not null,
  logged_at   timestamptz default now() not null,
  unique (session_id, day_number)
);

alter table daily_logs enable row level security;

-- Anyone can insert a log (session_id is the implicit "ownership" proof)
create policy "daily_logs_insert_anon"
  on daily_logs
  for insert
  to anon
  with check (true);

-- Anyone can read logs
create policy "daily_logs_select_anon"
  on daily_logs
  for select
  to anon
  using (true);

create index if not exists idx_daily_logs_session_id
  on daily_logs (session_id);
