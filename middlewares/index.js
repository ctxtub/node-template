const catchError = require('./catchError')

module.exports = (app) => {
  // 访问日志 & 状态码处理 & Node错误记录
  app.use(catchError())
}
