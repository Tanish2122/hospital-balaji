import fs from 'fs';
import path from 'path';

const dir = 'public/images/facilities';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpeg') || f.endsWith('.png'));

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Gallery Images</title>
  <style>
    body { font-family: sans-serif; background: #f0f2f5; padding: 20px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
    .card { background: white; padding: 10px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); text-align: center; }
    img { max-width: 100%; height: 180px; object-fit: cover; border-radius: 4px; }
    p { font-size: 12px; word-break: break-all; margin: 10px 0 0 0; }
  </style>
</head>
<body>
  <h1>Uploaded WhatsApp Images</h1>
  <div class="grid">
    ${files.map(file => `
      <div class="card">
        <img src="${file}" />
        <p>${file}</p>
      </div>
    `).join('')}
  </div>
</body>
</html>
`;

fs.writeFileSync(path.join(dir, 'index.html'), htmlContent);
console.log("Generated index.html successfully!");
