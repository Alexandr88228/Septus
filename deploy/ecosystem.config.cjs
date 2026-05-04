/**
 * PM2: запуск Next.js в production (порт 3002 как в package.json).
 * На сервере: pm2 start deploy/ecosystem.config.cjs
 * cwd должен указывать на корень репозитория (где лежит package.json).
 */
const path = require("path");

const appRoot = path.resolve(__dirname, "..");

module.exports = {
  apps: [
    {
      name: "septus",
      cwd: appRoot,
      script: "npm",
      args: "run start",
      interpreter: "none",
      instances: 1,
      autorestart: true,
      max_memory_restart: "900M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
