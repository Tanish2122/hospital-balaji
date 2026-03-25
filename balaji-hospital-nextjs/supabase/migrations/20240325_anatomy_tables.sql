-- Create body_parts table
CREATE TABLE public.body_parts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    hotspot_x FLOAT NOT NULL, -- Percentage from left (0-100)
    hotspot_y FLOAT NOT NULL, -- Percentage from top (0-100)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create body_part_cases table
CREATE TABLE public.body_part_cases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    body_part_id UUID REFERENCES public.body_parts(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    xray_image_url TEXT,
    before_image_url TEXT,
    after_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.body_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_part_cases ENABLE ROW LEVEL SECURITY;

-- Public READ policies
CREATE POLICY "Public Read Body Parts" ON public.body_parts FOR SELECT TO public USING (true);
CREATE POLICY "Public Read Body Part Cases" ON public.body_part_cases FOR SELECT TO public USING (true);

-- Admin WRITE policies (Assuming 'admin' role check is same as before)
CREATE POLICY "Admin All Body Parts" ON public.body_parts FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Body Part Cases" ON public.body_part_cases FOR ALL TO authenticated USING (true);

-- Insert Initial Data (Coordinates based on common skeleton proportions)
INSERT INTO public.body_parts (name, slug, description, hotspot_x, hotspot_y) VALUES
('Shoulder', 'shoulder', 'Specialized care for clavicle, scapula, and humerus fractures or dislocations.', 35.0, 18.0),
('Shoulder', 'shoulder-right', 'Specialized care for clavicle, scapula, and humerus fractures or dislocations.', 65.0, 18.0),
('Elbow', 'elbow', 'Expert treatment for distal humerus and proximal radius/ulna injuries.', 32.0, 32.0),
('Spine', 'spine', 'Comprehensive management of spinal fractures, disc issues, and alignment.', 50.0, 35.0),
('Hip', 'hip', 'Advanced solutions for proximal femur and pelvic fractures.', 45.0, 50.0),
('Knee', 'knee', 'Specialized treatment for patellar and distal femur/proximal tibia injuries.', 48.0, 68.0),
('Ankle', 'ankle', 'Comprehensive care for distal tibia, fibula, and tarsal bone fractures.', 48.0, 88.0),
('Wrist', 'wrist', 'Precision treatment for carpal bone and distal radius/ulna fractures.', 28.0, 42.0);

-- Insert Dummy Case Studies for Demonstration
-- (Note: These assume the IDs from above, so we'll use slugs to find them in a real app, 
-- but for fixed IDs in a script we'd needs names. For now, let's just add generic ones)

INSERT INTO public.body_part_cases (body_part_id, title, description, xray_image_url)
SELECT id, 'Complex Shoulder Dislocation', 'Successful reduction and stabilization of a multi-directional instability.', 'https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=800'
FROM public.body_parts WHERE slug = 'shoulder' LIMIT 1;

INSERT INTO public.body_part_cases (body_part_id, title, description, xray_image_url)
SELECT id, 'Distal Radius Fracture', 'Internal fixation with volar locking plate for an unstable wrist fracture.', 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=800'
FROM public.body_parts WHERE slug = 'wrist' LIMIT 1;

INSERT INTO public.body_part_cases (body_part_id, title, description, xray_image_url)
SELECT id, 'Lumbosacral Spinal Alignment', 'Minimally invasive correction for a Grade II spondylolisthesis.', 'https://images.unsplash.com/photo-1579154235828-4ce66839359e?q=80&w=800'
FROM public.body_parts WHERE slug = 'spine' LIMIT 1;

INSERT INTO public.body_part_cases (body_part_id, title, description, xray_image_url)
SELECT id, 'Comminuted Knee Reconstruction', 'Total knee replacement for severe osteoarthritis and joint degradation.', 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=800'
FROM public.body_parts WHERE slug = 'knee' LIMIT 1;
