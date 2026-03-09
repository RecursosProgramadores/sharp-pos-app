
CREATE POLICY "Public can read business contact info"
ON public.business_settings
FOR SELECT
TO anon
USING (setting_key IN ('business_info', 'schedule'));
