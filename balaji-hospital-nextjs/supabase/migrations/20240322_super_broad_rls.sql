-- 1. TEMPORARILY disable RLS restrictions for SELECT on doctors table
-- This is safe as doctors are usually public information on a hospital site.
DROP POLICY IF EXISTS "Allow individual profile access" ON public.doctors;
DROP POLICY IF EXISTS "Active doctors manage their own profile" ON public.doctors;
DROP POLICY IF EXISTS "Public can view gallery" ON public.gallery; -- Example of other public read

-- Create a global read policy for the doctors table
CREATE POLICY "All can see doctors" ON public.doctors FOR SELECT USING (true);

-- 2. Ensure permissions are set for all roles
GRANT SELECT ON public.doctors TO anon, authenticated;
