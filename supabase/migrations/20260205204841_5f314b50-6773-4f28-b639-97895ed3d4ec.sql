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