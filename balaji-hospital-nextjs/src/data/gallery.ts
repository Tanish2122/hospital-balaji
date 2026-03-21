export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: "General" | "Surgery" | "Wards" | "Facilities" | "Diagnostics" | "Physiotherapy" | "Outdoor";
}

export const galleryItems: GalleryItem[] = [
  // ─── Facilities ────────────────────────────────────────────────────
  {
    id: "reception",
    src: "https://balajihospitaljaipur.com/uploads/gallery/5965221775reception1-small.png",
    alt: "Reception & Patient Registration Area",
    category: "Facilities",
  },
  {
    id: "medical-store",
    src: "https://balajihospitaljaipur.com/uploads/gallery/9526577152medicalStore1-small.png",
    alt: "In-house Medical Store & Pharmacy",
    category: "Facilities",
  },
  {
    id: "outdoor",
    src: "https://balajihospitaljaipur.com/uploads/gallery/5722567159outdoor-small.png",
    alt: "Hospital Outdoor & Entrance",
    category: "Outdoor",
  },
  {
    id: "outdoor-2",
    src: "https://balajihospitaljaipur.com/uploads/gallery/46807170755722567159outdoor-small.png",
    alt: "Hospital Building Exterior",
    category: "Outdoor",
  },
  {
    id: "dressing-room",
    src: "https://balajihospitaljaipur.com/uploads/gallery/5527579126dressingRoom2-small.png",
    alt: "Dressing & Minor Procedure Room",
    category: "Facilities",
  },

  // ─── Surgery / OT ──────────────────────────────────────────────────
  {
    id: "ot-1",
    src: "https://balajihospitaljaipur.com/uploads/gallery/5729652157ot-small.png",
    alt: "Modern Operation Theatre",
    category: "Surgery",
  },
  {
    id: "ot-2",
    src: "https://balajihospitaljaipur.com/uploads/gallery/6729552157ot2-small.png",
    alt: "Advanced Surgical Suite",
    category: "Surgery",
  },

  // ─── Wards ─────────────────────────────────────────────────────────
  {
    id: "general-ward-1",
    src: "https://balajihospitaljaipur.com/uploads/gallery/2679257515generalWard1-small.png",
    alt: "General Ward — Patient Beds",
    category: "Wards",
  },
  {
    id: "general-ward-2",
    src: "https://balajihospitaljaipur.com/uploads/gallery/9751225657generalWard-small.png",
    alt: "General Ward Overview",
    category: "Wards",
  },
  {
    id: "general-ward-2-alt",
    src: "https://balajihospitaljaipur.com/uploads/gallery/86077041572679257515generalWard1-small.png",
    alt: "In-patient General Ward",
    category: "Wards",
  },
  {
    id: "pediatric-opd",
    src: "https://balajihospitaljaipur.com/uploads/gallery/img1.jpg",
    alt: "Paediatric OPD Ward",
    category: "Wards",
  },
  {
    id: "gynaecology-ward",
    src: "https://balajihospitaljaipur.com/uploads/gallery/img2.jpg",
    alt: "Gynaecology & Maternity Ward",
    category: "Wards",
  },
  {
    id: "ward-3",
    src: "https://balajihospitaljaipur.com/uploads/gallery/img3.jpg",
    alt: "Orthopaedic Recovery Ward",
    category: "Wards",
  },
  {
    id: "ward-4",
    src: "https://balajihospitaljaipur.com/uploads/gallery/img4.jpg",
    alt: "Private Patient Room",
    category: "Wards",
  },

  // ─── Diagnostics / X-Ray ───────────────────────────────────────────
  {
    id: "digital-xray",
    src: "https://balajihospitaljaipur.com/uploads/gallery/2956725571digitalXray-small.png",
    alt: "Digital X-Ray Equipment",
    category: "Diagnostics",
  },
  {
    id: "xray-1",
    src: "https://balajihospitaljaipur.com/uploads/gallery/9215725576xRay1-small.png",
    alt: "X-Ray Examination Room",
    category: "Diagnostics",
  },
  {
    id: "xray-2",
    src: "https://balajihospitaljaipur.com/uploads/gallery/5927156275xRay2-small.png",
    alt: "Radiography Suite",
    category: "Diagnostics",
  },
  {
    id: "xray-3",
    src: "https://balajihospitaljaipur.com/uploads/gallery/6559512277xRay3-small.png",
    alt: "Digital Radiology Centre",
    category: "Diagnostics",
  },

  // ─── Physiotherapy ─────────────────────────────────────────────────
  {
    id: "physiotherapy",
    src: "https://balajihospitaljaipur.com/uploads/gallery/6229751557physiotherapy-small.png",
    alt: "Physiotherapy & Rehabilitation Centre",
    category: "Physiotherapy",
  },
  {
    id: "physiotherapy-1",
    src: "https://balajihospitaljaipur.com/uploads/gallery/5926721575physiotherapy1-small.png",
    alt: "Physiotherapy Equipment Room",
    category: "Physiotherapy",
  },
  {
    id: "physiotherapy-2",
    src: "https://balajihospitaljaipur.com/uploads/gallery/7755162295physiotherapy2-small.png",
    alt: "Physiotherapy Treatment Session",
    category: "Physiotherapy",
  },
  {
    id: "physiotherapy-3",
    src: "https://balajihospitaljaipur.com/uploads/gallery/2756915257physiotherapy3-small.png",
    alt: "Post-Op Rehabilitation Area",
    category: "Physiotherapy",
  },

  // ─── General / Events ──────────────────────────────────────────────
  {
    id: "gallery-1",
    src: "https://balajihospitaljaipur.com/uploads/gallery/9197106986gallery-1.jpg",
    alt: "Hospital Team & Welcome Event",
    category: "General",
  },
  {
    id: "gallery-2",
    src: "https://balajihospitaljaipur.com/uploads/gallery/6607189991gallery-2.jpg",
    alt: "Medical Camp & Community Outreach",
    category: "General",
  },
  {
    id: "gallery-3",
    src: "https://balajihospitaljaipur.com/uploads/gallery/0916786692gallery-3.jpg",
    alt: "Hospital Seminar & CME Event",
    category: "General",
  },
  {
    id: "gallery-4",
    src: "https://balajihospitaljaipur.com/uploads/gallery/2996168706gallery-4.jpg",
    alt: "Free Health Check-up Camp",
    category: "General",
  },
  {
    id: "gallery-5",
    src: "https://balajihospitaljaipur.com/uploads/gallery/0686927981gallery-5.jpg",
    alt: "Hospital Inauguration Ceremony",
    category: "General",
  },
  {
    id: "gallery-6",
    src: "https://balajihospitaljaipur.com/uploads/gallery/6216980798gallery-6.jpg",
    alt: "Annual Medical Conference",
    category: "General",
  },
  {
    id: "event-1",
    src: "https://balajihospitaljaipur.com/uploads/gallery/15186611236.jpg",
    alt: "Hospital Anniversary Celebration",
    category: "General",
  },
  {
    id: "event-2",
    src: "https://balajihospitaljaipur.com/uploads/gallery/81631565115.jpg",
    alt: "Patient Felicitation Event",
    category: "General",
  },
  {
    id: "event-3",
    src: "https://balajihospitaljaipur.com/uploads/gallery/28395161616.jpg",
    alt: "Staff Training Workshop",
    category: "General",
  },
  {
    id: "event-4",
    src: "https://balajihospitaljaipur.com/uploads/gallery/16361814257.jpg",
    alt: "Awareness Campaign",
    category: "General",
  },
  {
    id: "event-5",
    src: "https://balajihospitaljaipur.com/uploads/gallery/63811416558.jpg",
    alt: "Orthopedic Medical Camp",
    category: "General",
  },
  {
    id: "event-6",
    src: "https://balajihospitaljaipur.com/uploads/gallery/51716116389.jpg",
    alt: "Hospital Community Service",
    category: "General",
  },
  {
    id: "event-7",
    src: "https://balajihospitaljaipur.com/uploads/gallery/683185113610.jpg",
    alt: "ENT Awareness Programme",
    category: "General",
  },
  {
    id: "event-8",
    src: "https://balajihospitaljaipur.com/uploads/gallery/671591813611.jpg",
    alt: "Patient Success Stories",
    category: "General",
  },
  {
    id: "event-9",
    src: "https://balajihospitaljaipur.com/uploads/gallery/106168936112.jpg",
    alt: "Health Talk & Seminar",
    category: "General",
  },
  {
    id: "event-10",
    src: "https://balajihospitaljaipur.com/uploads/gallery/612383616113.jpg",
    alt: "Hospital Team Felicitation",
    category: "General",
  },
  {
    id: "outdoor-camp",
    src: "https://balajihospitaljaipur.com/uploads/gallery/7001541470IMG_20200831_185253.webp",
    alt: "Outdoor Medical Camp",
    category: "General",
  },
];
