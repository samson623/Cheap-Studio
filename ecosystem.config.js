const fs = require('fs');
const path = require('path');

const appRoot = __dirname;
const logsDir = path.join(appRoot, 'logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

module.exports = {
  apps: [
    {
      name: 'cheap-studio',
      script: 'npm',
      args: 'start',
      cwd: appRoot,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: path.join(logsDir, 'pm2-error.log'),
      out_file: path.join(logsDir, 'pm2-out.log'),
      merge_logs: true,
    },
  ],
};
