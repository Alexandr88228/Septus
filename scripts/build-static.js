const { spawnSync } = require('child_process');

process.env.NEXT_OUTPUT = 'export';

const nextBin = process.platform === 'win32' ? 'next.cmd' : 'next';
const result = spawnSync(nextBin, ['build'], {
  env: process.env,
  stdio: 'inherit',
  shell: true,
});

process.exit(result.status ?? 1);
