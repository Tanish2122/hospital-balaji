-- Balaji Hospital - RLS Fix Migration
-- Run this in the Supabase SQL Editor to fix the 42501 RLS Violation error

-- 1. Ensure RLS is enabled on both tables
ALTER TABLE public.emergencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can insert emergencies" ON public.emergencies;
DROP POLICY IF EXISTS "Anyone can insert appointments" ON public.appointments;

-- 3. Create public insert policies
-- This allows the 'anon' role used by the frontend to submit the forms
CREATE POLICY "Anyone can insert emergencies" 
ON public.emergencies FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can insert appointments" 
ON public.appointments FOR INSERT 
WITH CHECK (true);

-- Note: We have removed .select() from the API code, 
-- so no SELECT policies are required for these tables for the public.
