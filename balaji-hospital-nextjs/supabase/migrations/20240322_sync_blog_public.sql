-- Synchronize blogs table with public page requirements
ALTER TABLE public.blogs 
ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS published_at timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS featured_image_url text,
ADD COLUMN IF NOT EXISTS excerpt text;

-- Sync existing data
UPDATE public.blogs 
SET featured_image_url = image 
WHERE featured_image_url IS NULL AND image IS NOT NULL;

UPDATE public.blogs 
SET is_published = true 
WHERE is_published IS NULL;

UPDATE public.blogs 
SET published_at = created_at 
WHERE published_at IS NULL;
