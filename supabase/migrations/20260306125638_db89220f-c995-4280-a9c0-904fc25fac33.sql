
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage activity logs' AND tablename = 'activity_logs'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can manage activity logs" ON public.activity_logs FOR ALL TO authenticated USING (has_role(auth.uid(), ''admin''::app_role)) WITH CHECK (has_role(auth.uid(), ''admin''::app_role))';
  END IF;
END $$;
