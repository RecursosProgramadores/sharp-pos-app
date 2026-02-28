
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
