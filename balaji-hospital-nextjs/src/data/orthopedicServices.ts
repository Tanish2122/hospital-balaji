export interface OrthopedicService {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  features: string[];
  icon: string;
  image: string;
  keywords: string[];
  metaDescription: string;
}

export const orthopedicServices: OrthopedicService[] = [
  {
    id: "knee-replacement",
    slug: "knee-replacement",
    title: "Knee Replacement",
    summary:
      "Balaji Hospital is one of Jaipur's most trusted knee replacement centres, with over 50,000 surgical procedures performed since 1996.",
    content:
      "As the best knee replacement hospital in Jaipur, Balaji Hospital provides expert care for chronic knee pain led by Dr. Ramesh Agarwal, a senior orthopaedic consultant with over 25 years of experience. We specialize in Total Knee Replacement (TKR), Partial (Unicompartmental) Knee Replacement, and complex Revision Knee Replacement surgery.\n\n### Why Choose Balaji for Knee Replacement?\nOur department uses computer-assisted surgical planning and minimally invasive techniques to ensure the highest precision and safety. We utilize internationally certified implants (such as Oxford Knee) designed for maximum longevity and natural joint motion.\n\n### Who Needs Knee Replacement?\n- Severe knee pain that affects daily activities like walking or climbing stairs.\n- Chronic stiffness and swelling that does not improve with rest.\n- Poor response to non-surgical treatments like medications or physiotherapy.\n- Progressive knee deformity (bowed legs).\n\n### Rehabilitation & Recovery\nPost-operative care is critical. Our dedicated physiotherapy centre provides custom rehabilitation plans to ensure faster recovery, improved flexibility, and long-term joint health.",
    features: [
      "Total Knee Replacement (TKR) for end-stage arthritis",
      "Partial (Unicompartmental) Knee Replacement",
      "Revision Knee Replacement for failed prostheses",
      "Computer-Assisted Surgical Planning",
      "Minimally Invasive Techniques",
      "Internationally certified implants (Oxford Knee)",
      "Comprehensive pre- and post-surgery rehabilitation",
    ],
    icon: "Stethoscope",
    image: "/images/gallery/ot.png",
    keywords: ["knee replacement jaipur", "best knee replacement doctor jaipur", "total knee replacement jaipur", "knee arthroplasty jaipur"],
    metaDescription:
      "Best Knee Replacement Hospital in Jaipur: Balaji Hospital offers expert total and partial knee replacement by Dr. Ramesh Agarwal. Call +91 7276229049.",
  },
  {
    id: "hip-replacement",
    slug: "hip-replacement",
    title: "Hip Replacement",
    summary:
      "Leading centre for hip arthroplasty in Jaipur, offering safe and affordable total, partial, and revision hip replacement surgery.",
    content:
      "Balaji Hospital is recognized as a leading hip replacement hospital in Jaipur. Led by Dr. Ramesh Agarwal, our team offers specialized care for patients suffering from chronic hip arthritis, avascular necrosis (AVN), and severe joint degeneration.\n\n### Advanced Surgical Techniques\nWe utilize advanced, minimally invasive techniques that reduce blood loss, accelerate recovery times, and allow for smaller incisions. Our multidisciplinary approach ensures each patient receives a unique surgical plan tailored to their anatomy and lifestyle.\n\n### Symptoms That May Require Hip Replacement:\n- Chronic groin or hip pain that worsens with activity.\n- Difficulty walking or putting on shoes/socks.\n- Hip stiffness that limits the range of motion.\n\n### The Surgical Process at Balaji Hospital:\n1. **Pre-surgery Evaluation:** Comprehensive X-rays and medical screening.\n2. **Surgical Procedure:** Using high-quality, internationally approved prosthetic components.\n3. **Post-operative Care:** Immediate mobilization supported by our rehabilitation team.",
    features: [
      "Total Hip Replacement (THR) for advanced arthritis",
      "Partial Hip Replacement (Hemiarthroplasty)",
      "Revision Hip Replacement for failed previous surgeries",
      "Avascular Necrosis (AVN) of the hip management",
      "Minimally Invasive Techniques for faster recovery",
      "Internationally approved cemented and cementless prostheses",
      "Comprehensive pre- and post-operative physiotherapy",
    ],
    icon: "HeartPulse",
    image: "/images/gallery/ot.png",
    keywords: ["hip replacement jaipur", "best hip replacement doctor jaipur", "total hip replacement hospital", "hip arthroplasty jaipur"],
    metaDescription:
      "Leading Hip Replacement Hospital in Jaipur. Expert surgeons specializing in Total, Partial, and Revision Hip Replacement for AVN and Arthritis.",
  },
  {
    id: "spine-treatment",
    slug: "spine-treatment",
    title: "Spine Treatment",
    summary:
      "Complete spine care at Balaji Hospital Jaipur. Expert diagnosis and treatment for back pain, disc issues, and spinal conditions.",
    content:
      "At Balaji Hospital, we offer the most comprehensive spine treatment in Jaipur. Our spine unit, led by senior consultant Dr. Ramesh Agarwal, focuses on treating the root cause of spinal pain, nerve compression, and deformities using both conservative and advanced surgical approaches.\n\n### Conditions We Treat:\n- **Slip Disc & Disc Herniation (PIVD):** Advanced treatment for compression of spinal nerves.\n- **Degenerative Spine Conditions:** Expert care for Cervical and Lumbar Spondylosis.\n- **Sciatica:** Targeted relief for radiating leg pain and nerve compression.\n- **Spinal Stenosis:** Decompression surgery and management for narrowed spinal canal.\n- **Spinal Infections & Scoliosis:** specialized care for complex spinal deformities.\n\n### Our Patient-First Approach\nWe believe in \"conservative management first.\" Surgery is only recommended when absolutely necessary. Our multidisciplinary team includes orthopedic surgeons, neurologists, and specialized physiotherapists to provide complete care under one roof.",
    features: [
      "Slip Disc & Disc Herniation (PIVD) and Disc Herniation",
      "Degenerative Spine Conditions — Cervical and Lumbar Spondylosis",
      "Sciatica and Nerve Compression syndromes",
      "Minimally Invasive Spine Surgery techniques",
      "Scoliosis and Spinal Deformity Correction",
      "Posture Correction & Lifestyle Guidance",
      "Back and Neck Pain management",
    ],
    icon: "Activity",
    image: "/images/gallery/ot.png",
    keywords: ["spine treatment jaipur", "best spine surgeon jaipur", "back pain specialist jaipur", "slip disc treatment jaipur"],
    metaDescription:
      "Best Spine Hospital in Jaipur: Complete care for back pain, slip disc, and spinal conditions. Expert diagnosis and ethical treatment by Dr. Ramesh Agarwal.",
  },
  {
    id: "sports-medicine",
    slug: "sports-medicine",
    title: "Sports Medicine",
    summary:
      "Leading sports medicine care for competitive athletes and active individuals, specializing in ligament reconstruction and arthroscopy.",
    content:
      "Balaji Hospital is the premier destination for sports medicine in Jaipur. Our sports injury unit is dedicated to helping athletes and active individuals return to their peak performance after injuries. Led by experts in arthroscopy and ligament reconstruction, we provide cutting-edge diagnostic and therapeutic solutions.\n\n### Common Sports Injuries Treated:\n- **Ligament Tears:** ACL, PCL, MCL, and LCL reconstructions.\n- **Meniscus Injuries:** Repair and stabilization of the knee cartilage.\n- **Shoulder Injuries:** Rotator cuff repairs and stabilization for recurrent dislocations.\n- **Tendonitis & Overuse Injuries:** Tennis elbow, golfer's elbow, and shin splints.\n\n### Non-Surgical & Advanced Therapies\n- **PRP (Platelet-Rich Plasma) Therapy:** Accelerating healing for chronic tendon and joint issues.\n- **Advanced Physiotherapy:** Customized exercise protocols and biomechanical analysis.\n- **Cortisone Injections & Orthotics:** Targeted pain relief and support.\n\n### Goal-Oriented Recovery\nWe focus on faster recovery and a safe \"return-to-sport\" timeline. Every athlete receives a customized, evidence-based care plan that prioritizes safety and long-term functional stability.",
    features: [
      "ACL (Anterior Cruciate Ligament) Reconstruction",
      "MCL and PCL Ligament Repairs",
      "Meniscus Repair and Partial Meniscectomy",
      "PRP Therapy for Sports Injuries",
      "Knee and Shoulder Arthroscopy for sports injuries",
      "Structured return-to-sport rehabilitation protocols",
      "Injury prevention assessment and biomechanics analysis",
    ],
    icon: "Activity",
    image: "/images/gallery/ot.png",
    keywords: ["sports medicine jaipur", "ACL reconstruction jaipur", "sports injury specialist", "knee arthroscopy jaipur"],
    metaDescription:
      "Premier Sports Medicine Hospital in Jaipur. Expert treatment for ACL tears, ligament injuries, and sports fractures. Get back to the game faster.",
  },
  {
    id: "fracture-treatment",
    slug: "fracture-treatment",
    title: "Fracture Treatment",
    summary:
      "24/7 Trauma and Fracture care at Balaji Hospital Jaipur. Expert management for simple and complex bone injuries.",
    content:
      "Balaji Hospital is Jaipur's leading trauma care centre, providing 24/7 expert fracture treatment. Our team specializes in managing a wide spectrum of bone injuries, from simple hairline fractures to complex comminuted and open fractures requiring advanced surgical intervention.\n\n### Emergency Trauma Services\nOur trauma unit is equipped with state-of-the-art operation theatres and diagnostic facilities to handle medical emergencies immediately. We follow strict protocols for infection control and functional restoration.\n\n### We Treat Fractures Caused By:\n- Road traffic accidents (Poly-trauma).\n- Slips, trips, and falls in elderly patients (Fragility fractures).\n- High-impact sports and workplace injuries.\n- Osteoporosis-related bone weakening.\n\n### Comprehensive Treatment Options:\n- **Non-Surgical:** Precision casting, splinting, and traction management.\n- **Surgical:** Internal fixation using modern plates, screws, and intramedullary nails; external fixation for complex open wounds.",
    features: [
      "24/7 Emergency Trauma Care with growth plate protection",
      "Complex and Comminuted Fracture management",
      "Open Fracture care with infection control",
      "Internal Fixation — plates, screws, intramedullary nails",
      "External Fixation for complex open wounds",
      "Post-fracture Rehabilitation and Physiotherapy",
      "Pediatric Fracture Management",
    ],
    icon: "Bone",
    image: "/images/gallery/ot.png",
    keywords: ["fracture treatment jaipur", "trauma surgery jaipur", "bone injury specialist", "emergency orthopedic jaipur"],
    metaDescription:
      "Best Fracture Treatment in Jaipur: 24/7 Emergency Trauma care. Expert orthopedic surgeons for simple to complex fractures and bone injuries.",
  },
  {
    id: "shoulder-arthroscopy",
    slug: "shoulder-arthroscopy",
    title: "Shoulder Arthroscopy",
    summary:
      "Minimally invasive shoulder surgery for rotator cuff tears, frozen shoulder, and instability, ensuring faster recovery.",
    content:
      "Shoulder arthroscopy at Balaji Hospital Jaipur is a specialized service for treating painful shoulder conditions with minimal downtime. Using a tiny camera (arthroscope) and specialized instruments, our surgeons can diagnose and treat problems inside the joint through very small incisions.\n\n### Conditions Treated by Arthroscopy:\n- **Rotator Cuff Tears:** Repairing damaged tendons for strength and mobility.\n- **Frozen Shoulder (Adhesive Capsulitis):** Releasing joint tightness.\n- **Shoulder Instability:** Bankart repair for recurring dislocations.\n- **Shoulder Impingement:** Removing bone spurs to relieve pain.\n\n### Benefits of Minimally Invasive Surgery\n- Significantly less post-operative pain.\n- Minimal scarring compared to open surgery.\n- Faster return to daily activities and sports.\n- Lower risk of surgical site infections.\n\n### Personalized Rehabilitation\nEach patient receives a customized post-surgical physiotherapy plan to restore strength and range of motion, guided by our expert rehabilitation team.",
    features: [
      "Rotator Cuff Repair — partial and full thickness tears",
      "Shoulder Impingement Syndrome treatment",
      "Bankart Repair for recurring shoulder dislocation",
      "Frozen Shoulder (Adhesive Capsulitis) release",
      "SLAP (Superior Labrum Anterior to Posterior) repair",
      "Acromioclavicular (AC) joint injuries",
      "Shoulder Arthritis management",
    ],
    icon: "Activity",
    image: "/images/gallery/ot.png",
    keywords: ["shoulder arthroscopy jaipur", "best shoulder surgeon jaipur", "rotator cuff repair jaipur", "frozen shoulder treatment jaipur"],
    metaDescription:
      "Expert Shoulder Arthroscopy in Jaipur. Advanced treatment for frozen shoulder and rotator cuff tears by Dr. Ramesh Agarwal. Faster recovery.",
  },
  {
    id: "paediatric-orthopaedics",
    slug: "paediatric-orthopaedics",
    title: "Paediatric Orthopaedics",
    summary:
      "Children's bones require specialised attention that differs fundamentally from adult orthopaedic care.",
    content:
      "Children's bones require specialised attention that differs fundamentally from adult orthopaedic care. Growing skeletons are more flexible, heal faster, but also face unique vulnerabilities — especially around growth plates that, if damaged, can affect long-term development.\n\nAt Balaji Hospital, we are a trusted centre for infants, children, and adolescents suffering from a musculoskeletal conditions. Our paediatric orthopaedic team combines medical expertise with a child-friendly, parent-centred approach to ensure effective, compassionate care throughout every stage of treatment and recovery.",
    features: [
      "Congenital Conditions — Clubfoot, DDH, limb length discrepancies",
      "Fractures and Trauma Care with growth plate protection",
      "Deformity Correction — Bow legs, knock knees, flat feet",
      "Bone and Joint Infections (Osteomyelitis, Septic Arthritis)",
      "Sports Injuries in Children",
      "Child-Friendly and Parent-Centred Care approach",
    ],
    icon: "Users",
    image: "/images/gallery/physiotherapy.png",
    keywords: ["paediatric orthopaedics jaipur", "children bone treatment", "clubfoot treatment jaipur", "DDH treatment"],
    metaDescription:
      "Expert Paediatric Orthopaedics at Balaji Hospital Jaipur. Treating clubfoot, DDH, fractures, and growth plate injuries in children.",
  },
  {
    id: "hand-upper-limb",
    slug: "hand-upper-limb",
    title: "Hand & Upper Limb Surgery",
    summary:
      "Diagnostic, surgical, and rehabilitation services for conditions affecting the hand, wrist, elbow, and forearm.",
    content:
      "Our Hand & Upper Limb Surgery unit provides comprehensive diagnostic, surgical, and rehabilitation services for conditions affecting the hand, wrist, elbow, and forearm. From common conditions like carpal tunnel syndrome to complex trauma requiring microsurgical nerve or tendon repair, our specialists deliver precise, expert care.\n\nThe unit is equipped with a dedicated operation theatre for hand procedures and works in close collaboration with our physiotherapy department for structured post-operative rehabilitation.",
    features: [
      "Carpal Tunnel Syndrome release surgery",
      "Trigger Finger (Stenosing Tenosynovitis) treatment",
      "Tendon Repairs — flexor and extensor",
      "Tennis Elbow and Golfer's Elbow treatment",
      "Elbow Fractures and Dislocations",
      "Nerve Injuries — Median, Ulnar, Radial nerve repair",
      "Congenital Hand Deformities correction",
    ],
    icon: "Stethoscope",
    image: "/images/gallery/general-ward.png",
    keywords: ["hand surgery jaipur", "carpal tunnel treatment jaipur", "trigger finger treatment", "upper limb surgery jaipur"],
    metaDescription:
      "Hand & Upper Limb Surgery in Jaipur at Balaji Hospital. Expert treatment for carpal tunnel, trigger finger, tendon injuries, and nerve repairs.",
  },
  {
    id: "ankle-replacement",
    slug: "ankle-replacement",
    title: "Ankle Replacement",
    summary:
      "Reliable surgical solution for severe ankle arthritis, deformity, or long-standing injuries.",
    content:
      "Ankle replacement (total ankle arthroplasty) is a reliable surgical solution for patients suffering from severe ankle arthritis. Unlike fusion surgery, ankle replacement preserves motion in the joint, leading to a more natural gait and improved quality of life.\n\nAt Balaji Hospital, our orthopaedic team carefully evaluates each patient to determine the most appropriate treatment — from conservative management to total ankle arthroplasty — using internationally certified implants.",
    features: [
      "Total Ankle Arthroplasty (Ankle Replacement Surgery)",
      "Osteoarthritis and Rheumatoid Arthritis of the ankle",
      "Post-traumatic Arthritis management",
      "Preservation of nearby joints and improved range of motion",
      "Minimally invasive surgical approach where applicable",
      "Comprehensive post-operative ankle rehabilitation",
      "Gait retraining and functional recovery",
    ],
    icon: "Activity",
    image: "/images/gallery/physiotherapy.png",
    keywords: ["ankle replacement jaipur", "ankle arthritis treatment", "total ankle arthroplasty jaipur", "ankle fusion surgery"],
    metaDescription:
      "Ankle Replacement in Jaipur at Balaji Hospital. Expert total ankle arthroplasty for arthritis and post-traumatic ankle conditions.",
  },
  {
    id: "joint-pain-treatment",
    slug: "joint-pain-treatment",
    title: "Joint Pain Treatment",
    summary:
      "Personalised treatment plans ranging from non-surgical therapy and joint injections to advanced joint replacement surgery.",
    content:
      "Joint pain is one of the most debilitating conditions affecting quality of life. At Balaji Hospital, we offer personalised treatment plans tailored to each patient's condition, age, and lifestyle goals — ranging from conservative non-surgical options to advanced joint replacement when necessary.\n\nOur experienced orthopaedic team performs a thorough assessment including clinical evaluation and imaging before recommending the most appropriate course of treatment. We focus not just on pain relief but on restoring full functional mobility.",
    features: [
      "Intra-articular Joint Injections (Corticosteroid, Hyaluronic acid)",
      "PRP (Platelet-Rich Plasma) Therapy",
      "Bracing and Orthotics",
      "Non-surgical physiotherapy and specialised medications",
      "Lifestyle modification and weight management guidance",
      "Rehabilitation programs for pain relief and mobility",
      "Arthroscopic joint debridement for early-stage disease",
    ],
    icon: "HeartPulse",
    image: "/images/gallery/physiotherapy.png",
    keywords: ["joint pain treatment jaipur", "knee joint pain", "PRP therapy jaipur", "joint injection jaipur"],
    metaDescription:
      "Joint Pain Treatment in Jaipur at Balaji Hospital. Expert orthopaedic care from injections and physiotherapy to joint replacement surgery.",
  },
  {
    id: "physiotherapy",
    slug: "physiotherapy",
    title: "Physiotherapy & Rehabilitation",
    summary:
      "Evidence-based physiotherapy and rehabilitation focusing on post-surgical recovery and chronic pain management.",
    content:
      "Our Physiotherapy & Rehabilitation Centre is a fully equipped, dedicated unit led by Dr. Sheela Agarwal, with over 20 years of experience in musculoskeletal and neurological rehabilitation. We provide evidence-based physiotherapy for post-operative orthopaedic patients, accident victims, and patients with chronic musculoskeletal or neurological conditions.\n\nOur holistic approach combines manual therapy, therapeutic exercise, modern electrotherapy equipment, and patient education to achieve maximum functional recovery in the shortest time.",
    features: [
      "Post-Operative Orthopaedic Rehabilitation (knee, hip, spine)",
      "Therapeutic exercises for strength and coordination",
      "Pain management and inflammation reduction",
      "Balance restoration and proprioception training",
      "Sports Injury Rehabilitation",
      "Neurological Rehabilitation",
      "Modern physiotherapy equipment — ultrasound, IFT, TENS, wax bath",
    ],
    icon: "HeartPulse",
    image: "/images/gallery/physiotherapy.png",
    keywords: ["physiotherapy jaipur", "rehabilitation centre jaipur", "post surgery physiotherapy", "sports rehabilitation jaipur"],
    metaDescription:
      "Physiotherapy & Rehabilitation Centre in Jaipur at Balaji Hospital. Expert rehab by Dr. Sheela Agarwal for post-surgical, trauma, and chronic pain patients.",
  },
  {
    id: "general-orthopaedics",
    slug: "general-orthopaedics",
    title: "General Orthopaedics",
    summary:
      "Comprehensive diagnosis and treatment of all bones, joints, muscles, ligaments, and tendons.",
    content:
      "Balaji Hospital offers comprehensive general orthopaedic care covering all conditions affecting the bones, joints, muscles, ligaments, and tendons. Our team of expert specialists provides accurate diagnosis using advanced imaging — X-ray, MRI, and CT scan — followed by personalised treatment plans.\n\nFrom common conditions like osteoporosis and tendinitis to complex reconstructive procedures, we are equipped to handle the full spectrum of musculoskeletal conditions for patients of all ages and activity levels.",
    features: [
      "Complete musculoskeletal system diagnosis",
      "Advanced imaging — X-ray, MRI, CT scan",
      "Osteoporosis management and bone density screening",
      "Conservative treatment — medication, injections, physiotherapy",
      "Specialised surgical interventions for chronic bone conditions",
      "Tendon and ligament injuries",
      "Bone tumours and cysts evaluation",
    ],
    icon: "Stethoscope",
    image: "/images/gallery/ot2.png",
    keywords: ["best orthopaedic hospital jaipur", "bone specialist jaipur", "joint specialist jaipur", "orthopaedic consultation"],
    metaDescription:
      "Best Orthopaedic Hospital in Jaipur — Balaji Hospital offers comprehensive care for all bone, joint, and muscle conditions since 1996.",
  },
];

// Hospital info extracted from site
export const hospitalInfo = {
  established: 1996,
  totalSurgeries: "50,000+",
  specialists: "15+",
  motto: "Reaching the masses for giving specialised medical care.",
  description:
    "Established in 1996, Balaji Hospital & Orthopaedic Centre is one of Jaipur's first private sector tertiary care hospitals. With over 50,000 surgeries performed and 15+ specialist consultants, we have evolved into a multi-speciality centre catering to Orthopaedics, Joint Replacement, Arthroscopy, ENT, General Surgery, and Plastic & Vascular Surgery.",
};
