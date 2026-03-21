export default function Schema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Hospital",
        "@id": "https://balajihospitaljaipur.com/#hospital",
        "name": "Balaji Hospital & Orthopaedic Centre",
        "url": "https://balajihospitaljaipur.com/",
        "logo": "https://balajihospitaljaipur.com/uploads/logo/6864d3c756898.png",
        "image": "https://balajihospitaljaipur.com/uploads/logo/6864d3c756898.png",
        "description": "Balaji Hospital & Orthopaedic Centre, Jaipur — serving since 1996 with expert orthopedic, ENT, and speciality care. 100+ beds, 50,000+ successful surgeries, 24/7 emergency.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "27, Ratan Nagar, Dher Ke Balaji, Sikar Road",
          "addressLocality": "Jaipur",
          "addressRegion": "Rajasthan",
          "postalCode": "302039",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "26.9548",
          "longitude": "75.7616"
        },
        "telephone": "+91-7276229049",
        "emergencyService": "true",
        "openingHours": "Mo-Su 00:00-23:59",
        "medicalSpecialty": ["Orthopedic", "ENT", "Physiotherapy", "General Surgery"],
        "department": [
          {
            "@type": "MedicalClinic",
            "name": "Orthopedic Department",
            "url": "https://balajihospitaljaipur.com/departments/orthopedic",
            "medicalSpecialty": "Orthopedic"
          },
          {
            "@type": "MedicalClinic",
            "name": "ENT Department",
            "url": "https://balajihospitaljaipur.com/departments/ent",
            "medicalSpecialty": "Otolaryngology"
          },
          {
            "@type": "MedicalClinic",
            "name": "Physiotherapy & Rehabilitation",
            "url": "https://balajihospitaljaipur.com/departments/physiotherapy",
            "medicalSpecialty": "PhysicalTherapy"
          }
        ]
      },
      {
        "@type": "Physician",
        "name": "Dr. Ramesh Agarwal",
        "medicalSpecialty": "Orthopedic Surgery",
        "description": "Senior Orthopedic Surgeon with 28+ years of experience. Specialist in joint replacement, spine surgery, and fracture management.",
        "worksFor": { "@id": "https://balajihospitaljaipur.com/#hospital" }
      },
      {
        "@type": "Physician",
        "name": "Dr. Saloni Agarwal",
        "medicalSpecialty": "Otolaryngology",
        "description": "ENT Specialist with expertise in endoscopic sinus surgery, ear surgery, and throat procedures.",
        "worksFor": { "@id": "https://balajihospitaljaipur.com/#hospital" }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
