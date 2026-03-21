-- Balaji Hospital - Schema Fix Migration
-- Run this in the Supabase SQL Editor to fix the PGRST204 error

-- 1. Add missing columns to emergencies table
ALTER TABLE public.emergencies 
ADD COLUMN IF NOT EXISTS emergency_id_str text;

-- 2. Add missing columns to appointments table
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS appointment_id_str text,
ADD COLUMN IF NOT EXISTS doctor_name text,
ADD COLUMN IF NOT EXISTS department text;

-- 3. Update status constraints to be case-insensitive
-- (The API sends 'PENDING' and 'CONFIRMED' but the current constraints expect lowercase)

-- Update emergencies status constraint
ALTER TABLE public.emergencies 
DROP CONSTRAINT IF EXISTS emergencies_status_check;

ALTER TABLE public.emergencies 
ADD CONSTRAINT emergencies_status_check 
CHECK (lower(status) IN ('pending', 'contacted', 'resolved'));

-- Update appointments status constraint
ALTER TABLE public.appointments 
DROP CONSTRAINT IF EXISTS appointments_status_check;

ALTER TABLE public.appointments 
ADD CONSTRAINT appointments_status_check 
CHECK (lower(status) IN ('pending', 'confirmed', 'cancelled', 'completed'));

-- 4. Enable RLS Update (Optional but good practice)
-- Ensure columns are accessible if you have specific field-level policies
-- (Standard policies already allow access since we use 'ALL' or 'SELECT/INSERT' on table)
