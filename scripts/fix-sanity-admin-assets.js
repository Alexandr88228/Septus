const fs = require('fs');
const path = require('path');

const outputDir = process.argv[2] || path.join('out', 'admin');
const adminIndexPath = path.join(process.cwd(), outputDir, 'index.html');

if (!fs.existsSync(adminIndexPath)) {
  console.warn('Sanity admin index.html was not found, skipping asset path fix.');
  process.exit(0);
}

const html = fs.readFileSync(adminIndexPath, 'utf8');
const fixedHtml = html
  .replaceAll('href="/admin/static/', 'href="./static/')
  .replaceAll('src="/admin/static/', 'src="./static/')
  .replaceAll('href="/static/', 'href="./static/')
  .replaceAll('src="/static/', 'src="./static/');

fs.writeFileSync(adminIndexPath, fixedHtml);
console.log('Sanity admin asset paths fixed for /admin deployment.');
