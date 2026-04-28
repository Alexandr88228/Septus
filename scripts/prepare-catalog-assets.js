const fs = require('fs');
const path = require('path');

const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const ruToLat = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i',
  й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
  у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '',
  э: 'e', ю: 'yu', я: 'ya',
};

function toSlug(value) {
  return value
    .trim()
    .toLowerCase()
    .split('')
    .map((char) => ruToLat[char] || char)
    .join('')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const sourceRoot = path.join(process.cwd(), 'for site');
const targetRoot = path.join(process.cwd(), 'public', 'catalog-images');

if (!fs.existsSync(sourceRoot)) {
  console.log('Catalog source folder not found, skipping asset preparation.');
  process.exit(0);
}

fs.mkdirSync(targetRoot, { recursive: true });

let copied = 0;
for (const entry of fs.readdirSync(sourceRoot, { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name === 'Логотипы') continue;

  const folderPath = path.join(sourceRoot, entry.name);
  const targetFolder = path.join(targetRoot, toSlug(entry.name));
  fs.mkdirSync(targetFolder, { recursive: true });

  for (const file of fs.readdirSync(folderPath)) {
    if (!imageExtensions.has(path.extname(file).toLowerCase())) continue;
    fs.copyFileSync(path.join(folderPath, file), path.join(targetFolder, file));
    copied += 1;
  }
}

console.log(`Prepared ${copied} catalog image(s) in public/catalog-images.`);
