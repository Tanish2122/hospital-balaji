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
        "description": "Balaji Hospital & Orthopaedic Centre, Jaipur — serving since 1996 with expert orthopedic, ENT, and speciality care. 100+ beds, 50,000+ successful surgeries, 24/7 emergency. Top-rated orthopedic hospital in Jaipur.",
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
          "latitude": "26.9124",
          "longitude": "75.7873"
        },
        "telephone": "+91-7276229049",
        "priceRange": "$$",
        "emergencyService": "true",
        "openingHours": "Mo-Su 00:00-23:59",
        "medicalSpecialty": ["Orthopedic", "ENT", "Physiotherapy", "Urology", "General Surgery"],
        "sameAs": [
          "https://www.facebook.com/balajihospitaljaipur/",
          "https://www.instagram.com/balajihospitaljaipur/",
          "https://twitter.com/balajihospital"
        ],
        "department": [
          {
            "@type": "MedicalClinic",
            "name": "Orthopedic Department Jaipur",
            "url": "https://balajihospitaljaipur.com/departments/orthopedic",
            "medicalSpecialty": "Orthopedic"
          },
          {
            "@type": "MedicalClinic",
            "name": "ENT Department Jaipur",
            "url": "https://balajihospitaljaipur.com/departments/ent",
            "medicalSpecialty": "Otolaryngology"
          },
          {
            "@type": "MedicalClinic",
            "name": "Urology Department Jaipur",
            "url": "https://balajihospitaljaipur.com/departments/speciality/kidney-stones",
            "medicalSpecialty": "Urology"
          }
        ]
      },
      {
        "@type": "Physician",
        "name": "Dr. Ramesh Agarwal",
        "jobTitle": "Senior Orthopaedic Surgeon",
        "experienceRequirements": "30 years",
        "medicalSpecialty": "Orthopedic Surgery",
        "description": "Senior Orthopedic Surgeon with 30+ years of experience. Specialist in joint replacement, spine surgery, and fracture management in Jaipur.",
        "worksFor": { "@id": "https://balajihospitaljaipur.com/#hospital" }
      },
      {
        "@type": "Physician",
        "name": "Dr. Saloni Agarwal",
        "jobTitle": "ENT & Head Neck Surgeon",
        "medicalSpecialty": "Otolaryngology",
        "description": "ENT Specialist with expertise in endoscopic sinus surgery, ear surgery, and throat procedures in Jaipur.",
        "worksFor": { "@id": "https://balajihospitaljaipur.com/#hospital" }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Which is the best orthopedic hospital in Jaipur?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Balaji Hospital & Orthopaedic Centre is widely recognized as one of the best orthopedic hospitals in Jaipur, specialized in knee/hip replacement and spine surgery since 1996."
            }
          },
          {
            "@type": "Question",
            "name": "Are there 24/7 emergency services available at Balaji Hospital?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Balaji Hospital provides 24/7 emergency medical services, trauma care, and ambulance support in Jaipur."
            }
          },
          {
            "@type": "Question",
            "name": "Who is the top ENT specialist in Jaipur?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Dr. Saloni Agarwal at Balaji Hospital is a leading ENT and Head & Neck surgeon in Jaipur, specializing in advanced ear and sinus surgeries."
            }
          }
        ]
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
