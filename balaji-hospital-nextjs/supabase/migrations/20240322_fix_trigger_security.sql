-- Update the trigger function to run with OWNER privileges (SECURITY DEFINER)
-- This allows it to bypass RLS and work for public (anon) users booking appointments.

CREATE OR REPLACE FUNCTION public.handle_new_appointment_patient()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.patient_profiles (phone, name, email, last_appointment_date, appointment_count)
  VALUES (NEW.phone, NEW.name, NEW.email, NEW.appointment_date, 1)
  ON CONFLICT (phone) DO UPDATE SET
    last_appointment_date = NEW.appointment_date,
    appointment_count = public.patient_profiles.appointment_count + 1,
    name = COALESCE(EXCLUDED.name, public.patient_profiles.name),
    email = COALESCE(EXCLUDED.email, public.patient_profiles.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Also ensure basic permissions just in case
GRANT SELECT, INSERT, UPDATE ON public.patient_profiles TO anon, authenticated;
