module.exports = {
  apps: [
    {
      name: 'cheap-studio',
      script: 'npm',
      args: 'start',
      cwd: '/home/user/webapp',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/home/user/webapp/logs/pm2-error.log',
      out_file: '/home/user/webapp/logs/pm2-out.log',
      merge_logs: true
    }
  ]
};