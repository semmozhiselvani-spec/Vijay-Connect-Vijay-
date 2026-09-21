-- =====================================================================
-- Vijay Connect: lock the website-settings table so ONLY THE OWNER can edit it.
-- Run once in Supabase SQL Editor.
--
-- Why: customers also sign up through Supabase Auth. If the policy on
-- selva_setting allows any "authenticated" user to write, a customer could
-- change your website content (and inject scripts into every visitor's page).
--
-- BEFORE RUNNING: Supabase Dashboard -> Authentication -> Users -> copy YOUR
-- owner user's UID and paste it below in place of PASTE-OWNER-USER-UID-HERE.
-- =====================================================================
create table if not exists public.selva_setting (
  id bigint primary key,
  data jsonb not null default '{}'::jsonb
);

alter table public.selva_setting enable row level security;

-- Drop every existing policy on this table
do $$
declare p record;
begin
  for p in select policyname from pg_policies where schemaname = 'public' and tablename = 'selva_setting' loop
    execute format('drop policy %I on public.selva_setting', p.policyname);
  end loop;
end $$;

-- Everyone can READ (the website needs it)
create policy "selva_setting_public_read" on public.selva_setting
  for select to anon, authenticated using (true);

-- Only the owner account can WRITE
create policy "selva_setting_owner_insert" on public.selva_setting
  for insert to authenticated
  with check (auth.uid() = 'PASTE-OWNER-USER-UID-HERE'::uuid);

create policy "selva_setting_owner_update" on public.selva_setting
  for update to authenticated
  using (auth.uid() = 'PASTE-OWNER-USER-UID-HERE'::uuid)
  with check (auth.uid() = 'PASTE-OWNER-USER-UID-HERE'::uuid);
