-- Ensure alt_text is nullable to prevent insert errors
ALTER TABLE public.gallery ALTER COLUMN alt_text DROP NOT NULL;

-- Also ensure description and title are nullable if they somehow got set to NOT NULL
ALTER TABLE public.gallery ALTER COLUMN description DROP NOT NULL;
ALTER TABLE public.gallery ALTER COLUMN title DROP NOT NULL;

-- Add a default for category if missing
ALTER TABLE public.gallery ALTER COLUMN category SET DEFAULT 'General';
