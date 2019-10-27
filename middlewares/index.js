const catchError = require('./catchError')
const env = require('./customEnv')

module.exports = (app) => {
  // 环境变量
  app.use(env())
  // 访问日志 & 状态码处理 & Node错误记录
  app.use(catchError())
}
