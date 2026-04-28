const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

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
const logoSource = path.join(process.cwd(), 'public', 'for-site', 'Логотипы', 'NanoBanana_zameni-slovo-septus-na-septus_png.png');
const logoTarget = path.join(process.cwd(), 'public', 'logo.webp');

if (!fs.existsSync(sourceRoot)) {
  console.log('Catalog source folder not found, skipping asset preparation.');
  process.exit(0);
}

fs.mkdirSync(targetRoot, { recursive: true });

async function optimizeImage(sourcePath, targetPath, width = 900) {
  await sharp(sourcePath)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 76, effort: 4 })
    .toFile(targetPath);
}

async function main() {
  let optimized = 0;
  for (const entry of fs.readdirSync(sourceRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === 'Логотипы') continue;

    const folderPath = path.join(sourceRoot, entry.name);
    const targetFolder = path.join(targetRoot, toSlug(entry.name));
    fs.mkdirSync(targetFolder, { recursive: true });

    for (const file of fs.readdirSync(folderPath)) {
      if (!imageExtensions.has(path.extname(file).toLowerCase())) continue;
      const sourcePath = path.join(folderPath, file);
      const targetPath = path.join(targetFolder, `${toSlug(path.parse(file).name)}.webp`);
      await optimizeImage(sourcePath, targetPath);
      optimized += 1;
    }
  }

  if (fs.existsSync(logoSource)) {
    await optimizeImage(logoSource, logoTarget, 256);
    optimized += 1;
  }

  console.log(`Prepared ${optimized} optimized WebP image(s).`);
}

main().catch((error) => {
  console.error('Catalog asset preparation failed:', error);
  process.exit(1);
});
