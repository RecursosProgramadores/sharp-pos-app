-- =============================================
-- CORRECCIÓN DE WARNINGS DE SEGURIDAD
-- =============================================

-- 1. Corregir función update_updated_at_column con search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 2. Recrear vistas con security_invoker = true (Security Invoker Views)
-- Esto hace que las vistas respeten RLS del usuario que consulta

DROP VIEW IF EXISTS public.daily_sales;
CREATE VIEW public.daily_sales
WITH (security_invoker = true)
AS
SELECT 
  DATE(created_at) as sale_date,
  COUNT(*) as total_transactions,
  SUM(total) as total_revenue,
  AVG(total) as average_ticket
FROM public.sales
GROUP BY DATE(created_at)
ORDER BY sale_date DESC;

DROP VIEW IF EXISTS public.monthly_sales;
CREATE VIEW public.monthly_sales
WITH (security_invoker = true)
AS
SELECT 
  DATE_TRUNC('month', created_at)::date as sale_month,
  COUNT(*) as total_transactions,
  SUM(total) as total_revenue,
  AVG(total) as average_ticket
FROM public.sales
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY sale_month DESC;

DROP VIEW IF EXISTS public.income_by_barber;
CREATE VIEW public.income_by_barber
WITH (security_invoker = true)
AS
SELECT 
  b.id as barber_id,
  b.full_name as barber_name,
  COUNT(s.id) as total_sales,
  COALESCE(SUM(s.total), 0) as total_revenue,
  COALESCE(AVG(s.total), 0) as average_ticket
FROM public.barbers b
LEFT JOIN public.sales s ON b.id = s.barber_id
GROUP BY b.id, b.full_name
ORDER BY total_revenue DESC;

DROP VIEW IF EXISTS public.top_products;
CREATE VIEW public.top_products
WITH (security_invoker = true)
AS
SELECT 
  p.id as product_id,
  p.name as product_name,
  COALESCE(SUM(si.quantity), 0) as units_sold,
  COALESCE(SUM(si.quantity * si.price), 0) as total_revenue
FROM public.products p
LEFT JOIN public.sale_items si ON p.id = si.product_id
GROUP BY p.id, p.name
ORDER BY units_sold DESC;