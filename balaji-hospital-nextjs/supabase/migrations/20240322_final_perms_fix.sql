-- 1. Ensure the authenticated role has permissions to read the table
GRANT SELECT, UPDATE ON public.doctors TO authenticated;
GRANT SELECT ON public.doctors TO anon;

-- 2. Ensure RLS is actually allowing the check
DROP POLICY IF EXISTS "Doctors can see and update their own profile" ON public.doctors;
CREATE POLICY "Allow individual profile access" ON public.doctors 
FOR SELECT USING (auth_id = auth.uid());
