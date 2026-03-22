-- 1. Ensure doctors can see their own profile (essential for login verification)
-- This avoids the recursive check in the Admin policy.
DROP POLICY IF EXISTS "Active doctors can manage their own profile" ON public.doctors;
CREATE POLICY "Doctors can see and update their own profile" ON public.doctors
FOR ALL USING (auth_id = auth.uid());

-- 2. Ensure Admins can manage everything else
DROP POLICY IF EXISTS "Admins have full control over doctors" ON public.doctors;
CREATE POLICY "Admins have full control over all doctor profiles" ON public.doctors
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.doctors 
        WHERE auth_id = auth.uid() 
        AND (role = 'admin' OR is_admin = true) 
        AND status = 'active'
    )
);
