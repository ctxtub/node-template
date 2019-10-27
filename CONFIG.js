const DEV_CONFIG = {
  // 运行端口
  port: 3000,
  // 服务根路径（若自定义，路由会自动添加该路径作为前缀，非根路径下路由进入404页面）
  rootPath: '',
  // log4js日志等级
  logLevel: 'trace',
  mysql: {

  },
  redis: {

  }
}
const PROD_CONFIG = {
  port: 3000,
  rootPath: '/prod',
  logLevel: 'info',
  mysql: {

  },
  redis: {

  }
}

const CONFIG = process.env.CUSTOM_ENV === 'dev' ? DEV_CONFIG : PROD_CONFIG

module.exports = CONFIG
