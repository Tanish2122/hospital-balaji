export default function Schema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Hospital",
        "@id": "https://www.balajihospitals.co.in/#hospital",
        "name": "Balaji Cure & Care Hospital",
        "url": "https://www.balajihospitals.co.in/",
        "logo": "https://www.balajihospitals.co.in/images/logo.png",
        "image": "https://www.balajihospitals.co.in/hospital-building.jpg",
        "description": "Premier 150-bed multispeciality hospital in Jaipur providing advanced cardiac, orthopedic, and emergency care.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Kanak Vihar, Sirsi Road",
          "addressLocality": "Jaipur",
          "addressRegion": "Rajasthan",
          "postalCode": "302034",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "26.854899",
          "longitude": "75.734432"
        },
        "telephone": "+91-94621-34373",
        "emergencyService": "true",
        "openingHours": "Mo-Su 00:00-23:59",
        "department": [
          {
            "@type": "MedicalClinic",
            "name": "Cardiology Department",
            "url": "https://www.balajihospitals.co.in/cardiology/",
            "medicalSpecialty": "Cardiology"
          },
          {
            "@type": "MedicalClinic",
            "name": "Orthopedic Department",
            "url": "https://www.balajihospitals.co.in/orthopedic-and-joint-replacement/",
            "medicalSpecialty": "Orthopedic"
          },
          {
            "@type": "MedicalClinic",
            "name": "Oncology Department",
            "url": "https://www.balajihospitals.co.in/medical-oncology/",
            "medicalSpecialty": "Oncology"
          }
        ]
      },
      {
        "@type": "Physician",
        "name": "Dr. Abhishek Soni",
        "image": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d",
        "medicalSpecialty": "Radiology",
        "worksFor": { "@id": "https://www.balajihospitals.co.in/#hospital" }
      },
      {
        "@type": "Physician",
        "name": "Dr. Priya Sharma",
        "image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2",
        "medicalSpecialty": "Cardiology",
        "worksFor": { "@id": "https://www.balajihospitals.co.in/#hospital" }
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
