const fs = require('fs');
const path = require('path');

const CRAWL_FILE = 'd:\\web\\hospital-next\\full_site_crawl.json';
const OUTPUT_MD = 'd:\\web\\hospital-next\\hospital_database.md';
const OUTPUT_JSON = 'd:\\web\\hospital-next\\hospital_database.json';

if (!fs.existsSync(CRAWL_FILE)) {
    console.error("Crawl file not found!");
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(CRAWL_FILE, 'utf8'));

const database = {
    doctors: [],
    services: [],
    facilities: [],
    departments: [],
    contact: {
        phones: [],
        emails: [],
        addresses: [],
        workingHours: ""
    },
    gallery: []
};

// Heuristic extraction
data.forEach(page => {
    // Contact Info
    const phoneMatches = page.text.match(/(?:\+91|0)?\s?[6-9]\d{4}\s?\d{5}/g);
    if (phoneMatches) database.contact.phones.push(...phoneMatches);
    
    const emailMatches = page.text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
    if (emailMatches) database.contact.emails.push(...emailMatches);

    // Doctors extraction from headings across all pages
    page.headings.forEach(h => {
        const docMatch = h.text.match(/Dr\.\s+[a-zA-Z\s]+/i);
        if (docMatch) {
            database.doctors.push({
                name: docMatch[0].replace(/"/g, '').trim(),
                url: page.url,
                specialty: h.level === 'h3' ? "Specialist" : ""
            });
        }
    });

    // Services / Departments
    if (page.url.includes('orthopedic') || page.url.includes('ent') || page.url.includes('speciality')) {
        const name = page.title.split('|')[0].replace(/balaji/i, '').trim();
        if (name) {
            database.services.push({
                name: name,
                url: page.url,
                category: page.url.split('/')[3] || "General"
            });
        }
    }

    // Facilities
    if (page.url.includes('facilities')) {
        page.headings.forEach(h => {
            if (h.level === 'h3' || h.level === 'h2') {
                database.facilities.push(h.text);
            }
        });
    }

    // Gallery
    if (page.url.includes('gallery')) {
        page.images.forEach(img => {
            if (img.src.includes('uploads')) {
                database.gallery.push(img);
            }
        });
    }
});

// Deduplicate
database.contact.phones = [...new Set(database.contact.phones)];
database.contact.emails = [...new Set(database.contact.emails)];
database.contact.addresses = [...new Set(database.contact.addresses)];
database.doctors = Array.from(new Set(database.doctors.map(d => JSON.stringify(d)))).map(s => JSON.parse(s));
database.services = Array.from(new Set(database.services.map(s => JSON.stringify(s)))).map(s => JSON.parse(s));
database.facilities = [...new Set(database.facilities)];
database.gallery = Array.from(new Set(database.gallery.map(i => JSON.stringify(i)))).map(s => JSON.parse(s));

// Write JSON
fs.writeFileSync(OUTPUT_JSON, JSON.stringify(database, null, 2));

// Generate Markdown
let md = `# Balaji Hospital Content Database\n\n`;

md += `## 👨‍⚕️ Doctors\n`;
database.doctors.forEach(d => md += `- [${d.name}](${d.url}) - ${d.specialty}\n`);

md += `\n## 🏥 Services & Departments\n`;
const grouped = database.services.reduce((acc, s) => {
    acc[s.category] = acc[s.category] || [];
    acc[s.category].push(s);
    return acc;
}, {});
for (const cat in grouped) {
    md += `### ${cat.toUpperCase()}\n`;
    grouped[cat].forEach(s => md += `- [${s.name}](${s.url})\n`);
}

md += `\n## 🔧 Facilities\n`;
database.facilities.forEach(f => md += `- ${f}\n`);

md += `\n## 📞 Contact Details\n`;
md += `- **Phones**: ${database.contact.phones.join(', ')}\n`;
md += `- **Emails**: ${database.contact.emails.join(', ')}\n`;
md += `- **Address**: ${database.contact.addresses.join(', ')}\n`;

md += `\n## 🖼️ Gallery Preview\n`;
database.gallery.slice(0, 10).forEach(img => md += `![${img.alt}](${img.src})\n`);

fs.writeFileSync(OUTPUT_MD, md);
console.log("Database generated successfully.");
