import fs from "fs";
import { doctors } from "../src/data/doctors";
import { services } from "../src/data/services";

function run() {
  console.log("Generating SQL script...");
  let sql = "";

  // 1. Departments
  const departmentsMap = new Set<string>();
  services.forEach((s) => departmentsMap.add(s.category));
  doctors.forEach((d) => departmentsMap.add(d.department));
  
  const depNameToDb: Record<string, string> = {};
  
  Array.from(departmentsMap).forEach((dep, index) => {
    const slug = dep.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const id = `d${index + 1}000000-0000-0000-0000-000000000000`;
    depNameToDb[dep] = id;
    sql += `INSERT INTO public.departments (id, name, slug, description, is_active) VALUES ('${id}', '${dep.replace(/'/g, "''")}', '${slug}', 'Department of ${dep.replace(/'/g, "''")}', true) ON CONFLICT (id) DO NOTHING;\n`;
  });

  sql += "\n";

  // 2. Doctors
  doctors.forEach((doc, idx) => {
    const depId = depNameToDb[doc.department];
    const experience_years = parseInt(doc.experience.replace(/[^0-9]/g, '')) || 0;
    const qString = doc.qualifications.join(", ").replace(/'/g, "''");
    
    // Add missing doc id logic
    const safeBio = doc.description.replace(/'/g, "''");
    const safeName = doc.name.replace(/'/g, "''");
    
    sql += `INSERT INTO public.doctors (department_id, name, slug, qualification, experience_years, designation, bio, image_url, is_active) VALUES ('${depId}', '${safeName}', '${doc.id}', '${qString}', ${experience_years}, '${doc.specialty.replace(/'/g, "''")}', '${safeBio}', '${doc.image}', true) ON CONFLICT (id) DO NOTHING;\n`;
  });
  
  sql += "\n";

  // 3. Services
  services.forEach((srv) => {
    const depId = depNameToDb[srv.category];
    sql += `INSERT INTO public.services (department_id, title, slug, description, icon, image_url, is_active) VALUES ('${depId}', '${srv.title.replace(/'/g, "''")}', '${srv.id}', '${srv.description.replace(/'/g, "''")}', '${srv.icon}', '${srv.image}', true) ON CONFLICT (id) DO NOTHING;\n`;
  });

  fs.writeFileSync("scripts/inject.sql", sql);
  console.log("SQL script written to scripts/inject.sql");
}

run();

