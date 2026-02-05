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