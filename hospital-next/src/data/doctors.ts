export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  experience: string;
  description: string;
  department: string;
  qualifications: string[];
  schedule: { days: string; hours: string }[];
  services: string[];
}

export const doctors: Doctor[] = [
  {
    id: "dr-ramesh-agarwal",
    name: "Dr. Ramesh Agarwal",
    specialty: "Sr. Consultant Orthopedic & Joint Replacement Surgeon",
    image: "/images/doctors/ramesh-agarwal.png",
    experience: "25+ Years",
    department: "Orthopedic",
    description:
      "Dr. Ramesh Agarwal is the founder and senior consultant at Balaji Hospital & Orthopaedic Centre, Jaipur. With over 25 years of hands-on expertise, he specialises in complex spine surgeries, total knee and hip replacement, and trauma management. He founded the hospital in 1996 with the vision of making world-class orthopaedic care accessible to all sections of society. His patient-first approach and precise surgical skills have earned him the trust of thousands of patients across Rajasthan.",
    qualifications: [
      "MS (Orthopaedics) — Gold Medalist",
      "MBBS — Rajasthan University",
      "Fellowship in Joint Replacement Surgery",
      "Member, Indian Orthopaedic Association (IOA)",
    ],
    schedule: [
      { days: "Monday – Saturday", hours: "10:00 AM – 04:00 PM" },
      { days: "Sunday", hours: "On Call / Emergency Only" },
    ],
    services: [
      "Spine Treatment",
      "Total Knee Replacement",
      "Total Hip Replacement",
      "Fracture Management",
      "Sports Medicine",
      "Joint Pain Treatment",
      "Paediatric Orthopaedics",
    ],
  },
  {
    id: "dr-shitiz-agarwal",
    name: "Dr. Shitiz Agarwal",
    specialty: "Consultant Orthopedic Surgeon",
    image: "/images/doctors/ramesh-agarwal-alt.jpg",
    experience: "12+ Years",
    department: "Orthopedic",
    description:
      "Dr. Shitiz Agarwal is a skilled orthopaedic surgeon specialising in trauma, sports injuries, and arthroscopic procedures. He brings a modern approach to treatment, incorporating minimally invasive surgical techniques that accelerate recovery and reduce post-operative pain. He is deeply committed to evidence-based medicine and continuous learning, regularly participating in national orthopaedic conferences and workshops.",
    qualifications: [
      "MS (Orthopaedics)",
      "MBBS",
      "Fellowship in Arthroscopy & Sports Medicine",
      "Member, Indian Orthopaedic Association (IOA)",
    ],
    schedule: [
      { days: "Monday – Saturday", hours: "09:00 AM – 02:00 PM" },
      { days: "Sunday", hours: "On Call / Emergency Only" },
    ],
    services: [
      "Trauma & Fracture Care",
      "Shoulder Arthroscopy",
      "Ankle Replacement",
      "Knee Arthroscopy",
      "Sports Injury Management",
      "Hand & Upper Limb Surgery",
    ],
  },
  {
    id: "dr-alok-maheshwari",
    name: "Dr. Alok Maheshwari",
    specialty: "Consultant — ENT, Plastic & Vascular Surgery",
    image: "/images/gallery/ot.png",
    experience: "18+ Years",
    department: "ENT & Surgery",
    description:
      "Dr. Alok Maheshwari is a highly experienced ENT and plastic/vascular surgeon. He has performed thousands of microsurgical ear procedures, functional endoscopic sinus surgeries (FESS), and complex vascular reconstructions. His dual expertise in ENT and plastic surgery allows him to offer comprehensive head and neck surgical care with exceptional aesthetic and functional outcomes.",
    qualifications: [
      "MS (ENT & Head-Neck Surgery)",
      "MBBS",
      "Fellowship in Endoscopic Sinus Surgery",
      "Training in Plastic & Reconstructive Surgery",
      "Life Member, Association of Otolaryngologists of India (AOI)",
    ],
    schedule: [
      { days: "Monday – Friday", hours: "11:00 AM – 05:00 PM" },
      { days: "Saturday", hours: "11:00 AM – 02:00 PM" },
      { days: "Sunday", hours: "On Call / Emergency Only" },
    ],
    services: [
      "Ear Surgery (Tympanoplasty, Mastoidectomy)",
      "Nose Surgery (Septoplasty, FESS)",
      "Throat Surgery (Tonsillectomy, Adenoidectomy)",
      "Kidney Stones Treatment",
      "Plastic & Reconstructive Surgery",
      "Vascular Surgery",
    ],
  },
  {
    id: "dr-sheela-agarwal",
    name: "Dr. Sheela Agarwal",
    specialty: "Physiotherapy & Rehabilitation Specialist",
    image: "/images/gallery/physiotherapy.png",
    experience: "20+ Years",
    department: "Physiotherapy",
    description:
      "Dr. Sheela Agarwal heads the Physiotherapy & Rehabilitation department at Balaji Hospital. With over 20 years of experience, she has developed and led rehabilitation programs for post-surgical orthopaedic patients, accident victims, and patients with neurological conditions. Her holistic approach combines manual therapy, exercise-based rehabilitation, and patient education to achieve maximum functional recovery in the shortest time.",
    qualifications: [
      "BPT (Bachelor of Physiotherapy) — Rajasthan University",
      "MPT (Master of Physiotherapy) — Specialisation in Musculoskeletal",
      "Certified in Sports Rehabilitation",
      "Member, Indian Association of Physiotherapists (IAP)",
    ],
    schedule: [
      { days: "Monday – Saturday", hours: "09:00 AM – 05:00 PM" },
      { days: "Sunday", hours: "Closed" },
    ],
    services: [
      "Post-Operative Orthopaedic Rehabilitation",
      "Sports Injury Rehabilitation",
      "Neurological Rehabilitation",
      "Chronic Pain Management",
      "Gynaecological Physiotherapy",
      "Geriatric Rehabilitation",
    ],
  },
];
