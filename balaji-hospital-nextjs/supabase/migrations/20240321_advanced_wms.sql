-- 1. Create Site Settings Table (Single Row approach for simplicity)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id integer PRIMARY KEY DEFAULT 1,
    hospital_name text DEFAULT 'Balaji Hospital',
    address text DEFAULT '27, Ratan Nagar, Dher Ke Balaji, Sikar Road, Jaipur',
    phone text DEFAULT '+91 7276229049',
    whatsapp_number text DEFAULT '917276229049',
    email text DEFAULT 'info@balajihospitaljaipur.com',
    google_maps_url text,
    meta_title text DEFAULT 'Balaji Hospital Jaipur',
    meta_description text DEFAULT 'Expert Orthopedic and ENT care.',
    CONSTRAINT one_row_only CHECK (id = 1)
);

-- 2. Create User Roles / Profiles (Admin flag on Doctors for now)
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- 3. Create Patient Profiles (derived from appointments but persisted)
CREATE TABLE IF NOT EXISTS public.patient_profiles (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    phone text UNIQUE NOT NULL,
    name text NOT NULL,
    email text,
    total_appointments integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_profiles ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for Site Settings
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update site settings" ON public.site_settings 
FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.doctors WHERE auth_id = auth.uid() AND is_admin = true)
);

-- 6. RLS Policies for Patient Profiles
CREATE POLICY "Admins can manage patient profiles" ON public.patient_profiles 
FOR ALL USING (
    EXISTS (SELECT 1 FROM public.doctors WHERE auth_id = auth.uid() AND is_admin = true)
);

-- 7. Update Appointments RLS to allow Admins to see ALL
DROP POLICY IF EXISTS "Doctors can manage their own appointments" ON public.appointments;
CREATE POLICY "Admins and Doctors can manage appointments" ON public.appointments
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.doctors 
        WHERE auth_id = auth.uid() 
        AND (is_admin = true OR id = appointments.doctor_id)
    )
);

-- 8. CMS RLS (Allow Admins full CRUD, Public Read)
-- Blogs
CREATE POLICY "Admins can manage blogs" ON public.blogs 
FOR ALL USING (
    EXISTS (SELECT 1 FROM public.doctors WHERE auth_id = auth.uid() AND is_admin = true)
);
-- Departments
CREATE POLICY "Admins can manage departments" ON public.departments 
FOR ALL USING (
    EXISTS (SELECT 1 FROM public.doctors WHERE auth_id = auth.uid() AND is_admin = true)
);
-- Testimonials
CREATE POLICY "Admins can manage testimonials" ON public.testimonials 
FOR ALL USING (
    EXISTS (SELECT 1 FROM public.doctors WHERE auth_id = auth.uid() AND is_admin = true)
);

-- 9. Function to auto-create Patient Profile on new Appointment
CREATE OR REPLACE FUNCTION public.handle_new_appointment_patient() 
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.patient_profiles (phone, name)
    VALUES (NEW.phone, NEW.patient_name)
    ON CONFLICT (phone) DO UPDATE 
    SET total_appointments = public.patient_profiles.total_appointments + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_appointment_created
    AFTER INSERT ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_appointment_patient();

-- 10. Default Settings row
INSERT INTO public.site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
