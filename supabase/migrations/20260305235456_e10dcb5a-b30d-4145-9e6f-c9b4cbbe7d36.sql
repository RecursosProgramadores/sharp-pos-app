
-- 1. Add client_id to reservations to link reservations with clients
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL;

-- 2. Function to auto-create or link client when a reservation is inserted
CREATE OR REPLACE FUNCTION public.link_reservation_to_client()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing_client_id uuid;
BEGIN
  -- Try to find existing client by phone
  SELECT id INTO existing_client_id
  FROM public.clients
  WHERE phone = NEW.client_phone
  LIMIT 1;

  IF existing_client_id IS NOT NULL THEN
    -- Link existing client
    NEW.client_id := existing_client_id;
    -- Update client name/email if more info provided
    UPDATE public.clients
    SET 
      full_name = COALESCE(NULLIF(NEW.client_name, ''), full_name),
      email = COALESCE(NULLIF(NEW.client_email, ''), email),
      updated_at = now()
    WHERE id = existing_client_id;
  ELSE
    -- Create new client
    INSERT INTO public.clients (full_name, phone, email, level, points, visits, total_spent)
    VALUES (NEW.client_name, NEW.client_phone, NULLIF(NEW.client_email, ''), 'new', 0, 0, 0)
    RETURNING id INTO existing_client_id;
    NEW.client_id := existing_client_id;
  END IF;

  RETURN NEW;
END;
$$;

-- 3. Trigger on reservation insert
DROP TRIGGER IF EXISTS trg_link_reservation_client ON public.reservations;
CREATE TRIGGER trg_link_reservation_client
  BEFORE INSERT ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.link_reservation_to_client();

-- 4. Function to update client stats when a haircut is registered
CREATE OR REPLACE FUNCTION public.update_client_stats_on_haircut()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_client_id uuid;
  v_points_earned integer;
BEGIN
  -- Check if there's a client_id passed (we'll use a convention: store client_id temporarily)
  -- We look for the client_id from the metadata or skip if not available
  -- This function is called separately from the app code
  RETURN NEW;
END;
$$;

-- 5. Add client_id to haircuts table for tracking
ALTER TABLE public.haircuts ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL;

-- 6. Add reservation_id to haircuts to link which reservation generated this haircut
ALTER TABLE public.haircuts ADD COLUMN IF NOT EXISTS reservation_id uuid REFERENCES public.reservations(id) ON DELETE SET NULL;

-- 7. Function to update client stats (called from app after sale)
CREATE OR REPLACE FUNCTION public.update_client_after_sale(
  p_client_id uuid,
  p_amount numeric,
  p_points integer DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_points integer;
BEGIN
  -- Calculate points: 1 point per S/ 10
  v_points := COALESCE(p_points, FLOOR(p_amount / 10)::integer);
  
  UPDATE public.clients
  SET 
    visits = visits + 1,
    total_spent = total_spent + p_amount,
    last_visit = CURRENT_DATE,
    points = points + v_points,
    level = CASE
      WHEN visits + 1 >= 20 AND total_spent + p_amount >= 1000 THEN 'premium'
      WHEN visits + 1 >= 10 AND total_spent + p_amount >= 500 THEN 'vip'
      WHEN visits + 1 >= 3 THEN 'regular'
      ELSE 'new'
    END,
    updated_at = now()
  WHERE id = p_client_id;
END;
$$;
