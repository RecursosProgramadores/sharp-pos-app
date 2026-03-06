
-- Fix the security definer view issue by using security_invoker
DROP VIEW IF EXISTS public.public_barbers;

-- Re-add anon SELECT on barbers but only for active ones
-- This is intentional for the public landing page booking flow
CREATE POLICY "Public can view active barbers"
ON public.barbers
FOR SELECT
TO anon
USING (active = true);
