-- Agregar política para permitir inserciones públicas en barbers (sin autenticación para demo)
CREATE POLICY "Public can insert barbers" 
ON public.barbers 
FOR INSERT 
WITH CHECK (true);

-- Agregar política para permitir actualizaciones públicas en barbers
CREATE POLICY "Public can update barbers" 
ON public.barbers 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Agregar política para permitir eliminaciones públicas en barbers  
CREATE POLICY "Public can delete barbers" 
ON public.barbers 
FOR DELETE 
USING (true);

-- También permitir ver todos los barberos (no solo activos)
DROP POLICY IF EXISTS "Public can view active barbers" ON public.barbers;
CREATE POLICY "Public can view all barbers" 
ON public.barbers 
FOR SELECT 
USING (true);

-- Políticas de storage para el bucket barbers
CREATE POLICY "Public can upload barber photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'barbers');

CREATE POLICY "Public can update barber photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'barbers')
WITH CHECK (bucket_id = 'barbers');

CREATE POLICY "Public can delete barber photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'barbers');