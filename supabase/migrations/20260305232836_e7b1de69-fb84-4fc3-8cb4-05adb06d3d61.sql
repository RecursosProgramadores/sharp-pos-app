
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
