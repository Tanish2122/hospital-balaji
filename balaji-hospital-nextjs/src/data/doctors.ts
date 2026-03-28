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
  phone?: string;
}

export const doctors: Doctor[] = [
  {
    id: "dr-ramesh-agarwal",
    name: "Dr. Ramesh Agarwal",
    phone: "916377433387@c.us",
    specialty: "Chairman & Senior Orthopaedic Surgeon",
    image: "/images/doctors/Gemini_Generated_Image_8hekj68hekj68hek.png",
    experience: "30+ Years",
    department: "Orthopedic",
    description:
      "Dr. Ramesh Agarwal is the founder and senior consultant at Balaji Hospital. With over 30 years of expertise, he specializes in complex spine surgeries, total joint replacements, and high-impact trauma management. He established the hospital in 1996 with a vision to provide world-class orthopaedic care to all sections of society.",
    qualifications: ["MS (Orthopaedics)", "MBBS"],
    schedule: [
      { days: "Monday – Saturday", hours: "10:00 AM – 04:00 PM" },
      { days: "Sunday", hours: "Emergency Only" },
    ],
    services: ["Spine Surgery", "Joint Replacement", "Trauma Management"],
  },
  {
    id: "dr-shitiz-agarwal",
    name: "Dr. Shitiz Agarwal",
    specialty: "Cons. Orthopaedic, Arthroscopy & Joint Replacement",
    image: "/images/doctors/ramesh-agarwal(2).png",
    experience: "15+ Years",
    department: "Orthopedic",
    description:
      "Dr. Shitiz Agarwal specializes in advanced arthroscopic procedures and joint replacement. Having served as a Senior Resident at SMS Hospital, Jaipur, he brings extensive experience in minimally invasive surgical techniques and sports injury management.",
    qualifications: ["DNB Ortho (New Delhi)", "D Ortho (Pune)", "MBBS"],
    schedule: [
      { days: "Monday – Saturday", hours: "09:00 AM – 02:00 PM" },
      { days: "Sunday", hours: "Emergency Only" },
    ],
    services: ["Arthroscopy", "Joint Replacement", "Sports Medicine"],
  },
  {
    id: "dr-utkarsh-agarwal",
    name: "Dr. Utkarsh Agarwal",
    specialty: "Consultant Orthopaedic Surgeon",
    image: "/images/dr utkarsh.png",
    experience: "8+ Years",
    department: "Orthopedic",
    description:
      "Dr. Utkarsh Agarwal is a dedicated orthopaedic consultant focused on modern trauma care and general orthopaedics. He is committed to providing patient-centric care using evidence-based surgical and non-surgical treatments.",
    qualifications: ["MS (Orthopaedics)", "MBBS"],
    schedule: [
      { days: "Monday – Saturday", hours: "11:00 AM – 05:00 PM" },
    ],
    services: ["General Orthopaedics", "Fracture Care", "Trauma"],
  },
  {
    id: "dr-saloni-agarwal",
    name: "Dr. Saloni Agarwal",
    specialty: "ENT, Head & Neck Surgeon",
    image: "/images/doctors/saloni agarwal.png",
    experience: "10+ Years",
    department: "ENT",
    description:
      "Dr. Saloni Agarwal is a highly skilled ENT surgeon specializing in head and neck procedures. With a background as a Senior Resident at SMS Hospital, she expertise in endoscopic sinus surgery and microscopic ear procedures.",
    qualifications: ["MS ENT", "DNB ENT", "MBBS"],
    schedule: [
      { days: "Monday – Saturday", hours: "10:00 AM – 03:00 PM" },
    ],
    services: ["Ear Surgery", "Nose Surgery", "Throat Surgery"],
  },
  {
    id: "dr-kanika-sharma",
    name: "Dr. Kanika Sharma",
    specialty: "ENT & Allergy Specialist",
    image: "/images/doctors/kanika sharma.jpg",
    experience: "10+ Years",
    department: "ENT",
    description:
      "Dr. Kanika Sharma specializes in ENT disorders and clinical allergy. Her expertise includes managing chronic sinusitis, allergic rhinitis, and hearing disorders using advanced diagnostic and surgical tools.",
    qualifications: ["MS ENT", "DNB ENT", "MBBS"],
    schedule: [
      { days: "Monday – Saturday", hours: "11:00 AM – 04:00 PM" },
    ],
    services: ["Allergy Treatment", "Sinusitis Care", "Hearing Restoration"],
  },
  {
    id: "dr-sangeeta-agarwal",
    name: "Dr. Sangeeta Agarwal",
    specialty: "Anaesthesia Specialist",
    image: "/images/gallery/ot.png",
    experience: "20+ Years",
    department: "Anaesthesia",
    description:
      "Dr. Sangeeta Agarwal is a seasoned anaesthetist ensuring patient safety during complex surgical procedures. She specializes in critical care and pain management.",
    qualifications: ["D.A. (Anaesthesia)", "MBBS"],
    schedule: [
      { days: "Monday – Saturday", hours: "Full Time" },
    ],
    services: ["Surgical Anaesthesia", "Pain Management", "Critical Care"],
  },
  {
    id: "dr-gautam-sharma",
    name: "Dr. Gautam Sharma",
    specialty: "Consultant Anaesthetist",
    image: "/images/gallery/ot.png",
    experience: "15+ Years",
    department: "Anaesthesia",
    description:
      "Dr. Gautam Sharma provides expert anaesthetic care for adult and paediatric surgeries. He is committed to perioperative patient safety and advanced pain relief techniques.",
    qualifications: ["MD Anaesthesia", "MBBS"],
    schedule: [
      { days: "Monday – Saturday", hours: "On Call" },
    ],
    services: ["General Anaesthesia", "Regional Block", "Critical Care"],
  },
  {
    id: "dr-anil-sharma",
    name: "Dr. Anil Sharma",
    specialty: "Physiotherapy & Rehabilitation Specialist",
    image: "/images/gallery/physiotherapy.png",
    experience: "12+ Years",
    department: "Physiotherapy",
    description:
      "Dr. Anil Sharma leads the physiotherapy department, focusing on post-operative rehabilitation and musculoskeletal recovery. He uses modern physical therapy techniques to help patients regain mobility.",
    qualifications: ["BPT", "MPT"],
    schedule: [
      { days: "Monday – Saturday", hours: "09:00 AM – 06:00 PM" },
    ],
    services: ["Post-Op Rehab", "Sports Injury Rehab", "Pain Management"],
  },
];
