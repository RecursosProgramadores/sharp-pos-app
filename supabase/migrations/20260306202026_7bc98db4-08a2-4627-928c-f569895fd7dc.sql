
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
