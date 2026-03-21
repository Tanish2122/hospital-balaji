-- 1. Link Doctors to Supabase Auth
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS auth_id uuid REFERENCES auth.users(id);

-- 2. Create Availability Table
CREATE TABLE IF NOT EXISTS public.availability (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    doctor_id uuid REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
    day_of_week text CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'SpecificDate')),
    specific_date date, -- Used when day_of_week is 'SpecificDate' for leaves or one-off availability
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    is_available boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS on Availability table
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for Doctors
-- Doctors can only view and edit their own availability
CREATE POLICY "Doctors can manage their own availability" 
ON public.availability 
FOR ALL 
USING (
    doctor_id IN (
        SELECT id FROM public.doctors WHERE auth_id = auth.uid()
    )
);

-- Public can view availability to book appointments
CREATE POLICY "Public can view availability" 
ON public.availability 
FOR SELECT 
USING (is_available = true);

-- 5. RLS Policies for Appointments (Protected for Doctors)
-- Doctors can view and update appointments assigned to them
CREATE POLICY "Doctors can manage their own appointments" 
ON public.appointments 
FOR ALL 
USING (
    doctor_id IN (
        SELECT id FROM public.doctors WHERE auth_id = auth.uid()
    )
);

-- 6. RLS Policies for Doctors Table (Allow self-update)
CREATE POLICY "Doctors can update their own profile" 
ON public.doctors 
FOR UPDATE 
USING (auth_id = auth.uid());

-- 7. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_availability_doctor ON public.availability(doctor_id);
CREATE INDEX IF NOT EXISTS idx_availability_date ON public.availability(specific_date);
