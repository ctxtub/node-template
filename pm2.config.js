const { name } = require('./package.json')

module.exports = {
  apps: [{
    name,
    script: './app.js',
    exec_mode: 'cluster',
    instances: 0,
    max_memory_restart: '1G',
    autorestart: true,
    node_args: [],
    output: `/opt/log/${name}/output.log`,
    error: `/opt/log/${name}/error.log`,
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss.SSS',
    env: {
      NODE_ENV: 'production',
      CUSTOM_ENV: 'pord'
    },
    env_dev: {
      NODE_ENV: 'development', // 环境参数，当前指定为开发环境 pm2 start app.js --env_dev
      CUSTOM_ENV: 'dev'
    }
  }]
}
