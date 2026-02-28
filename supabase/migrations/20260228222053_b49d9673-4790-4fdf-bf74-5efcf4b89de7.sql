
-- Drop the restrictive INSERT policies and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Allow anonymous reservation insert" ON public.reservations;
DROP POLICY IF EXISTS "Allow authenticated reservation insert" ON public.reservations;

-- Create permissive INSERT policies
CREATE POLICY "Allow anonymous reservation insert"
  ON public.reservations
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated reservation insert"
  ON public.reservations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
