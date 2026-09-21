-- =====================================================================
-- Vijay Connect live cab tracking  (SECURE VERSION)
-- Run once in Supabase Dashboard -> SQL Editor. Safe to re-run.
--
-- What changed vs the old version:
--  * The old policies let ANYONE on the internet read every cab location and
--    overwrite any cab's location. They are removed.
--  * Customers now read ONE cab only through vc_get_cab_location(code).
--  * Drivers must send a private DRIVER CODE that only you create.
-- =====================================================================

create table if not exists public.cab_locations (
  booking_code text primary key,
  lat double precision not null,
  lng double precision not null,
  status text not null default 'Live',
  driver_name text,
  updated_at timestamptz not null default now()
);

alter table public.cab_locations enable row level security;

-- Remove the old open policies
drop policy if exists "cab_locations_public_read"   on public.cab_locations;
drop policy if exists "cab_locations_public_upsert" on public.cab_locations;
drop policy if exists "cab_locations_public_update" on public.cab_locations;

-- Nobody can touch the table directly from the browser
revoke all on public.cab_locations from anon, authenticated;

-- Private list of driver codes (only you can see/edit it in the dashboard)
create table if not exists public.cab_driver_codes (
  code text primary key check (length(code) >= 8),
  driver_name text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.cab_driver_codes enable row level security;
revoke all on public.cab_driver_codes from anon, authenticated;

-- Customer: read ONE cab (only if it updated in the last 6 hours)
create or replace function public.vc_get_cab_location(p_code text)
returns table (booking_code text, lat double precision, lng double precision,
               status text, driver_name text, updated_at timestamptz)
language sql stable security definer set search_path = public as $$
  select c.booking_code, c.lat, c.lng, c.status, c.driver_name, c.updated_at
  from public.cab_locations c
  where c.booking_code = upper(trim(p_code))
    and c.updated_at > now() - interval '6 hours'
  limit 1;
$$;

-- Driver: push location (needs a valid driver code)
create or replace function public.vc_push_cab_location(
  p_driver_code text, p_booking_code text,
  p_lat double precision, p_lng double precision, p_driver_name text default null)
returns boolean
language plpgsql security definer set search_path = public as $$
declare v_code text := upper(trim(p_booking_code));
begin
  if not exists (select 1 from public.cab_driver_codes d where d.code = p_driver_code and d.active) then
    raise exception 'Invalid driver code';
  end if;
  if v_code !~ '^[A-Z0-9-]{3,20}$' then raise exception 'Invalid tracking code'; end if;
  if p_lat not between -90 and 90 or p_lng not between -180 and 180 then
    raise exception 'Invalid coordinates';
  end if;
  insert into public.cab_locations (booking_code, lat, lng, status, driver_name, updated_at)
  values (v_code, p_lat, p_lng, 'Live',
          left(coalesce(nullif(trim(p_driver_name), ''), 'Vijay Connect Driver'), 60), now())
  on conflict (booking_code) do update
    set lat = excluded.lat, lng = excluded.lng, status = 'Live',
        driver_name = excluded.driver_name, updated_at = now();
  return true;
end $$;

-- Driver: stop sharing (removes the location so customers do not see a stale point)
create or replace function public.vc_stop_cab_location(p_driver_code text, p_booking_code text)
returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.cab_driver_codes d where d.code = p_driver_code and d.active) then
    raise exception 'Invalid driver code';
  end if;
  delete from public.cab_locations where booking_code = upper(trim(p_booking_code));
  return true;
end $$;

revoke all on function public.vc_get_cab_location(text) from public;
revoke all on function public.vc_push_cab_location(text, text, double precision, double precision, text) from public;
revoke all on function public.vc_stop_cab_location(text, text) from public;
grant execute on function public.vc_get_cab_location(text) to anon, authenticated;
grant execute on function public.vc_push_cab_location(text, text, double precision, double precision, text) to anon, authenticated;
grant execute on function public.vc_stop_cab_location(text, text) to anon, authenticated;

-- ---------------------------------------------------------------------
-- STEP 2 (you do this): create a driver code for each driver.
-- Use a LONG random code (12+ characters). Example:
--   insert into public.cab_driver_codes (code, driver_name)
--   values ('K7m2-Qx9p-Ld4v', 'Driver 1');
-- To block a driver later:
--   update public.cab_driver_codes set active = false where code = 'K7m2-Qx9p-Ld4v';
-- ---------------------------------------------------------------------

-- Optional cleanup of old points:
-- delete from public.cab_locations where updated_at < now() - interval '24 hours';
