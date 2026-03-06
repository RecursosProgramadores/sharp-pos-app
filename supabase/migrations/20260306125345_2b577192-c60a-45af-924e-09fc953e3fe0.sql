
-- 1. FIX CRITICAL: Remove overly permissive public policies on barbers table
DROP POLICY IF EXISTS "Public can delete barbers" ON public.barbers;
DROP POLICY IF EXISTS "Public can insert barbers" ON public.barbers;
DROP POLICY IF EXISTS "Public can update barbers" ON public.barbers;
DROP POLICY IF EXISTS "Public can view all barbers" ON public.barbers;

-- Cajeros need to view barbers for POS operations
CREATE POLICY "Cajeros can view barbers"
ON public.barbers
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'cajero'::app_role));

-- 2. FIX: Tighten reservation anonymous insert
DROP POLICY IF EXISTS "Allow anonymous reservation insert" ON public.reservations;
DROP POLICY IF EXISTS "Allow authenticated reservation insert" ON public.reservations;

CREATE POLICY "Anyone can insert reservations"
ON public.reservations
FOR INSERT
TO anon, authenticated
WITH CHECK (
  client_name IS NOT NULL AND 
  client_name <> '' AND
  client_phone IS NOT NULL AND 
  client_phone <> '' AND
  reservation_date IS NOT NULL AND
  reservation_time IS NOT NULL
);

-- 3. Create activity_logs table for audit trail
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  details jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view activity logs"
ON public.activity_logs
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can insert activity logs"
ON public.activity_logs
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON public.activity_logs(entity_type, entity_id);

-- 4. Server-side price validation for haircuts
CREATE OR REPLACE FUNCTION public.validate_haircut_price()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  expected_price numeric;
BEGIN
  IF NEW.service_name IS NOT NULL THEN
    SELECT price INTO expected_price
    FROM public.services
    WHERE name = NEW.service_name AND is_active = true
    LIMIT 1;
    
    IF expected_price IS NOT NULL AND ABS(NEW.price - expected_price) > 0.01 THEN
      RAISE EXCEPTION 'Price manipulation detected: expected %, got %', expected_price, NEW.price;
    END IF;
  END IF;
  
  IF NEW.price <= 0 THEN
    RAISE EXCEPTION 'Price must be positive';
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_haircut_price_trigger
BEFORE INSERT ON public.haircuts
FOR EACH ROW
EXECUTE FUNCTION public.validate_haircut_price();

-- 5. Server-side validation for sale items
CREATE OR REPLACE FUNCTION public.validate_sale_item_price()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  expected_price numeric;
BEGIN
  IF NEW.product_id IS NOT NULL THEN
    SELECT sale_price INTO expected_price
    FROM public.products
    WHERE id = NEW.product_id AND active = true;
    
    IF expected_price IS NOT NULL AND ABS(NEW.price - expected_price) > 0.01 THEN
      RAISE EXCEPTION 'Product price manipulation detected';
    END IF;
  END IF;
  
  IF NEW.price <= 0 THEN
    RAISE EXCEPTION 'Price must be positive';
  END IF;
  
  IF NEW.quantity <= 0 THEN
    RAISE EXCEPTION 'Quantity must be positive';
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_sale_item_price_trigger
BEFORE INSERT ON public.sale_items
FOR EACH ROW
EXECUTE FUNCTION public.validate_sale_item_price();
