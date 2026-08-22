import fs from 'fs'
import path from 'path'

const artifactDir = "C:\\Users\\tanis\\.gemini\\antigravity-ide\\brain\\b199ff2c-e704-458e-9c9c-513074d76b57"
const targetDir = "d:\\hospital\\web\\balaji-hospital-nextjs\\public\\images\\facilities"

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true })
}

const files = fs.readdirSync(artifactDir)

const mapping = {
  reception: files.find(f => f.startsWith('hospital_reception_hd')),
  ot: files.find(f => f.startsWith('hospital_ot_hd')),
  room: files.find(f => f.startsWith('hospital_room_hd')),
  xray: files.find(f => f.startsWith('hospital_xray_hd')),
}

console.log("Found files:", mapping)

if (mapping.reception) {
  fs.copyFileSync(path.join(artifactDir, mapping.reception), path.join(targetDir, 'reception_new.jpg'))
}
if (mapping.ot) {
  fs.copyFileSync(path.join(artifactDir, mapping.ot), path.join(targetDir, 'ot_new.jpg'))
}
if (mapping.room) {
  fs.copyFileSync(path.join(artifactDir, mapping.room), path.join(targetDir, 'room_new.jpg'))
}
if (mapping.xray) {
  fs.copyFileSync(path.join(artifactDir, mapping.xray), path.join(targetDir, 'xray_new.jpg'))
}

console.log("Successfully copied facility images!")
