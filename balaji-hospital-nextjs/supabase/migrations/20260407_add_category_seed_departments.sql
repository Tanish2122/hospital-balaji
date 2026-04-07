-- ================================================================
-- Migration: Add category + image columns and seed correct departments
-- Run this in Supabase SQL Editor
-- ================================================================

-- 1. Add missing columns (safe — IF NOT EXISTS)
ALTER TABLE public.departments
  ADD COLUMN IF NOT EXISTS category text DEFAULT 'orthopedic',
  ADD COLUMN IF NOT EXISTS image text;

-- 2. Wipe legacy/incorrect department rows so we can seed fresh
--    (keeps any rows NOT in this slug list untouched)
DELETE FROM public.departments
WHERE slug IN (
  'ent','ent-surgery','gastroenterology','general-medicine',
  'gynecology','laparoscopy','neurology','cardiology','dermatology',
  'ophthalmology','dentistry','general-surgery','urology','radiology',
  'pathology','physiotherapy-dept','orthopaedics-dept'
);

-- 3. Upsert all canonical departments from local data files
--    Each row: slug (unique key), name, description, category, is_active

INSERT INTO public.departments (name, slug, description, category, is_active) VALUES

-- ─── ORTHOPEDIC ──────────────────────────────────────────────
('Knee Replacement',
 'knee-replacement',
 'Balaji Hospital is one of Jaipur''s most trusted knee replacement centres, with over 50,000 surgical procedures performed since 1996. Specialising in Total, Partial, and Revision Knee Replacement.',
 'orthopedic', true),

('Hip Replacement',
 'hip-replacement',
 'Leading centre for hip arthroplasty in Jaipur, offering safe and affordable Total, Partial, and Revision hip replacement surgery for arthritis and AVN.',
 'orthopedic', true),

('Spine Treatment',
 'spine-treatment',
 'Complete spine care at Balaji Hospital Jaipur. Expert diagnosis and treatment for back pain, slip disc, sciatica, and spinal deformities.',
 'orthopedic', true),

('Sports Medicine',
 'sports-medicine',
 'Leading sports medicine care for competitive athletes and active individuals, specialising in ligament reconstruction, ACL repair, and arthroscopy.',
 'orthopedic', true),

('Fracture Treatment',
 'fracture-treatment',
 '24/7 Trauma and Fracture care at Balaji Hospital Jaipur. Expert management for simple and complex bone injuries with emergency trauma services.',
 'orthopedic', true),

('Shoulder Arthroscopy',
 'shoulder-arthroscopy',
 'Minimally invasive shoulder surgery for rotator cuff tears, frozen shoulder, and instability, ensuring faster recovery.',
 'orthopedic', true),

('Paediatric Orthopaedics',
 'paediatric-orthopaedics',
 'Children''s bone and joint care: clubfoot, DDH, fractures, deformity correction, and growth plate injuries treated with compassion.',
 'orthopedic', true),

('Hand & Upper Limb Surgery',
 'hand-upper-limb',
 'Comprehensive diagnostic, surgical, and rehabilitation services for conditions affecting the hand, wrist, elbow, and forearm.',
 'orthopedic', true),

('Ankle Replacement',
 'ankle-replacement',
 'Reliable surgical solution for severe ankle arthritis and post-traumatic ankle conditions using internationally certified implants.',
 'orthopedic', true),

('Joint Pain Treatment',
 'joint-pain-treatment',
 'Personalised treatment plans ranging from non-surgical therapy and PRP injections to advanced joint replacement surgery.',
 'orthopedic', true),

('Physiotherapy & Rehabilitation',
 'physiotherapy',
 'Evidence-based physiotherapy and rehabilitation focusing on post-surgical recovery, chronic pain management, and sports injury rehab.',
 'orthopedic', true),

('General Orthopaedics',
 'general-orthopaedics',
 'Comprehensive diagnosis and treatment of all bones, joints, muscles, ligaments, and tendons by expert orthopaedic surgeons.',
 'orthopedic', true),

('Plastic & Vascular Surgery',
 'plastic-vascular-surgery',
 'Comprehensive plastic and vascular surgery: wound reconstruction, skin grafts, varicose vein treatment, and diabetic foot care.',
 'orthopedic', true),

-- ─── ENT ─────────────────────────────────────────────────────
('Ear Surgery',
 'ear-surgery',
 'Microscopic and endoscopic ear surgeries for hearing restoration and chronic ear infections. Expert ENT care by Dr. Saloni Agarwal.',
 'ent', true),

('Nose Surgery',
 'nose-surgery',
 'Functional and cosmetic nasal surgeries including FESS, septoplasty, and treatment for chronic sinusitis and nasal polyps.',
 'ent', true),

('Throat Surgery',
 'throat-surgery',
 'Specialised care for voice disorders, recurrent tonsillitis, sleep apnea, and upper airway conditions in adults and children.',
 'ent', true),

-- ─── SPECIALITY ──────────────────────────────────────────────
('Kidney Stones Treatment',
 'kidney-stones',
 'Modern laser lithotripsy and non-invasive ESWL for effective removal of kidney and urinary stones. Painless, quick recovery.',
 'speciality', true)

ON CONFLICT (slug) DO UPDATE SET
  name        = EXCLUDED.name,
  description = EXCLUDED.description,
  category    = EXCLUDED.category,
  is_active   = EXCLUDED.is_active;

-- 4. Verify — should show 17 rows grouped by category
SELECT category, count(*) AS total
FROM public.departments
GROUP BY category
ORDER BY category;
