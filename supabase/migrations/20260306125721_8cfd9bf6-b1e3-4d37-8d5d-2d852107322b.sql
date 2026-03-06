
-- Fix barbers: Remove anon direct access, create a public view with safe fields only
DROP POLICY IF EXISTS "Anon can view active barbers basic info" ON public.barbers;

-- Create a public-safe view for the landing page
CREATE OR REPLACE VIEW public.public_barbers 
WITH (security_invoker = false)
AS 
SELECT id, full_name, specialty, photo_url
FROM public.barbers
WHERE active = true;

-- Grant anon access to the view only
GRANT SELECT ON public.public_barbers TO anon;
GRANT SELECT ON public.public_barbers TO authenticated;

-- Authenticated users (admin/cajero) still have full access via existing policies
-- Anon users can only see the safe view
