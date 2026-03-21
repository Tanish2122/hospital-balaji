-- 1. Create a bucket for medical reports (named 'reports' as requested)
-- Note: This might fail if the bucket already exists or if run without enough permissions.
-- In Supabase, it's often safer to do this via the dashboard, but here is the SQL anyway.
INSERT INTO storage.buckets (id, name, public)
VALUES ('reports', 'reports', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies for 'reports' bucket
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'reports' );

CREATE POLICY "Anyone can upload reports"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'reports' );

-- 3. Strict Phone Number Validation (Regex for exactly 10 digits)
-- Apply to appointments, emergencies, and contact_forms

ALTER TABLE public.appointments 
ADD CONSTRAINT phone_check CHECK (phone ~ '^[0-9]{10}$');

ALTER TABLE public.emergencies 
ADD CONSTRAINT emergency_phone_check CHECK (phone ~ '^[0-9]{10}$');

ALTER TABLE public.contact_forms 
ADD CONSTRAINT contact_phone_check CHECK (phone ~ '^[0-9]{10}$');

-- Also validate the whatsapp field if present
ALTER TABLE public.appointments 
ADD CONSTRAINT whatsapp_check CHECK (whatsapp IS NULL OR whatsapp ~ '^[0-9]{10}$');

ALTER TABLE public.emergencies 
ADD CONSTRAINT emergency_whatsapp_check CHECK (whatsapp IS NULL OR whatsapp ~ '^[0-9]{10}$');
