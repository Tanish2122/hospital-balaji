-- 1. Add missing columns to patient_profiles table
ALTER TABLE public.patient_profiles 
ADD COLUMN IF NOT EXISTS last_appointment_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS appointment_count integer DEFAULT 0;

-- 2. Synchronize the existing 'total_appointments' with the new 'appointment_count' column if needed
UPDATE public.patient_profiles SET appointment_count = total_appointments WHERE appointment_count = 0;

-- 3. Fix the trigger function to use the correct columns and patient name from appointments
CREATE OR REPLACE FUNCTION public.handle_new_appointment_patient()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.patient_profiles (phone, name, email, last_appointment_date, appointment_count)
  VALUES (NEW.phone, NEW.patient_name, NEW.email, NEW.appointment_date, 1)
  ON CONFLICT (phone) DO UPDATE SET
    last_appointment_date = EXCLUDED.last_appointment_date,
    appointment_count = public.patient_profiles.appointment_count + 1,
    name = COALESCE(EXCLUDED.name, public.patient_profiles.name),
    email = COALESCE(EXCLUDED.email, public.patient_profiles.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
