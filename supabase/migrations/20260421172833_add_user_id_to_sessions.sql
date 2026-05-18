-- Link tracker sessions to auth users.
-- user_id is nullable so anonymous sessions continue working unchanged.

alter table tracker_sessions
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists idx_tracker_sessions_user_id
  on tracker_sessions (user_id);

-- Authenticated users can read sessions they own OR unclaimed sessions
-- (unclaimed sessions are still protected by the 8-char code as shared secret)
create policy "tracker_sessions_select_authenticated"
  on tracker_sessions
  for select
  to authenticated
  using (auth.uid() = user_id or user_id is null);

-- Authenticated users can insert sessions linked to themselves
create policy "tracker_sessions_insert_authenticated"
  on tracker_sessions
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Authenticated users can claim an unclaimed session (set user_id to their own uid)
create policy "tracker_sessions_update_claim"
  on tracker_sessions
  for update
  to authenticated
  using (user_id is null)
  with check (auth.uid() = user_id);

-- Authenticated users can insert daily logs for sessions they can access
create policy "daily_logs_insert_authenticated"
  on daily_logs
  for insert
  to authenticated
  with check (
    exists (
      select 1 from tracker_sessions s
      where s.id = session_id
        and (s.user_id = auth.uid() or s.user_id is null)
    )
  );

-- Authenticated users can read daily logs for sessions they can access
create policy "daily_logs_select_authenticated"
  on daily_logs
  for select
  to authenticated
  using (
    exists (
      select 1 from tracker_sessions s
      where s.id = session_id
        and (s.user_id = auth.uid() or s.user_id is null)
    )
  );
