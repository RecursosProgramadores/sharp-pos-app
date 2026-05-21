-- =============================================
-- SISTEMA POS BARBERÍA - BACKEND COMPLETO
-- =============================================

-- 1. ENUM PARA ROLES
CREATE TYPE public.app_role AS ENUM ('admin');

-- 2. TABLA DE ROLES DE USUARIO (separada de profiles por seguridad)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- 3. FUNCIÓN SECURITY DEFINER PARA VERIFICAR ROLES (evita recursión RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. TABLA PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. TABLA BARBERS
CREATE TABLE public.barbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT,
  photo_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. TABLA BARBER_SCHEDULES
CREATE TABLE public.barber_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id UUID NOT NULL REFERENCES public.barbers(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (barber_id, day_of_week)
);

-- 7. TABLA HAIRCUTS (servicios/cortes)
CREATE TABLE public.haircuts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id UUID REFERENCES public.barbers(id) ON DELETE SET NULL,
  service_name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  payment_method TEXT NOT NULL DEFAULT 'cash',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 8. TABLA PRODUCTS
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  barcode TEXT UNIQUE,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  purchase_price NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (purchase_price >= 0),
  sale_price NUMERIC(10,2) NOT NULL CHECK (sale_price >= 0),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 9. TABLA SALES
CREATE TABLE public.sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id UUID REFERENCES public.barbers(id) ON DELETE SET NULL,
  total NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
  payment_method TEXT NOT NULL DEFAULT 'cash',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 10. TABLA SALE_ITEMS
CREATE TABLE public.sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- TRIGGERS Y FUNCIONES DE AUTOMATIZACIÓN
-- =============================================

-- Función para descontar stock al insertar sale_items
CREATE OR REPLACE FUNCTION public.decrease_stock_on_sale()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_stock INTEGER;
BEGIN
  -- Obtener stock actual
  SELECT stock INTO current_stock
  FROM public.products
  WHERE id = NEW.product_id;
  
  -- Verificar que hay suficiente stock
  IF current_stock IS NULL THEN
    RAISE EXCEPTION 'Producto no encontrado';
  END IF;
  
  IF current_stock < NEW.quantity THEN
    RAISE EXCEPTION 'Stock insuficiente. Stock actual: %, Cantidad solicitada: %', current_stock, NEW.quantity;
  END IF;
  
  -- Descontar stock
  UPDATE public.products
  SET stock = stock - NEW.quantity,
      updated_at = now()
  WHERE id = NEW.product_id;
  
  RETURN NEW;
END;
$$;

-- Trigger para descontar stock
CREATE TRIGGER trigger_decrease_stock
  AFTER INSERT ON public.sale_items
  FOR EACH ROW
  WHEN (NEW.product_id IS NOT NULL)
  EXECUTE FUNCTION public.decrease_stock_on_sale();

-- Función para restaurar stock al eliminar sale_items
CREATE OR REPLACE FUNCTION public.restore_stock_on_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.product_id IS NOT NULL THEN
    UPDATE public.products
    SET stock = stock + OLD.quantity,
        updated_at = now()
    WHERE id = OLD.product_id;
  END IF;
  RETURN OLD;
END;
$$;

-- Trigger para restaurar stock al eliminar
CREATE TRIGGER trigger_restore_stock
  BEFORE DELETE ON public.sale_items
  FOR EACH ROW
  EXECUTE FUNCTION public.restore_stock_on_delete();

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_barbers_updated_at
  BEFORE UPDATE ON public.barbers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Crear perfil
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  
  -- Asignar rol admin por defecto
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'admin');
  
  RETURN NEW;
END;
$$;

-- Trigger para nuevos usuarios
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- VISTAS PARA DASHBOARD (SOLO LECTURA)
-- =============================================

-- Vista: Ventas diarias
CREATE OR REPLACE VIEW public.daily_sales AS
SELECT 
  DATE(created_at) as sale_date,
  COUNT(*) as total_transactions,
  SUM(total) as total_revenue,
  AVG(total) as average_ticket
FROM public.sales
GROUP BY DATE(created_at)
ORDER BY sale_date DESC;

-- Vista: Ventas mensuales
CREATE OR REPLACE VIEW public.monthly_sales AS
SELECT 
  DATE_TRUNC('month', created_at)::date as sale_month,
  COUNT(*) as total_transactions,
  SUM(total) as total_revenue,
  AVG(total) as average_ticket
FROM public.sales
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY sale_month DESC;

-- Vista: Ingresos por barbero
CREATE OR REPLACE VIEW public.income_by_barber AS
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

-- Vista: Top productos vendidos
CREATE OR REPLACE VIEW public.top_products AS
SELECT 
  p.id as product_id,
  p.name as product_name,
  COALESCE(SUM(si.quantity), 0) as units_sold,
  COALESCE(SUM(si.quantity * si.price), 0) as total_revenue
FROM public.products p
LEFT JOIN public.sale_items si ON p.id = si.product_id
GROUP BY p.id, p.name
ORDER BY units_sold DESC;

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barber_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.haircuts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS PARA user_roles
CREATE POLICY "Admins can view all user roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage user roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- POLÍTICAS PARA profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can manage all profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- POLÍTICAS PARA barbers (público puede ver activos, admin todo)
CREATE POLICY "Public can view active barbers"
  ON public.barbers FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can manage all barbers"
  ON public.barbers FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- POLÍTICAS PARA barber_schedules
CREATE POLICY "Public can view schedules"
  ON public.barber_schedules FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage schedules"
  ON public.barber_schedules FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- POLÍTICAS PARA haircuts
CREATE POLICY "Admins can view all haircuts"
  ON public.haircuts FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage haircuts"
  ON public.haircuts FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- POLÍTICAS PARA products
CREATE POLICY "Admins can view all products"
  ON public.products FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- POLÍTICAS PARA sales
CREATE POLICY "Admins can view all sales"
  ON public.sales FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage sales"
  ON public.sales FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- POLÍTICAS PARA sale_items
CREATE POLICY "Admins can view all sale items"
  ON public.sale_items FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage sale items"
  ON public.sale_items FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- STORAGE BUCKET PARA FOTOS DE BARBEROS
-- =============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'barbers',
  'barbers',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Política: Lectura pública
CREATE POLICY "Public can view barber photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'barbers');

-- Política: Solo admin puede subir
CREATE POLICY "Admins can upload barber photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'barbers' 
    AND public.has_role(auth.uid(), 'admin')
  );

-- Política: Solo admin puede actualizar
CREATE POLICY "Admins can update barber photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'barbers' 
    AND public.has_role(auth.uid(), 'admin')
  );

-- Política: Solo admin puede eliminar
CREATE POLICY "Admins can delete barber photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'barbers' 
    AND public.has_role(auth.uid(), 'admin')
  );



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



-- Agregar campos de pagos/comisiones a la tabla barbers
ALTER TABLE public.barbers 
ADD COLUMN IF NOT EXISTS dni TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS specialty TEXT,
ADD COLUMN IF NOT EXISTS work_type TEXT DEFAULT 'fulltime',
ADD COLUMN IF NOT EXISTS hire_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS commission_percentage INTEGER DEFAULT 50 CHECK (commission_percentage >= 0 AND commission_percentage <= 100),
ADD COLUMN IF NOT EXISTS lunch_included BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS lunch_amount NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS incentives_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS incentive_per_cut NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS incentive_threshold INTEGER DEFAULT 0;



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



-- Agregar rol 'cajero' al enum app_role
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'cajero';

-- Crear vista para obtener roles del usuario actual de forma segura
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;



-- Allow users to read their own role
CREATE POLICY "Users can view their own role"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);



-- Create clients table with all necessary fields
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  birth_date DATE,
  photo_url TEXT,
  preferred_barber_id UUID REFERENCES public.barbers(id) ON DELETE SET NULL,
  preferred_services TEXT[] DEFAULT '{}',
  notes TEXT,
  visits INTEGER NOT NULL DEFAULT 0,
  total_spent NUMERIC NOT NULL DEFAULT 0,
  points INTEGER NOT NULL DEFAULT 0,
  level TEXT NOT NULL DEFAULT 'new' CHECK (level IN ('new', 'regular', 'vip', 'premium')),
  last_visit DATE,
  satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Both admin and cajero can manage clients
CREATE POLICY "Admins can manage clients"
ON public.clients
FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Cajeros can view clients"
ON public.clients
FOR SELECT
USING (has_role(auth.uid(), 'cajero'));

CREATE POLICY "Cajeros can insert clients"
ON public.clients
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'cajero'));

CREATE POLICY "Cajeros can update clients"
ON public.clients
FOR UPDATE
USING (has_role(auth.uid(), 'cajero'))
WITH CHECK (has_role(auth.uid(), 'cajero'));

-- Trigger for updated_at
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for client photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('clients', 'clients', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for client photos
CREATE POLICY "Anyone can view client photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'clients');

CREATE POLICY "Authenticated users can upload client photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'clients' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update client photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'clients' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete client photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'clients' AND auth.role() = 'authenticated');



-- =============================================
-- TABLA: SEDES (Locations/Branches)
-- =============================================
CREATE TABLE public.locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  schedule TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- TABLA: SERVICIOS (Services/Haircuts catalog)
-- =============================================
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'cortes',
  price NUMERIC(10,2) NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- TABLA: RESERVAS (Appointments from public website)
-- =============================================
CREATE TABLE public.reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Datos del cliente (capturados desde landing page)
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  -- Relaciones
  service_id UUID REFERENCES public.services(id),
  barber_id UUID REFERENCES public.barbers(id),
  location_id UUID REFERENCES public.locations(id),
  -- Detalles de la cita
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  -- Estado y seguimiento
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- RLS POLICIES
-- =============================================

-- LOCATIONS: Públicas para lectura, solo admin puede modificar
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active locations"
  ON public.locations FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage locations"
  ON public.locations FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- SERVICES: Públicos para lectura, solo admin puede modificar
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active services"
  ON public.services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage services"
  ON public.services FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RESERVATIONS: Públicas para insertar (anónimos pueden reservar), staff puede ver/editar
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create reservations"
  ON public.reservations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Staff can view all reservations"
  ON public.reservations FOR SELECT
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'cajero'));

CREATE POLICY "Staff can update reservations"
  ON public.reservations FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'cajero'));

CREATE POLICY "Admins can delete reservations"
  ON public.reservations FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- TRIGGERS para updated_at
-- =============================================
CREATE TRIGGER update_locations_updated_at
  BEFORE UPDATE ON public.locations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- DATOS INICIALES: Sedes y Servicios de ejemplo
-- =============================================
INSERT INTO public.locations (name, address, phone, whatsapp, schedule) VALUES
  ('Sucursal Central', 'Jr. Independencia 1589, Huánuco', '987457832', '51987457832', 'Lun - Sáb: 9:30 AM - 9:00 PM'),
  ('Sucursal A', 'Jr. Independencia 1592, Huánuco', '987457832', '51987457832', 'Lun - Sáb: 9:30 AM - 9:00 PM');

INSERT INTO public.services (name, description, category, price, duration_minutes, is_popular) VALUES
  ('Corte Clásico/Degradado', 'Corte de cabello + lavado + cepillado y aplicación de producto.', 'cortes', 15.00, 40, false),
  ('Corte Premium', 'Corte + lavado + perfilación de cejas + cepillado y producto.', 'cortes', 20.00, 50, true),
  ('Premium Plus', 'Corte + lavado + cejas + perfilación de barba + cepillado + masaje.', 'cortes', 35.00, 70, false),
  ('Premium Plus VIP', 'Todo Premium Plus + tratamiento facial + masaje exclusivo.', 'cortes', 50.00, 105, false),
  ('Degradado Skin', 'Degradado al cero con navaja profesional.', 'degradados', 18.00, 45, false),
  ('Perfilado de Barba', 'Recorte y perfilado de barba con navaja.', 'barba', 12.00, 25, false),
  ('Afeitado Clásico', 'Afeitado tradicional con toalla caliente y navaja.', 'barba', 20.00, 35, false),
  ('Tinte Cabello', 'Coloración completa del cabello.', 'tintes', 45.00, 90, false),
  ('Platinado', 'Decoloración y platinado profesional.', 'tintes', 80.00, 120, false),
  ('Ondulado Permanente', 'Texturizado con ondas permanentes.', 'ondulados', 60.00, 90, false);

-- =============================================
-- Política adicional: Barberos públicos para lectura en landing
-- =============================================
CREATE POLICY "Anyone can view active barbers"
  ON public.barbers FOR SELECT
  USING (active = true);



-- Drop existing restrictive INSERT policy
DROP POLICY IF EXISTS "Anyone can create reservations" ON public.reservations;

-- Create proper policy for anonymous public reservations
CREATE POLICY "Public can create reservations"
ON public.reservations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);



-- Drop all reservation INSERT policies and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Public can create reservations" ON public.reservations;
DROP POLICY IF EXISTS "Anyone can create reservations" ON public.reservations;

-- Create new INSERT policy as PERMISSIVE for anonymous users
CREATE POLICY "Allow public reservation insert"
ON public.reservations
FOR INSERT
TO public
WITH CHECK (true);



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




-- Drop the restrictive INSERT policies and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Allow anonymous reservation insert" ON public.reservations;
DROP POLICY IF EXISTS "Allow authenticated reservation insert" ON public.reservations;

-- Create permissive INSERT policies
CREATE POLICY "Allow anonymous reservation insert"
  ON public.reservations
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated reservation insert"
  ON public.reservations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);




-- Add missing columns to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'General';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS min_stock integer NOT NULL DEFAULT 5;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS photo_url text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sku text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description text;

-- Create stock_movements table
CREATE TABLE public.stock_movements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('purchase', 'sale', 'adjustment', 'waste', 'return', 'internal')),
  quantity integer NOT NULL,
  stock_before integer NOT NULL DEFAULT 0,
  stock_after integer NOT NULL DEFAULT 0,
  reason text,
  responsible text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage movements"
  ON public.stock_movements
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Cajeros can view movements"
  ON public.stock_movements
  FOR SELECT
  USING (has_role(auth.uid(), 'cajero'::app_role));

CREATE POLICY "Cajeros can insert movements"
  ON public.stock_movements
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'cajero'::app_role));

-- Create products storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

CREATE POLICY "Authenticated can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update product images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'products' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'products' AND auth.role() = 'authenticated');

-- Index for faster queries
CREATE INDEX idx_stock_movements_product_id ON public.stock_movements(product_id);
CREATE INDEX idx_stock_movements_created_at ON public.stock_movements(created_at DESC);
CREATE INDEX idx_products_category ON public.products(category);




-- Attendance tracking table
CREATE TABLE public.barber_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  barber_id UUID NOT NULL REFERENCES public.barbers(id) ON DELETE CASCADE,
  attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('present', 'absent', 'late', 'halfday', 'pending')),
  entry_time TIME,
  exit_time TIME,
  scheduled_start TIME,
  scheduled_end TIME,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(barber_id, attendance_date)
);

ALTER TABLE public.barber_attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage attendance" ON public.barber_attendance FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Cajeros can view attendance" ON public.barber_attendance FOR SELECT
  USING (has_role(auth.uid(), 'cajero'::app_role));

CREATE POLICY "Cajeros can insert attendance" ON public.barber_attendance FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'cajero'::app_role));

CREATE POLICY "Cajeros can update attendance" ON public.barber_attendance FOR UPDATE
  USING (has_role(auth.uid(), 'cajero'::app_role))
  WITH CHECK (has_role(auth.uid(), 'cajero'::app_role));

CREATE INDEX idx_attendance_barber_date ON public.barber_attendance(barber_id, attendance_date);
CREATE INDEX idx_attendance_date ON public.barber_attendance(attendance_date);

-- Chair rentals table
CREATE TABLE public.chair_rentals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  barber_id UUID NOT NULL REFERENCES public.barbers(id) ON DELETE CASCADE,
  chair_number INTEGER NOT NULL,
  weekly_rate NUMERIC NOT NULL DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  contract_notes TEXT,
  payment_day TEXT DEFAULT 'monday',
  deposit_amount NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.chair_rentals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage chair rentals" ON public.chair_rentals FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Cajeros can view chair rentals" ON public.chair_rentals FOR SELECT
  USING (has_role(auth.uid(), 'cajero'::app_role));

CREATE INDEX idx_chair_rentals_barber ON public.chair_rentals(barber_id);
CREATE INDEX idx_chair_rentals_status ON public.chair_rentals(status);

-- Chair rental payments table
CREATE TABLE public.chair_rental_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rental_id UUID NOT NULL REFERENCES public.chair_rentals(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  payment_method TEXT DEFAULT 'cash',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.chair_rental_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage rental payments" ON public.chair_rental_payments FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Cajeros can view rental payments" ON public.chair_rental_payments FOR SELECT
  USING (has_role(auth.uid(), 'cajero'::app_role));

CREATE INDEX idx_rental_payments_rental ON public.chair_rental_payments(rental_id);

-- Triggers for updated_at
CREATE TRIGGER update_barber_attendance_updated_at
  BEFORE UPDATE ON public.barber_attendance
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chair_rentals_updated_at
  BEFORE UPDATE ON public.chair_rentals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();




-- Allow cajeros to insert haircuts (for POS)
CREATE POLICY "Cajeros can insert haircuts"
  ON public.haircuts FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'cajero'));

-- Allow cajeros to view haircuts
CREATE POLICY "Cajeros can view haircuts"
  ON public.haircuts FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'cajero'));

-- Allow cajeros to insert sales
CREATE POLICY "Cajeros can insert sales"
  ON public.sales FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'cajero'));

-- Allow cajeros to view sales
CREATE POLICY "Cajeros can view sales"
  ON public.sales FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'cajero'));

-- Allow cajeros to insert sale items
CREATE POLICY "Cajeros can insert sale items"
  ON public.sale_items FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'cajero'));

-- Allow cajeros to view sale items
CREATE POLICY "Cajeros can view sale items"
  ON public.sale_items FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'cajero'));

-- Allow cajeros to view products for POS
CREATE POLICY "Cajeros can view products"
  ON public.products FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'cajero'));




-- Settings table: key-value store for all configuration
CREATE TABLE public.business_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage settings
CREATE POLICY "Admins can manage settings" ON public.business_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Cajeros can view settings (for receipt/printing config etc)
CREATE POLICY "Cajeros can view settings" ON public.business_settings
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'cajero'));

-- Trigger for updated_at
CREATE TRIGGER update_business_settings_updated_at
  BEFORE UPDATE ON public.business_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.business_settings (setting_key, setting_value) VALUES
  ('business_info', '{"name":"Tayta BarberShop","tagline":"Tu estilo, nuestra pasión","taxId":"","address":"","phone":"","email":"","website":"","facebook":"","instagram":"","tiktok":"","mapUrl":""}'::jsonb),
  ('schedule', '{"monday":{"open":"09:00","close":"20:00","closed":false},"tuesday":{"open":"09:00","close":"20:00","closed":false},"wednesday":{"open":"09:00","close":"20:00","closed":false},"thursday":{"open":"09:00","close":"20:00","closed":false},"friday":{"open":"09:00","close":"20:00","closed":false},"saturday":{"open":"09:00","close":"20:00","closed":false},"sunday":{"open":"","close":"","closed":true}}'::jsonb),
  ('notifications', '{"lowStock":{"enabled":true,"threshold":5},"outOfStock":{"enabled":true},"importantSales":{"enabled":true,"threshold":100},"birthdays":{"enabled":true,"threshold":3},"barberDelay":{"enabled":true,"threshold":15},"excessCash":{"enabled":false,"threshold":500},"channels":{"inApp":true,"email":{"enabled":true,"address":""},"sms":{"enabled":false,"phone":""},"push":{"enabled":false}},"frequency":"immediate"}'::jsonb),
  ('appearance', '{"theme":"light","highContrast":false,"language":"es-pe","colors":{"primary":"#D21A20","secondary":"#F96C1A","background":"#FAFAFA","text":"#1E293B"},"widgets":{"revenue":true,"sales":true,"clients":true,"barbers":true,"chart":true,"recent":true,"alerts":true,"ranking":true}}'::jsonb),
  ('printing', '{"printerType":"thermal58","connectionMethod":"usb","printerName":"POS-58","receipt":{"includeLogo":true,"headerText":"TAYTA BARBERSHOP","footerText":"¡Gracias por tu visita!\\nVuelve pronto","includeQR":true,"qrUrl":"","includeFiscalData":true,"fontSize":"medium"},"vouchers":{"boletaPrefix":"B001","facturaPrefix":"F001","notaCreditoPrefix":"NC01","currentBoletaNumber":1,"currentFacturaNumber":1,"currentNotaNumber":1}}'::jsonb),
  ('taxes', '{"taxes":[{"id":"default-igv","name":"IGV","rate":18,"applyToServices":true,"applyToProducts":true,"includedInPrice":true,"resolutionNumber":"","active":true}]}'::jsonb),
  ('loyalty', '{"enabled":true,"pointsPerDollar":10,"pointValue":0.1,"referralPoints":25,"birthdayDiscount":15,"firstVisitDiscount":10,"happyHour":{"enabled":true,"discount":20,"days":["tuesday","wednesday"],"start":"14:00","end":"17:00"},"rewards":[{"id":"r1","name":"Corte Gratis","pointsRequired":50,"description":"Un corte clásico completamente gratis","active":true},{"id":"r2","name":"20% Descuento","pointsRequired":100,"description":"20% de descuento en cualquier servicio","active":true}]}'::jsonb),
  ('security', '{"passwordExpiry":{"enabled":true,"days":90},"twoFactor":false,"autoLogout":{"enabled":true,"minutes":30},"logFailedAttempts":true,"privacyPolicy":"Política de privacidad de Tayta BarberShop.\\n\\nSus datos personales serán tratados de forma confidencial."}'::jsonb);




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



ALTER PUBLICATION supabase_realtime ADD TABLE public.reservations;




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




DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage activity logs' AND tablename = 'activity_logs'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can manage activity logs" ON public.activity_logs FOR ALL TO authenticated USING (has_role(auth.uid(), ''admin''::app_role)) WITH CHECK (has_role(auth.uid(), ''admin''::app_role))';
  END IF;
END $$;




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




-- Fix the security definer view issue by using security_invoker
DROP VIEW IF EXISTS public.public_barbers;

-- Re-add anon SELECT on barbers but only for active ones
-- This is intentional for the public landing page booking flow
CREATE POLICY "Public can view active barbers"
ON public.barbers
FOR SELECT
TO anon
USING (active = true);




-- Fix user_roles RLS: Drop all restrictive policies and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;

-- Recreate as PERMISSIVE policies
CREATE POLICY "Users can view their own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));




-- Also fix other tables with restrictive-only policies
-- Fix barber_attendance
DROP POLICY IF EXISTS "Admins can manage attendance" ON public.barber_attendance;
DROP POLICY IF EXISTS "Cajeros can insert attendance" ON public.barber_attendance;
DROP POLICY IF EXISTS "Cajeros can update attendance" ON public.barber_attendance;
DROP POLICY IF EXISTS "Cajeros can view attendance" ON public.barber_attendance;

CREATE POLICY "Admins can manage attendance" ON public.barber_attendance FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Cajeros can view attendance" ON public.barber_attendance FOR SELECT TO authenticated USING (has_role(auth.uid(), 'cajero'));
CREATE POLICY "Cajeros can insert attendance" ON public.barber_attendance FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'cajero'));
CREATE POLICY "Cajeros can update attendance" ON public.barber_attendance FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'cajero')) WITH CHECK (has_role(auth.uid(), 'cajero'));

-- Fix chair_rentals
DROP POLICY IF EXISTS "Admins can manage chair rentals" ON public.chair_rentals;
DROP POLICY IF EXISTS "Cajeros can view chair rentals" ON public.chair_rentals;

CREATE POLICY "Admins can manage chair rentals" ON public.chair_rentals FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Cajeros can view chair rentals" ON public.chair_rentals FOR SELECT TO authenticated USING (has_role(auth.uid(), 'cajero'));

-- Fix barbers
DROP POLICY IF EXISTS "Admins can manage all barbers" ON public.barbers;
DROP POLICY IF EXISTS "Anyone can view active barbers" ON public.barbers;
DROP POLICY IF EXISTS "Cajeros can view barbers" ON public.barbers;
DROP POLICY IF EXISTS "Public can view active barbers" ON public.barbers;

CREATE POLICY "Admins can manage all barbers" ON public.barbers FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Public can view active barbers" ON public.barbers FOR SELECT TO anon USING (active = true);
CREATE POLICY "Authenticated can view active barbers" ON public.barbers FOR SELECT TO authenticated USING (active = true);

-- Fix haircuts
DROP POLICY IF EXISTS "Admins can manage haircuts" ON public.haircuts;
DROP POLICY IF EXISTS "Admins can view all haircuts" ON public.haircuts;
DROP POLICY IF EXISTS "Cajeros can insert haircuts" ON public.haircuts;
DROP POLICY IF EXISTS "Cajeros can view haircuts" ON public.haircuts;

CREATE POLICY "Admins can manage haircuts" ON public.haircuts FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Cajeros can view haircuts" ON public.haircuts FOR SELECT TO authenticated USING (has_role(auth.uid(), 'cajero'));
CREATE POLICY "Cajeros can insert haircuts" ON public.haircuts FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'cajero'));

-- Fix sales
DROP POLICY IF EXISTS "Admins can manage sales" ON public.sales;
DROP POLICY IF EXISTS "Admins can view all sales" ON public.sales;
DROP POLICY IF EXISTS "Cajeros can insert sales" ON public.sales;
DROP POLICY IF EXISTS "Cajeros can view sales" ON public.sales;

CREATE POLICY "Admins can manage sales" ON public.sales FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Cajeros can view sales" ON public.sales FOR SELECT TO authenticated USING (has_role(auth.uid(), 'cajero'));
CREATE POLICY "Cajeros can insert sales" ON public.sales FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'cajero'));

-- Fix sale_items
DROP POLICY IF EXISTS "Admins can manage sale items" ON public.sale_items;
DROP POLICY IF EXISTS "Admins can view all sale items" ON public.sale_items;
DROP POLICY IF EXISTS "Cajeros can insert sale items" ON public.sale_items;
DROP POLICY IF EXISTS "Cajeros can view sale items" ON public.sale_items;

CREATE POLICY "Admins can manage sale items" ON public.sale_items FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Cajeros can view sale items" ON public.sale_items FOR SELECT TO authenticated USING (has_role(auth.uid(), 'cajero'));
CREATE POLICY "Cajeros can insert sale items" ON public.sale_items FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'cajero'));

-- Fix products
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Admins can view all products" ON public.products;
DROP POLICY IF EXISTS "Cajeros can view products" ON public.products;

CREATE POLICY "Admins can manage products" ON public.products FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Cajeros can view products" ON public.products FOR SELECT TO authenticated USING (has_role(auth.uid(), 'cajero'));

-- Fix stock_movements
DROP POLICY IF EXISTS "Admins can manage movements" ON public.stock_movements;
DROP POLICY IF EXISTS "Cajeros can insert movements" ON public.stock_movements;
DROP POLICY IF EXISTS "Cajeros can view movements" ON public.stock_movements;

CREATE POLICY "Admins can manage movements" ON public.stock_movements FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Cajeros can view movements" ON public.stock_movements FOR SELECT TO authenticated USING (has_role(auth.uid(), 'cajero'));
CREATE POLICY "Cajeros can insert movements" ON public.stock_movements FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'cajero'));

-- Fix clients
DROP POLICY IF EXISTS "Admins can manage clients" ON public.clients;
DROP POLICY IF EXISTS "Cajeros can insert clients" ON public.clients;
DROP POLICY IF EXISTS "Cajeros can update clients" ON public.clients;
DROP POLICY IF EXISTS "Cajeros can view clients" ON public.clients;

CREATE POLICY "Admins can manage clients" ON public.clients FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Cajeros can view clients" ON public.clients FOR SELECT TO authenticated USING (has_role(auth.uid(), 'cajero'));
CREATE POLICY "Cajeros can insert clients" ON public.clients FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'cajero'));
CREATE POLICY "Cajeros can update clients" ON public.clients FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'cajero')) WITH CHECK (has_role(auth.uid(), 'cajero'));

-- Fix reservations
DROP POLICY IF EXISTS "Admins can delete reservations" ON public.reservations;
DROP POLICY IF EXISTS "Anyone can insert reservations" ON public.reservations;
DROP POLICY IF EXISTS "Staff can update reservations" ON public.reservations;
DROP POLICY IF EXISTS "Staff can view all reservations" ON public.reservations;

CREATE POLICY "Anyone can insert reservations" ON public.reservations FOR INSERT TO anon, authenticated WITH CHECK (client_name IS NOT NULL AND client_name <> '' AND client_phone IS NOT NULL AND client_phone <> '' AND reservation_date IS NOT NULL AND reservation_time IS NOT NULL);
CREATE POLICY "Staff can view all reservations" ON public.reservations FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'cajero'));
CREATE POLICY "Staff can update reservations" ON public.reservations FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'cajero'));
CREATE POLICY "Admins can delete reservations" ON public.reservations FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Fix services
DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
DROP POLICY IF EXISTS "Anyone can view active services" ON public.services;

CREATE POLICY "Admins can manage services" ON public.services FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can view active services" ON public.services FOR SELECT TO anon, authenticated USING (is_active = true);

-- Fix locations
DROP POLICY IF EXISTS "Admins can manage locations" ON public.locations;
DROP POLICY IF EXISTS "Anyone can view active locations" ON public.locations;

CREATE POLICY "Admins can manage locations" ON public.locations FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can view active locations" ON public.locations FOR SELECT TO anon, authenticated USING (is_active = true);

-- Fix business_settings
DROP POLICY IF EXISTS "Admins can manage settings" ON public.business_settings;
DROP POLICY IF EXISTS "Cajeros can view settings" ON public.business_settings;

CREATE POLICY "Admins can manage settings" ON public.business_settings FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Cajeros can view settings" ON public.business_settings FOR SELECT TO authenticated USING (has_role(auth.uid(), 'cajero'));

-- Fix chair_rental_payments
DROP POLICY IF EXISTS "Admins can manage rental payments" ON public.chair_rental_payments;
DROP POLICY IF EXISTS "Cajeros can view rental payments" ON public.chair_rental_payments;

CREATE POLICY "Admins can manage rental payments" ON public.chair_rental_payments FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Cajeros can view rental payments" ON public.chair_rental_payments FOR SELECT TO authenticated USING (has_role(auth.uid(), 'cajero'));

-- Fix barber_schedules
DROP POLICY IF EXISTS "Admins can manage schedules" ON public.barber_schedules;
DROP POLICY IF EXISTS "Public can view schedules" ON public.barber_schedules;

CREATE POLICY "Admins can manage schedules" ON public.barber_schedules FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Public can view schedules" ON public.barber_schedules FOR SELECT TO anon, authenticated USING (true);

-- Fix profiles
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Fix activity_logs
DROP POLICY IF EXISTS "Admins can manage activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Admins can view activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Authenticated users can insert activity logs" ON public.activity_logs;

CREATE POLICY "Admins can manage activity logs" ON public.activity_logs FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated users can insert activity logs" ON public.activity_logs FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());



-- Fix the trigger: only create profile, do NOT assign admin role automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$function$;



INSERT INTO storage.buckets (id, name, public)
VALUES ('business', 'business', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload business assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'business');

CREATE POLICY "Authenticated users can update business assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'business');

CREATE POLICY "Anyone can view business assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'business');

CREATE POLICY "Authenticated users can delete business assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'business');




CREATE POLICY "Public can read business contact info"
ON public.business_settings
FOR SELECT
TO anon
USING (setting_key IN ('business_info', 'schedule'));



ALTER TABLE public.business_settings ADD CONSTRAINT business_settings_setting_key_unique UNIQUE (setting_key);




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



