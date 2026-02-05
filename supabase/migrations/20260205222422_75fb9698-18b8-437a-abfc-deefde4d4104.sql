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