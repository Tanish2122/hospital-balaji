export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  category: "Orthopedic" | "ENT" | "Speciality" | "General";
  url: string;
}

export const services: Service[] = [
  // ─── Orthopedic ───────────────────────────────────────────────────
  {
    id: "spine-treatment",
    title: "Spine Treatment",
    description:
      "Comprehensive care for spinal disorders including herniated discs, spinal stenosis, scoliosis, and complex deformity correction. We offer both surgical and non-surgical approaches.",
    icon: "Activity",
    image: "/images/services/spine.png",
    category: "Orthopedic",
    url: "/departments/orthopedic/spine-treatment",
  },
  {
    id: "knee-replacement",
    title: "Knee Replacement",
    description:
      "Advanced total and partial knee replacement surgery using minimally invasive techniques for faster recovery, reduced pain, and improved mobility in arthritis patients.",
    icon: "Stethoscope",
    image: "/images/services/knee.png",
    category: "Orthopedic",
    url: "/departments/orthopedic/knee-replacement",
  },
  {
    id: "hip-replacement",
    title: "Hip Replacement",
    description:
      "Expert surgical solutions for chronic hip pain, avascular necrosis, and arthritis — restoring an active, pain-free lifestyle using cemented and cementless prostheses.",
    icon: "HeartPulse",
    image: "/images/services/hip.png",
    category: "Orthopedic",
    url: "/departments/orthopedic/hip-replacement",
  },
  {
    id: "fracture-treatment",
    title: "Fracture Treatment",
    description:
      "Emergency and specialized care for all types of bone fractures — from simple closed fractures to complex open fractures — using modern internal and external fixation methods.",
    icon: "Bone",
    image: "/images/services/fracture.png",
    category: "Orthopedic",
    url: "/departments/orthopedic/fracture-treatment",
  },
  {
    id: "shoulder-arthroscopy",
    title: "Shoulder Arthroscopy",
    description:
      "Minimally invasive arthroscopic surgery for shoulder injuries including rotator cuff tears, shoulder instability, SLAP lesions, and frozen shoulder (adhesive capsulitis).",
    icon: "Activity",
    image: "/images/services/shoulder.png",
    category: "Orthopedic",
    url: "/departments/orthopedic/shoulder-arthroscopy",
  },
  {
    id: "ankle-replacement",
    title: "Ankle Replacement",
    description:
      "Modern total ankle arthroplasty for end-stage arthritis of the ankle joint, offering better motion preservation and faster recovery compared to traditional fusion surgery.",
    icon: "Activity",
    image: "/images/services/ankle.png",
    category: "Orthopedic",
    url: "/departments/orthopedic/ankle-replacement",
  },
  {
    id: "hand-upper-limb",
    title: "Hand & Upper Limb Surgery",
    description:
      "Specialized surgical treatment for hand and wrist conditions: carpal tunnel syndrome, trigger finger, tendon injuries, nerve repair, and congenital deformities.",
    icon: "Stethoscope",
    image: "/images/services/hand.png",
    category: "Orthopedic",
    url: "/departments/orthopedic/hand-upper-limb",
  },
  {
    id: "joint-pain-treatment",
    title: "Joint Pain Treatment",
    description:
      "Comprehensive management of acute and chronic joint pain through physiotherapy, intra-articular injections, PRP therapy, and surgical intervention when necessary.",
    icon: "HeartPulse",
    image: "/images/services/joint-pain.png",
    category: "Orthopedic",
    url: "/departments/orthopedic/joint-pain-treatment",
  },
  {
    id: "sports-medicine",
    title: "Sports Medicine",
    description:
      "Dedicated sports injury management including ACL/PCL reconstruction, meniscus repair, and rehabilitation programs designed to get athletes back to peak performance.",
    icon: "Activity",
    image: "/images/services/sports.png",
    category: "Orthopedic",
    url: "/departments/orthopedic/sports-medicine",
  },
  {
    id: "paediatric-orthopaedics",
    title: "Paediatric Orthopaedics",
    description:
      "Specialized orthopaedic care for children — treating clubfoot, bone infections, developmental hip dysplasia, limb deformities, and paediatric fractures with child-friendly approaches.",
    icon: "Users",
    image: "/images/services/paediatric.png",
    category: "Orthopedic",
    url: "/departments/orthopedic/paediatric-orthopaedics",
  },
  {
    id: "physiotherapy",
    title: "Physiotherapy & Rehabilitation",
    description:
      "Fully equipped physiotherapy centre offering post-operative rehabilitation, sports injury recovery, chronic pain management, and neurological rehabilitation programs.",
    icon: "HeartPulse",
    image: "/images/services/physiotherapy.png",
    category: "Orthopedic",
    url: "/departments/orthopedic/physiotherapy",
  },

  // ─── ENT ─────────────────────────────────────────────────────────
  {
    id: "ear-surgery",
    title: "Ear Surgery",
    description:
      "Microscopic and endoscopic ear surgeries for hearing restoration, chronic suppurative otitis media (CSOM), tympanoplasty, mastoidectomy, and stapedectomy.",
    icon: "Microscope",
    image: "/images/services/ear.png",
    category: "ENT",
    url: "/departments/ent/ear-surgery",
  },
  {
    id: "nose-surgery",
    title: "Nose Surgery",
    description:
      "Functional and cosmetic nasal surgeries including septoplasty, FESS (endoscopic sinus surgery), rhinoplasty, and treatment of nasal polyps and chronic sinusitis.",
    icon: "Wind",
    image: "/images/services/nose.png",
    category: "ENT",
    url: "/departments/ent/nose-surgery",
  },
  {
    id: "throat-surgery",
    title: "Throat Surgery",
    description:
      "Specialized care for voice disorders, recurrent tonsillitis (tonsillectomy/adenoidectomy), laryngeal conditions, dysphagia, and sleep apnea-related surgeries.",
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
      "Comprehensive plastic and vascular surgery services: wound reconstruction, skin grafts, varicose vein treatment, and vascular bypass procedures for optimal outcomes.",
    icon: "HeartPulse",
    image: "/images/services/plastic.png",
    category: "Speciality",
    url: "/departments/speciality/plastic-vascular-surgery",
  },
  {
    id: "kidney-stones",
    title: "Kidney Stones Treatment",
    description:
      "Modern laser lithotripsy and non-invasive ESWL for effective removal of kidney and urinary stones with minimal recovery time and maximum precision.",
    icon: "Flame",
    image: "/images/services/kidney.png",
    category: "Speciality",
    url: "/departments/speciality/kidney-stones",
  },
];
