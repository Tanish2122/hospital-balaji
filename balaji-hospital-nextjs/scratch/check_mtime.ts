import fs from 'fs';
import path from 'path';

const dir = 'public/images/gallery';
const files = fs.readdirSync(dir);
const fileStats = files.map(file => {
  const stat = fs.statSync(path.join(dir, file));
  return {
    name: file,
    mtime: stat.mtime,
    size: stat.size
  };
});

fileStats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

console.log("All files in gallery:");
fileStats.forEach(f => {
  console.log(`- ${f.name}: size=${f.size}, mtime=${f.mtime.toISOString()}`);
});
