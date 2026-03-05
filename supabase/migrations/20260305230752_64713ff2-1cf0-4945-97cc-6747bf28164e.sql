
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
