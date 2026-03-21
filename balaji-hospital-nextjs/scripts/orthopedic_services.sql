-- ============================================================
-- Task 1: Create orthopedic_services table in Supabase
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard
-- ============================================================

-- Create the orthopedic_services table
CREATE TABLE IF NOT EXISTS public.orthopedic_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT,
  content TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  icon TEXT DEFAULT 'Activity',
  image_url TEXT,
  keywords JSONB DEFAULT '[]'::jsonb,
  meta_description TEXT,
  is_active BOOLEAN DEFAULT true,
  last_updated TIMESTAMPTZ DEFAULT now()
);

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_orthopedic_services_slug ON public.orthopedic_services(slug);
CREATE INDEX IF NOT EXISTS idx_orthopedic_services_active ON public.orthopedic_services(is_active);

-- Enable Row Level Security (RLS) - read-only for anon
ALTER TABLE public.orthopedic_services ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read" ON public.orthopedic_services
  FOR SELECT USING (true);

-- ============================================================
-- Task 2: Seed all 13 orthopedic services (upsert by slug)
-- ============================================================

INSERT INTO public.orthopedic_services (title, slug, summary, content, features, icon, image_url, keywords, meta_description, is_active)
VALUES
  (
    'Paediatric Orthopaedics',
    'paediatric-orthopaedics',
    'Children''s bones require specialised attention that differs fundamentally from adult orthopaedic care. At Balaji Hospital, we are a trusted centre for infants, children, and adolescents suffering from a wide range of musculoskeletal conditions.',
    'Children''s bones require specialised attention that differs fundamentally from adult orthopaedic care. Growing skeletons are more flexible, heal faster, but also face unique vulnerabilities — especially around growth plates that, if damaged, can affect long-term development.

At Balaji Hospital, we are a trusted centre for infants, children, and adolescents suffering from a wide range of musculoskeletal conditions. Our paediatric orthopaedic team combines medical expertise with a child-friendly, parent-centred approach to ensure effective, compassionate care throughout every stage of treatment and recovery.',
    '["Congenital Conditions — Clubfoot, DDH, limb length discrepancies, spinal deformities", "Fractures and Trauma Care with growth plate protection", "Deformity Correction — Bow legs, knock knees, flat feet", "Bone and Joint Infections (Osteomyelitis, Septic Arthritis)", "Sports Injuries in Children", "Child-Friendly and Parent-Centred Care approach"]'::jsonb,
    'Users',
    '/images/gallery/physiotherapy.png',
    '["paediatric orthopaedics jaipur", "children bone treatment", "clubfoot treatment jaipur", "DDH treatment"]'::jsonb,
    'Expert Paediatric Orthopaedics at Balaji Hospital Jaipur. Treating clubfoot, DDH, fractures, and growth plate injuries in children.',
    true
  ),
  (
    'Spine Treatment',
    'spine-treatment',
    'Advanced spinal care led by Dr. Ramesh Agarwal, MS (Ortho.), focused on the root cause of spinal pain, nerve compression, and deformities using both surgical and non-surgical approaches.',
    'Advanced spinal care led by Dr. Ramesh Agarwal, MS (Ortho.), focused on the root cause of spinal pain, nerve compression, and deformities. Our spine unit offers a comprehensive range of treatments spanning conservative management to complex minimally invasive surgical interventions.

We use state-of-the-art imaging and intraoperative navigation to ensure precise, safe outcomes. Our multidisciplinary approach combines the expertise of orthopaedic surgeons, neurologists, and physiotherapists to deliver complete spinal care under one roof.',
    '["Back and Neck Pain management and Posture Correction", "Slip Disc (Prolapsed Intervertebral Disc) and Disc Herniation", "Degenerative Spine Conditions — Cervical and Lumbar Spondylosis", "Sciatica and Nerve Compression syndromes", "Spinal Stenosis treatment", "Minimally Invasive Spine Surgery techniques", "Scoliosis and Spinal Deformity Correction"]'::jsonb,
    'Activity',
    '/images/gallery/ot.png',
    '["spine treatment jaipur", "back pain specialist jaipur", "slip disc treatment", "sciatica treatment jaipur"]'::jsonb,
    'Best Spine Treatment in Jaipur at Balaji Hospital. Expert care for back pain, slip disc, sciatica, and spinal deformities by Dr. Ramesh Agarwal.',
    true
  ),
  (
    'Fracture Treatment',
    'fracture-treatment',
    'Comprehensive bone fracture treatment for injuries from accidents, falls, and sports — from simple closed fractures to complex open fractures using modern fixation methods.',
    'Comprehensive bone fracture treatment for injuries from accidents, falls, and sports. Our trauma unit is equipped to handle everything from simple closed fractures to complex open fractures requiring surgical intervention, internal fixation, or external fixation devices.

Our team prioritises not just bone healing but complete functional recovery — restoring strength, alignment, and mobility through expert surgical technique combined with structured physiotherapy and rehabilitation.',
    '["Emergency Trauma Care for all fracture types", "Hairline and Stress Fractures treatment", "Complex and Comminuted Fracture management", "Open Fracture care with infection control", "Pathological Fractures (bone cancer, osteoporosis)", "Internal Fixation — plates, screws, intramedullary nails", "Post-fracture Rehabilitation and Physiotherapy"]'::jsonb,
    'Bone',
    '/images/gallery/ot.png',
    '["fracture treatment jaipur", "bone fracture specialist", "trauma surgery jaipur", "orthopaedic emergency jaipur"]'::jsonb,
    'Best Fracture Treatment in Jaipur at Balaji Hospital. Expert orthopaedic trauma care for all fracture types with modern fixation techniques.',
    true
  ),
  (
    'Hip Replacement',
    'hip-replacement',
    'Leading centre for hip arthroplasty, offering safe and affordable total, partial, and revision hip replacement surgery for chronic hip arthritis and degeneration.',
    'Balaji Hospital is a leading centre for hip arthroplasty in Jaipur, offering safe, affordable, and expert care for patients suffering from chronic hip arthritis, avascular necrosis, and severe joint degeneration. Led by Dr. Ramesh Agarwal with 25+ years of experience.

We use internationally certified prosthetic components and follow strict aseptic protocols to minimise complications. Our minimally invasive techniques reduce blood loss, accelerate recovery, and allow patients to return to an active, pain-free life faster.',
    '["Total Hip Replacement (THR) for advanced arthritis", "Partial Hip Replacement (Hemiarthroplasty) for femoral neck fractures", "Revision Hip Replacement for failed previous surgeries", "Minimally Invasive Techniques for faster recovery", "Internationally approved cemented and cementless prostheses", "Avascular Necrosis (AVN) of the hip management", "Comprehensive pre- and post-operative physiotherapy"]'::jsonb,
    'HeartPulse',
    '/images/gallery/ot.png',
    '["hip replacement jaipur", "total hip replacement", "hip arthroplasty jaipur", "avascular necrosis treatment"]'::jsonb,
    'Hip Replacement Hospital in Jaipur — Balaji Hospital offers total, partial, and revision hip replacement surgery by expert orthopaedic surgeons.',
    true
  ),
  (
    'Shoulder Arthroscopy',
    'shoulder-arthroscopy',
    'Minimally invasive arthroscopic procedures to diagnose and treat problems inside the shoulder joint using a small camera called an arthroscope.',
    'Shoulder arthroscopy is a minimally invasive surgical procedure that allows our orthopaedic surgeons to diagnose and treat a wide range of shoulder conditions using a small camera (arthroscope) inserted through tiny incisions. This eliminates the need for large open-surgery cuts and significantly reduces recovery time.

Our surgery team, led by Dr. Shitiz Agarwal, has extensive experience in arthroscopic shoulder procedures including rotator cuff repair, Bankart repair for recurrent dislocation, and frozen shoulder release.',
    '["Rotator Cuff Repair — partial and full thickness tears", "Shoulder Impingement Syndrome treatment", "Bankart Repair for recurring shoulder dislocation", "Frozen Shoulder (Adhesive Capsulitis) release", "SLAP (Superior Labrum Anterior to Posterior) repair", "Acromioclavicular (AC) joint injuries", "Shoulder Arthritis management"]'::jsonb,
    'Activity',
    '/images/gallery/ot.png',
    '["shoulder arthroscopy jaipur", "rotator cuff repair jaipur", "frozen shoulder treatment", "shoulder dislocation treatment"]'::jsonb,
    'Shoulder Arthroscopy in Jaipur — Expert minimally invasive shoulder surgery at Balaji Hospital. Rotator cuff repair, frozen shoulder, Bankart repair.',
    true
  ),
  (
    'Hand & Upper Limb Surgery',
    'hand-upper-limb',
    'Diagnostic, surgical, and rehabilitation services for conditions affecting the hand, wrist, elbow, and forearm — from carpal tunnel syndrome to complex nerve injuries.',
    'Our Hand & Upper Limb Surgery unit provides comprehensive diagnostic, surgical, and rehabilitation services for conditions affecting the hand, wrist, elbow, and forearm. From common conditions like carpal tunnel syndrome to complex trauma requiring microsurgical nerve or tendon repair.

The unit is equipped with a dedicated operation theatre for hand procedures and works in close collaboration with our physiotherapy department for structured post-operative rehabilitation.',
    '["Carpal Tunnel Syndrome release surgery", "Trigger Finger (Stenosing Tenosynovitis) treatment", "Tendon Repairs — flexor and extensor", "Tennis Elbow and Golfer''s Elbow treatment", "Elbow Fractures and Dislocations", "Nerve Injuries — Median, Ulnar, Radial nerve repair", "Congenital Hand Deformities correction"]'::jsonb,
    'Stethoscope',
    '/images/gallery/general-ward.png',
    '["hand surgery jaipur", "carpal tunnel treatment jaipur", "trigger finger treatment", "upper limb surgery jaipur"]'::jsonb,
    'Hand & Upper Limb Surgery in Jaipur at Balaji Hospital. Expert treatment for carpal tunnel, trigger finger, tendon injuries, and nerve repairs.',
    true
  ),
  (
    'Ankle Replacement',
    'ankle-replacement',
    'Reliable surgical solution for severe ankle arthritis, deformity, or long-standing injuries — preserving motion and improving quality of life.',
    'Ankle replacement (total ankle arthroplasty) is a reliable surgical solution for patients suffering from severe ankle arthritis. Unlike fusion surgery, ankle replacement preserves motion in the joint, leading to a more natural gait and improved quality of life.

At Balaji Hospital, our orthopaedic team carefully evaluates each patient to determine the most appropriate treatment — from conservative management to total ankle arthroplasty — using internationally certified implants.',
    '["Total Ankle Arthroplasty (Ankle Replacement Surgery)", "Osteoarthritis and Rheumatoid Arthritis of the ankle", "Post-traumatic Arthritis management", "Preservation of nearby joints and improved range of motion", "Minimally invasive surgical approach where applicable", "Comprehensive post-operative ankle rehabilitation", "Gait retraining and functional recovery"]'::jsonb,
    'Activity',
    '/images/gallery/physiotherapy.png',
    '["ankle replacement jaipur", "ankle arthritis treatment", "total ankle arthroplasty jaipur", "ankle fusion surgery"]'::jsonb,
    'Ankle Replacement in Jaipur at Balaji Hospital. Expert total ankle arthroplasty for arthritis and post-traumatic ankle conditions.',
    true
  ),
  (
    'Joint Pain Treatment',
    'joint-pain-treatment',
    'Personalised treatment plans ranging from non-surgical therapy and joint injections to advanced joint replacement surgery to relieve pain and restore mobility.',
    'Joint pain is one of the most debilitating conditions affecting quality of life. At Balaji Hospital, we offer personalised treatment plans tailored to each patient''s condition, age, and lifestyle goals — ranging from conservative non-surgical options to advanced joint replacement when necessary.

Our experienced orthopaedic team performs a thorough assessment including clinical evaluation and imaging before recommending the most appropriate course of treatment.',
    '["Intra-articular Joint Injections (Corticosteroid, Hyaluronic acid)", "PRP (Platelet-Rich Plasma) Therapy", "Bracing and Orthotics", "Non-surgical physiotherapy and specialised medications", "Lifestyle modification and weight management guidance", "Rehabilitation programs for pain relief and mobility", "Arthroscopic joint debridement for early-stage disease"]'::jsonb,
    'HeartPulse',
    '/images/gallery/physiotherapy.png',
    '["joint pain treatment jaipur", "knee joint pain", "PRP therapy jaipur", "joint injection jaipur"]'::jsonb,
    'Joint Pain Treatment in Jaipur at Balaji Hospital. Expert orthopaedic care from injections and physiotherapy to joint replacement surgery.',
    true
  ),
  (
    'Sports Medicine',
    'sports-medicine',
    'Prevention, diagnosis, and rehabilitation for injuries sustained in sports and physical activities — helping athletes return to peak performance.',
    'Sports medicine at Balaji Hospital focuses on the prevention, diagnosis, treatment, and rehabilitation of injuries sustained during sports and physical activity. Our sports medicine team, led by Dr. Shitiz Agarwal — Fellowship in Arthroscopy & Sports Medicine — provides cutting-edge care.

We combine advanced arthroscopic surgery, targeted physiotherapy, and evidence-based rehabilitation protocols to help athletes not just recover but perform better than before injury.',
    '["ACL (Anterior Cruciate Ligament) Reconstruction", "MCL and PCL Ligament Repairs", "Meniscus Repair and Partial Meniscectomy", "Knee and Shoulder Arthroscopy for sports injuries", "Structured return-to-sport rehabilitation protocols", "Injury prevention assessment and biomechanics analysis", "Management of sports-related stress fractures"]'::jsonb,
    'Activity',
    '/images/gallery/ot.png',
    '["sports medicine jaipur", "ACL reconstruction jaipur", "sports injury treatment", "knee arthroscopy jaipur"]'::jsonb,
    'Sports Medicine Hospital in Jaipur — Expert ACL reconstruction, meniscus repair, and sports injury rehabilitation at Balaji Hospital.',
    true
  ),
  (
    'Physiotherapy & Rehabilitation',
    'physiotherapy',
    'Evidence-based physiotherapy and rehabilitation guided by Dr. Sheela Agarwal, focusing on post-surgical recovery, chronic pain management, and restoring full functional mobility.',
    'Our Physiotherapy & Rehabilitation Centre is a fully equipped, dedicated unit led by Dr. Sheela Agarwal, with over 20 years of experience in musculoskeletal and neurological rehabilitation.

Our holistic approach combines manual therapy, therapeutic exercise, modern electrotherapy equipment, and patient education to achieve maximum functional recovery in the shortest time.',
    '["Post-Operative Orthopaedic Rehabilitation (knee, hip, spine)", "Therapeutic exercises for strength and coordination", "Pain management and inflammation reduction", "Balance restoration and proprioception training", "Sports Injury Rehabilitation", "Neurological Rehabilitation", "Modern physiotherapy equipment — ultrasound, IFT, TENS, wax bath"]'::jsonb,
    'HeartPulse',
    '/images/gallery/physiotherapy.png',
    '["physiotherapy jaipur", "rehabilitation centre jaipur", "post surgery physiotherapy", "sports rehabilitation jaipur"]'::jsonb,
    'Physiotherapy & Rehabilitation Centre in Jaipur at Balaji Hospital. Expert rehab by Dr. Sheela Agarwal for post-surgical and chronic pain patients.',
    true
  ),
  (
    'Knee Replacement',
    'knee-replacement',
    'Jaipur''s leading knee replacement centre, offering total and partial knee arthroplasty led by Dr. Ramesh Agarwal using computer-assisted and minimally invasive techniques.',
    'Knee replacement (total knee arthroplasty) is a proven surgical solution for patients with advanced arthritis, severe joint damage, or debilitating knee pain. Balaji Hospital is one of Jaipur''s most trusted knee replacement centres, with over 50,000 surgical procedures performed since 1996.

Led by Dr. Ramesh Agarwal — MS (Orthopaedics), Gold Medalist — our team uses the latest computer-assisted surgical planning and minimally invasive techniques combined with an intensive post-operative rehabilitation program.',
    '["Total Knee Replacement (TKR) for end-stage arthritis", "Partial (Unicompartmental) Knee Replacement", "Revision Knee Replacement for failed prostheses", "Computer-Assisted Surgical Planning", "Minimally Invasive Techniques", "Oxford Knee and internationally certified implants", "Comprehensive pre- and post-surgery rehabilitation"]'::jsonb,
    'Stethoscope',
    '/images/gallery/ot.png',
    '["knee replacement jaipur", "total knee replacement", "best knee replacement hospital jaipur", "knee arthroplasty"]'::jsonb,
    'Best Knee Replacement Hospital in Jaipur — Balaji Hospital offers total and partial knee replacement surgery by Dr. Ramesh Agarwal.',
    true
  ),
  (
    'General Orthopaedics',
    'general-orthopaedics',
    'Comprehensive diagnosis and treatment of all bones, joints, muscles, ligaments, and tendons — covering the full spectrum of musculoskeletal conditions.',
    'Balaji Hospital offers comprehensive general orthopaedic care covering all conditions affecting the bones, joints, muscles, ligaments, and tendons. Our team of expert specialists provides accurate diagnosis using advanced imaging — X-ray, MRI, and CT scan — followed by personalised treatment plans.

From common conditions like osteoporosis and tendinitis to complex reconstructive procedures, we are equipped to handle the full spectrum of musculoskeletal conditions for patients of all ages.',
    '["Complete musculoskeletal system diagnosis", "Advanced imaging — X-ray, MRI, CT scan", "Osteoporosis management and bone density screening", "Conservative treatment — medication, injections, physiotherapy", "Specialised surgical interventions for chronic bone conditions", "Tendon and ligament injuries", "Bone tumours and cysts evaluation"]'::jsonb,
    'Stethoscope',
    '/images/gallery/ot2.png',
    '["best orthopaedic hospital jaipur", "bone specialist jaipur", "joint specialist jaipur", "orthopaedic consultation"]'::jsonb,
    'Best Orthopaedic Hospital in Jaipur — Balaji Hospital offers comprehensive care for all bone, joint, and muscle conditions since 1996.',
    true
  ),
  (
    'Plastic & Vascular Surgery',
    'plastic-vascular-surgery',
    'Reconstructive and vascular care led by Dr. Alok Maheshwari — restoring function and appearance through advanced plastic, reconstructive, and vascular surgical techniques.',
    'Plastic and Vascular Surgery at Balaji Hospital is led by Dr. Alok Maheshwari, MS (ENT & Head-Neck Surgery) with additional training in Plastic & Reconstructive Surgery. The department handles a wide spectrum of reconstructive and vascular cases.

We provide complete care from initial assessment through surgery and post-operative rehabilitation, with a focus on achieving the best possible functional and cosmetic outcomes.',
    '["Reconstructive Surgery for trauma, burns, and tumours", "Correction of Congenital Abnormalities", "Vascular Surgery for chronic wounds and diseases", "Skin Grafting and Flap Surgery", "Varicose Vein treatment", "Diabetic Foot wound care", "Advanced wound dressing and care protocols"]'::jsonb,
    'HeartPulse',
    '/images/gallery/general-ward.png',
    '["plastic surgery jaipur", "vascular surgery jaipur", "reconstructive surgery jaipur", "wound care jaipur"]'::jsonb,
    'Plastic & Vascular Surgery in Jaipur at Balaji Hospital. Led by Dr. Alok Maheshwari — expert reconstructive and vascular surgical care.',
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  features = EXCLUDED.features,
  icon = EXCLUDED.icon,
  image_url = EXCLUDED.image_url,
  keywords = EXCLUDED.keywords,
  meta_description = EXCLUDED.meta_description,
  last_updated = now();
