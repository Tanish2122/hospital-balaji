export interface Service {
  id: string;
  title: string;
  description: string;
  content?: string;
  features?: string[];
  icon: string;
  image: string;
  category: "Orthopedic" | "ENT" | "Speciality" | "General";
  url: string;
}

export const services: Service[] = [
  // ─── Orthopedic Fallback ──────────────────────────────────────────
  {
    id: "spine-treatment",
    title: "Spine Treatment",
    description:
      "Comprehensive care for spinal disorders including herniated discs, spinal stenosis, scoliosis, and complex deformity correction.",
    content: "At Balaji Hospital, we offer the most comprehensive spine treatment in Jaipur. Our spine unit, led by senior consultant Dr. Ramesh Agarwal, focuses on treating the root cause of spinal pain, nerve compression, and deformities using both conservative and advanced surgical approaches.",
    features: ["Slip Disc & Disc Herniation Care", "Cervical & Lumbar Spondylosis relief", "Sciatica management", "Minimally Invasive Spine Surgery"],
    icon: "Activity",
    image: "/images/services/spine.png",
    category: "Orthopedic",
    url: "/departments/orthopedic/spine-treatment",
  },
  {
    id: "knee-replacement",
    title: "Knee Replacement",
    description: "Advanced total and partial knee replacement surgery using minimally invasive techniques for faster recovery.",
    content: "Balaji Hospital is one of Jaipur's most trusted knee replacement centres, with over 50,000 surgical procedures performed since 1996. We specialize in Total Knee Replacement (TKR), Partial (Unicompartmental) Knee Replacement, and complex Revision Knee Replacement surgery.",
    features: ["Total Knee Replacement (TKR)", "Partial (Unicompartmental) Knee Replacement", "Revision Knee Replacement", "Advanced Pain Management"],
    icon: "Stethoscope",
    image: "/images/services/knee.png",
    category: "Orthopedic",
    url: "/departments/orthopedic/knee-replacement",
  },
  {
    id: "hip-replacement",
    title: "Hip Replacement",
    description: "Expert surgical solutions for chronic hip pain, avascular necrosis, and arthritis.",
    content: "Balaji Hospital is a leading centre for hip arthroplasty in Jaipur. Led by Dr. Ramesh Agarwal, our team offers specialized care for patients suffering from chronic hip arthritis, avascular necrosis (AVN), and severe joint degeneration.",
    features: ["Total Hip Replacement (THR)", "Partial Hip Replacement", "Revision Hip Replacement", "AVN Management"],
    icon: "HeartPulse",
    image: "/images/services/hip.png",
    category: "Orthopedic",
    url: "/departments/orthopedic/hip-replacement",
  },

  // ─── ENT ─────────────────────────────────────────────────────────
  {
    id: "ear-surgery",
    title: "Ear Surgery",
    description:
      "Microscopic and endoscopic ear surgeries for hearing restoration and chronic infections.",
    content: "Our ENT department, led by Dr. Saloni Agarwal, provides state-of-the-art ear surgery using microscopic and endoscopic techniques. We specialize in hearing restoration and treating chronic ear infections.\n\n### Specialized Ear Procedures:\n- **Tympanoplasty:** Surgical repair of the eardrum to improve hearing and prevent further infection.\n- **Mastoidectomy:** Removing infected bone from the ear cavity.\n- **Stapedectomy:** To treat hearing loss caused by otosclerosis.\n- **Cochlear Implant Evaluation:** Comprehensive assessment for advanced hearing solutions.",
    features: ["Microscopic Ear Surgery", "Endoscopic Ear Surgery", "Tympanoplasty & Hearing Restoration", "Mastoidectomy & Chronic Infection Care", "Stapedectomy for Otosclerosis", "Diagnostic Audiology Support"],
    icon: "Microscope",
    image: "/images/services/ear.png",
    category: "ENT",
    url: "/departments/ent/ear-surgery",
  },
  {
    id: "nose-surgery",
    title: "Nose Surgery",
    description:
      "Functional and cosmetic nasal surgeries including septoplasty, FESS, and treatment of sinusitis.",
    content: "At Balaji Hospital, we offer advanced surgical solutions for nasal and sinus conditions. Whether you suffer from chronic sinusitis or require functional correction of the nasal septum, our team uses the latest endoscopic tools for precision and faster recovery.\n\n### Advanced Nasal Care:\n- **FESS (Functional Endoscopic Sinus Surgery):** Minimally invasive procedure for chronic sinusitis and nasal polyps.\n- **Septoplasty:** Correction of deviated nasal septum (DNS) to improve breathing.\n- **Rhinoplasty:** Combining functional correction with aesthetic enhancement.\n- **Endoscopic DCR:** Advanced treatment for blocked tear ducts.",
    features: ["FESS (Functional Endoscopic Sinus Surgery)", "Septoplasty for Deviated Septum", "Endoscopic Nasal Polyp Removal", "Rhinoplasty (Functional & Aesthetic)", "Endoscopic DCR", "Chronic Sinusitis Management"],
    icon: "Wind",
    image: "/images/services/nose.png",
    category: "ENT",
    url: "/departments/ent/nose-surgery",
  },
  {
    id: "throat-surgery",
    title: "Throat Surgery",
    description:
      "Specialized care for voice disorders, recurrent tonsillitis, and sleep apnea.",
    content: "Our throat surgery unit focuses on both pediatric and adult conditions affecting the throat, voice, and upper airway. We prioritize patient comfort and long-term functional improvement.\n\n### Key Throat Treatments:\n- **Tonsillectomy & Adenoidectomy:** Safe and effective procedures for recurrent infections in children and adults.\n- **Microlaryngeal Surgery (MLS):** For voice box conditions and vocal cord polyps.\n- **Uvulopalatopharyngoplasty (UPPP):** For obstructive sleep apnea and snoring management.\n- **Esophagoscopy & Foreign Body Removal:** Emergency services for airway and throat obstructions.",
    features: ["Pediatric Tonsillectomy & Adenoidectomy", "Microlaryngeal Surgery (MLS)", "Voice Box (Larynx) care", "Snoring & Sleep Apnea Surgery", "Diagnostic Laryngoscopy", "Foreign Body Removal Services"],
    icon: "Wind",
    image: "/images/services/throat.png",
    category: "ENT",
    url: "/departments/ent/throat-surgery",
  },

  // ─── Speciality ──────────────────────────────────────────────────
  {
    id: "plastic-vascular-surgery",
    title: "Plastic & Vascular Surgery",
    description:
      "Comprehensive plastic and vascular surgery: wound reconstruction, skin grafts, and varicose vein treatment.",
    content: "The speciality surgery department at Balaji Hospital provides expert care for complex reconstructions and vascular health. Led by specialized surgeons, we offer both functional and aesthetic surgical solutions.\n\n### Surgical Excellence:\n- **Reconstructive Plastic Surgery:** Skin grafting and flaps for trauma wounds and burns.\n- **Vascular Surgery:** Expert management of varicose veins and peripheral vascular disease.\n- **Diabetic Foot Care:** Specialized wound care and salvage procedures.\n- **Vascular Access:** Creation of AV Fistulas for dialysis patients.",
    features: ["Reconstructive Plastic Surgery", "Skin Grafting & Wound Care", "Varicose Vein Treatment (Laser/Surgical)", "Peripheral Vascular Disease management", "Diabetic Foot Salvage", "AV Fistula for Dialysis"],
    icon: "HeartPulse",
    image: "/images/services/plastic.png",
    category: "Speciality",
    url: "/departments/speciality/plastic-vascular-surgery",
  },
  {
    id: "kidney-stones",
    title: "Kidney Stones Treatment",
    description:
      "Modern laser lithotripsy and non-invasive ESWL for effective removal of kidney and urinary stones.",
    content: "Balaji Hospital offers advanced urological care specializing in the non-invasive and minimally invasive management of kidney and urinary stones. We prioritize faster recovery and patient comfort.\n\n### Advanced Stone Care:\n- **Laser Lithotripsy:** Using precision laser energy to fragment stones into small particles.\n- **ESWL (Extracorporeal Shock Wave Lithotripsy):** Non-surgical stone fragmentation using shock waves.\n- **PCNL & URS:** Advanced endoscopic procedures for complex and large stones.\n- **Preventative Care:** Personalized diet and lifestyle guidance to prevent stone recurrence.",
    features: ["Laser Lithotripsy (Mini-PCNL)", "URS / RIRS for Ureteric Stones", "ESWL (Non-Surgical Fragmentation)", "Diagnostic Ultrasound & IVP", "Stone Recurrence Prevention guidance", "Painless Stone Removal protocols"],
    icon: "Flame",
    image: "/images/services/kidney.png",
    category: "Speciality",
    url: "/departments/speciality/kidney-stones",
  },
];
