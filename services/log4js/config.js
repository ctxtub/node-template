/**
 * log4js日志配置文件
 */
module.exports = {
  // 日志输出目标
  appenders: {
    // 输出到终端（在pm2环境下日志会被pm2收集到自身日志中）
    default: {
      type: 'stdout',
      layout: {
        type: 'pattern',
        pattern: '[%p] %c - %m'
      }
    }
  },
  // 日志类型
  categories: {
    // 默认类型
    default: {
      appenders: ['default'],
      level: 'trace'
    },
    // 路由类型
    router: {
      appenders: ['default'],
      level: 'trace'
    },
    // 接口类型
    api: {
      appenders: ['default'],
      level: 'trace'
    }
  },
  // 支持pm2
  pm2: true,
  disableClustering: true
}
