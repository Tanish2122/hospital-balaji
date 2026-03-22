-- 1. Add Email, Role, and Status columns to doctors table
-- We use TEXT for simplicity instead of ENUM, with CHECK constraints for safety.

ALTER TABLE public.doctors 
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS role text DEFAULT 'doctor' CHECK (role IN ('admin', 'doctor', 'staff')),
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active' CHECK (status IN ('active', 'inactive'));

-- 2. Migrate existing is_admin flag to the new role column
UPDATE public.doctors SET role = 'admin' WHERE is_admin = true;
-- Note: We keep is_admin for backward compatibility in some RLS, but will transition to role.

-- 3. Update RLS: General Policy for Admins
DROP POLICY IF EXISTS "Admins can manage anything" ON public.doctors;
CREATE POLICY "Admins have full control over doctors" ON public.doctors
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.doctors 
        WHERE auth_id = auth.uid() 
        AND (role = 'admin' OR is_admin = true)
        AND status = 'active'
    )
);

-- 4. Update RLS: Doctors can only view themselves and update their own profile IF active
DROP POLICY IF EXISTS "Doctors can update their own profile" ON public.doctors;
CREATE POLICY "Active doctors can manage their own profile" ON public.doctors
FOR ALL USING (
    auth_id = auth.uid() 
    AND status = 'active'
);

-- 5. Restrict access for inactive users globally (via RLS on core tables)
-- Update existing appointments policy to check for active status
DROP POLICY IF EXISTS "Admins and Doctors can manage appointments" ON public.appointments;
CREATE POLICY "Active Staff and Admins manage appointments" ON public.appointments
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.doctors 
        WHERE auth_id = auth.uid() 
        AND status = 'active'
        AND (role = 'admin' OR is_admin = true OR (role IN ('doctor', 'staff') AND id = appointments.doctor_id))
    )
);

-- 6. New Table for Gallery (if missing from previous tasks)
CREATE TABLE IF NOT EXISTS public.gallery (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    url text NOT NULL,
    category text DEFAULT 'Hospital',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Admins can manage gallery" ON public.gallery 
FOR ALL USING (
    EXISTS (SELECT 1 FROM public.doctors WHERE auth_id = auth.uid() AND (role = 'admin' OR is_admin = true) AND status = 'active')
);
