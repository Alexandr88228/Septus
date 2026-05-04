const fs = require('fs');
const path = require('path');

const source = path.resolve(process.cwd(), 'public/admin');
const destination = path.resolve(process.cwd(), 'out/admin');

if (!fs.existsSync(source)) {
  console.warn('Sanity admin build was not found at public/admin. Skipping admin copy.');
  process.exit(0);
}

fs.rmSync(destination, { force: true, recursive: true });
fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.cpSync(source, destination, { recursive: true });

console.log('Copied Sanity admin to out/admin.');
