-- Drop all reservation INSERT policies and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Public can create reservations" ON public.reservations;
DROP POLICY IF EXISTS "Anyone can create reservations" ON public.reservations;

-- Create new INSERT policy as PERMISSIVE for anonymous users
CREATE POLICY "Allow public reservation insert"
ON public.reservations
FOR INSERT
TO public
WITH CHECK (true);