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