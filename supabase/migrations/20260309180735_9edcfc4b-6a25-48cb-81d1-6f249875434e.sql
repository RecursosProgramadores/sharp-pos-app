
-- Fix: Restrict business bucket write access to admins only
DROP POLICY IF EXISTS "Authenticated users can upload business assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update business assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete business assets" ON storage.objects;

CREATE POLICY "Admins can upload business assets"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'business' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update business assets"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'business' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete business assets"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'business' AND public.has_role(auth.uid(), 'admin'));
