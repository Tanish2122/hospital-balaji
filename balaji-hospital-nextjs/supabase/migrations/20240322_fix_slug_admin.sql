-- 1. Ensure auth_id is UNIQUE (if not already done)
ALTER TABLE public.doctors ADD CONSTRAINT doctors_auth_id_key UNIQUE (auth_id);

-- 2. Insert or Update your admin profile with the required SLUG
INSERT INTO public.doctors (name, email, auth_id, role, is_admin, status, slug)
SELECT 
  'Tanish Bansal', 
  'bansaltanish12@gmail.com', 
  id, 
  'admin', 
  true, 
  'active',
  'tanish-bansal' -- Added required unique slug
FROM auth.users 
WHERE email = 'bansaltanish12@gmail.com'
ON CONFLICT (auth_id) DO UPDATE 
SET role = 'admin', is_admin = true, status = 'active', slug = 'tanish-bansal';
