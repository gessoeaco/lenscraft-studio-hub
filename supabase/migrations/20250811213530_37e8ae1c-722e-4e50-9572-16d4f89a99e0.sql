-- Add permissive update policies to enable admin panel actions (temporary until auth is implemented)

-- Contacts: allow updates
create policy "Admins can update contacts"
on public.contacts
for update
using (true)
with check (true);

-- Bookings: allow updates
create policy "Admins can update bookings"
on public.bookings
for update
using (true)
with check (true);

-- Testimonials: allow updates (and optional deletes if needed later)
create policy "Admins can update testimonials"
on public.testimonials
for update
using (true)
with check (true);
