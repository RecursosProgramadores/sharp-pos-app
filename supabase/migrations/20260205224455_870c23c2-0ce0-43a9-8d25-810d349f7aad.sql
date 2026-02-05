-- Drop existing restrictive INSERT policy
DROP POLICY IF EXISTS "Anyone can create reservations" ON public.reservations;

-- Create proper policy for anonymous public reservations
CREATE POLICY "Public can create reservations"
ON public.reservations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);