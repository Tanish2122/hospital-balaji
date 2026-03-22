-- Match blogs table to the frontend expectations
ALTER TABLE public.blogs 
ADD COLUMN IF NOT EXISTS slug text UNIQUE,
ADD COLUMN IF NOT EXISTS author text DEFAULT 'Balaji Hospital',
ADD COLUMN IF NOT EXISTS category text DEFAULT 'General',
ADD COLUMN IF NOT EXISTS image text,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'published';

-- Ensure slugs are backfilled for existing posts
UPDATE public.blogs 
SET slug = lower(replace(title, ' ', '-')) 
WHERE slug IS NULL;

-- Also check testimonials table (common missing columns)
ALTER TABLE public.testimonials 
ADD COLUMN IF NOT EXISTS image text,
ADD COLUMN IF NOT EXISTS designation text,
ADD COLUMN IF NOT EXISTS rating integer DEFAULT 5;
