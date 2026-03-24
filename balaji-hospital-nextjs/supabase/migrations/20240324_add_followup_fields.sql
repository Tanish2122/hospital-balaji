-- Add follow-up fields to appointments table
DO $$ 
BEGIN 
    -- Check if column exists before adding
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'appointment_type') THEN
        ALTER TABLE public.appointments ADD COLUMN appointment_type TEXT DEFAULT 'new';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'previous_visit_date') THEN
        ALTER TABLE public.appointments ADD COLUMN previous_visit_date DATE;
    END IF;
END $$;
