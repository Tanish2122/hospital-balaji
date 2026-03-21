const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const images = [
  // Doctors
  { url: "https://balajihospitaljaipur.com/uploads/team/rameshAgarwal.png", dest: "public/images/doctors/ramesh-agarwal.png" },
  { url: "https://balajihospitaljaipur.com/uploads/team/rameshAgarwal.jpg", dest: "public/images/doctors/ramesh-agarwal-alt.jpg" },
  { url: "https://balajihospitaljaipur.com/uploads/Directors_image1/6868d53727c66.png", dest: "public/images/doctors/directors-image.png" },
  
  // Gallery
  { url: "https://balajihospitaljaipur.com/uploads/gallery/5965221775reception1-small.png", dest: "public/images/gallery/reception.png" },
  { url: "https://balajihospitaljaipur.com/uploads/gallery/6729552157ot2-small.png", dest: "public/images/gallery/ot2.png" },
  { url: "https://balajihospitaljaipur.com/uploads/gallery/5729652157ot-small.png", dest: "public/images/gallery/ot.png" },
  { url: "https://balajihospitaljaipur.com/uploads/gallery/img1.jpg", dest: "public/images/gallery/img1.jpg" },
  { url: "https://balajihospitaljaipur.com/uploads/gallery/img2.jpg", dest: "public/images/gallery/img2.jpg" },
  { url: "https://balajihospitaljaipur.com/uploads/gallery/2956725571digitalXray-small.png", dest: "public/images/gallery/digital-xray.png" },
  { url: "https://balajihospitaljaipur.com/uploads/gallery/6229751557physiotherapy-small.png", dest: "public/images/gallery/physiotherapy.png" },
  { url: "https://balajihospitaljaipur.com/uploads/gallery/9526577152medicalStore1-small.png", dest: "public/images/gallery/medical-store.png" },
  
  // Services (mapped from crawl data if available, otherwise placeholders)
  { url: "https://balajihospitaljaipur.com/uploads/orthopedic/1773296937-Paediatric%20Orthopaedics%20Hospital%20in%20Jaipur.png", dest: "public/images/services/orthopedic.png" },
  { url: "https://balajihospitaljaipur.com/uploads/orthopedic/1773297396-Best%20Spine%20Hospital%20in%20Jaipur.png", dest: "public/images/services/spine.png" }
];

function downloadImage(url, dest) {
  const fullPath = path.join('d:', 'web', 'hospital-next', dest);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  console.log(`Downloading ${url} to ${dest}...`);
  try {
    execSync(`curl.exe -f -L "${url}" -o "${fullPath}"`, { stdio: 'ignore' });
  } catch (e) {
    console.error(`Failed to download ${url}: ${e.message}`);
  }
}

images.forEach(img => downloadImage(img.url, img.dest));
console.log("Image downloads finished.");
