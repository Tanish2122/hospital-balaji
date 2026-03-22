-- Allow public to create and update their profiles via the appointment trigger
-- This is necessary to fix the "new row violates row-level security policy" error during booking.

DROP POLICY IF EXISTS "Public can create profiles via booking" ON public.patient_profiles;
CREATE POLICY "Public can create profiles via booking" 
ON public.patient_profiles 
FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update profiles via booking" ON public.patient_profiles;
CREATE POLICY "Public can update profiles via booking" 
ON public.patient_profiles 
FOR UPDATE 
USING (true);

-- Ensure anon role has permissions
GRANT INSERT, UPDATE ON public.patient_profiles TO anon;
GRANT ALL ON public.patient_profiles TO authenticated;
