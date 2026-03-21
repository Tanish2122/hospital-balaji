-- Add appointment_no column to appointments table
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS appointment_no INTEGER;

-- Optional index for faster counting
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date ON public.appointments (doctor_id, appointment_date);
