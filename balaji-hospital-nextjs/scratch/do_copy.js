const fs = require('fs');
const path = require('path');

const srcDir = "C:\\Users\\tanis\\.gemini\\antigravity-ide\\brain\\b199ff2c-e704-458e-9c9c-513074d76b57";
const destDir = "d:\\hospital\\web\\balaji-hospital-nextjs\\public\\images\\facilities";

const files = fs.readdirSync(srcDir);
console.log("Artifact files:", files);

const rec = files.find(f => f.startsWith('hospital_reception_hd'));
const ot = files.find(f => f.startsWith('hospital_ot_hd'));
const room = files.find(f => f.startsWith('hospital_room_hd'));
const xray = files.find(f => f.startsWith('hospital_xray_hd'));

if (rec) fs.copyFileSync(path.join(srcDir, rec), path.join(destDir, 'reception_new.jpg'));
if (ot) fs.copyFileSync(path.join(srcDir, ot), path.join(destDir, 'ot_new.jpg'));
if (room) fs.copyFileSync(path.join(srcDir, room), path.join(destDir, 'room_new.jpg'));
if (xray) fs.copyFileSync(path.join(srcDir, xray), path.join(destDir, 'xray_new.jpg'));

console.log("COPY COMPLETED SUCCESSFULLY!");
