-- 1. Upgrade the gallery table for structured content
ALTER TABLE public.gallery 
ADD COLUMN IF NOT EXISTS type text DEFAULT 'facility' CHECK (type IN ('facility', 'xray', 'news')),
ADD COLUMN IF NOT EXISTS title text,
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS alt_text text,
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- 2. Backfill existing data if any (mostly will be facility)
UPDATE public.gallery SET type = 'facility' WHERE type IS NULL;

-- 3. Ensure RLS is updated for the new structure
DROP POLICY IF EXISTS "Public can view gallery" ON public.gallery;
CREATE POLICY "Public can view active gallery items" ON public.gallery 
FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage gallery" ON public.gallery;
CREATE POLICY "Admins have full control over gallery" ON public.gallery
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.doctors 
        WHERE auth_id = auth.uid() 
        AND (role = 'admin' OR is_admin = true)
        AND status = 'active'
    )
);

-- 4. Enable RLS (just in case)
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- 5. Grant permissions
GRANT SELECT ON public.gallery TO anon, authenticated;
GRANT ALL ON public.gallery TO authenticated;
