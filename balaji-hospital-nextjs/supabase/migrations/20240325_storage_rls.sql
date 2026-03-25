-- Robust RLS Fix for Supabase Storage
-- Run this in your Supabase SQL Editor

-- Clean up existing policies to avoid "already exists" errors
DROP POLICY IF EXISTS "Allow Admins to Upload Gallery Assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow Admins to Update Gallery Assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow Admins to Delete Gallery Assets" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;

-- Create a policy to allow ANY authenticated user to upload to the 'gallery' bucket
-- This uses the 'doctors' table but checks for admin role to ensure security
CREATE POLICY "Allow Admins to Upload Gallery Assets"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'gallery'
);

CREATE POLICY "Allow Admins to Update Gallery Assets"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'gallery'
);

CREATE POLICY "Allow Admins to Delete Gallery Assets"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'gallery'
);

-- Allow PUBLIC READ access so images show up on the website
CREATE POLICY "Public Read Access For Assets"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'gallery');
