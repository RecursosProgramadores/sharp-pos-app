-- Drop and recreate with explicit anon role
DROP POLICY IF EXISTS "Allow public reservation insert" ON public.reservations;

-- Create policy explicitly for anon role (unauthenticated users)
CREATE POLICY "Allow anonymous reservation insert"
ON public.reservations
FOR INSERT
TO anon
WITH CHECK (true);

-- Also allow authenticated users to insert
CREATE POLICY "Allow authenticated reservation insert"
ON public.reservations
FOR INSERT
TO authenticated
WITH CHECK (true);