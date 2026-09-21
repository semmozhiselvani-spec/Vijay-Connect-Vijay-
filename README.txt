VIJAY CONNECT - WEBSITE (Chennai cab service)
=============================================

FILES
  index.html, style.css, script.js ...... public website (booking, login, my bookings)
  route-details.html, route_inline.js ... Chennai route + fare pages
  track.html ............................ customer live cab tracking
  driver-track.html ..................... driver page (needs a private driver code)
  vc-control-7f4k2.html ................. owner dashboard (login required, not indexed)
  vc-supabase.js ........................ Supabase URL + PUBLISHABLE key only
  supabase-cab-tracking.sql ............. secure live-tracking setup
  customer-account.sql .................. customer profiles + booking history
  supabase-owner-settings.sql ........... lets ONLY the owner edit website content

ONE-TIME SUPABASE SETUP (SQL Editor, in this order)
  1. customer-account.sql
  2. supabase-cab-tracking.sql
  3. supabase-owner-settings.sql  (first paste your OWNER user UID inside it:
     Authentication > Users > your owner user > copy UID)
  4. Create a driver code for each driver (long random code, 12+ chars):
       insert into public.cab_driver_codes (code, driver_name)
       values ('K7m2-Qx9p-Ld4v', 'Driver 1');
     To block a driver:  update public.cab_driver_codes set active=false where code='...';

SUPABASE AUTH SETTINGS
  Authentication > Providers > Email: enable, keep "Confirm email" ON.
  Authentication > URL Configuration: Site URL = your real website URL;
  add the same URL (and http://localhost:8000/ for testing) to Redirect URLs.
  Google / Facebook login: enable in Providers and paste the client ID + secret
  THERE (Supabase dashboard). Never put a client secret inside the website files.

HOW A BOOKING WORKS
  Customer fills the form -> a WhatsApp message opens with the details and a
  Booking ID (VC-XXXXXX) -> customer taps Send -> you confirm car and fare.
  The Booking ID is also the live-tracking code.
  Live tracking: give the driver the Booking ID + his driver code -> driver opens
  driver-track.html, taps Start -> customer opens track.html (Track Cab button).

SECURITY RULES
  - Only the Supabase publishable key goes in vc-supabase.js. Never a secret/service_role key.
  - Keep the owner dashboard URL private and use a strong owner password.
  - Never upload client_secret_*.json or any secret file with the website.

BEFORE GOING LIVE (checklist)
  [ ] All 3 SQL files run, driver code created
  [ ] Test: signup + email verification, booking, WhatsApp message, tracking with a real phone
  [ ] Verify the business email in the footer/JSON-LD is spelled correctly
  [ ] Add your real website URL to Google Business Profile (for Google Search + Maps)
  [ ] Add real customer reviews section when you have them
