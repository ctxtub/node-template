const loggerDefault = require('../../services/log4js')()
const loggerRouter = require('../../services/log4js')('router')

/**
 * 记录访问日志方法
 *
 * @param {String} enterTimestamp 时间戳
 * @param {Object} ctx
 */
const accessLogger = (enterTimestamp, ctx) => {
  const { request, response } = ctx
  const { method, url, origin, ip, header } = request
  const { status } = response
  const responseTime = new Date().getTime() - enterTimestamp

  loggerRouter.info(`${method} ${url} ${status} ${responseTime}ms ${origin} ${ip} ${header['user-agent']}`)
}

/**
 * 访问日志 & 状态码处理 & Node错误记录
 *
 * @param {Object} ctx
 * @param {Function} next
 */
const index = () => async (ctx, next) => {
  const enterTimestamp = new Date().getTime()

  try {
    await next()
    // 状态码为404时，抛错由catch处理
    if (ctx.status === 404) {
      ctx.throw(404)
    }
    accessLogger(enterTimestamp, ctx)
  } catch (err) {
    // 为状态码赋值
    const status = err.status || 500
    ctx.status = status
    accessLogger(enterTimestamp, ctx)

    // 状态码特殊处理
    switch (status) {
      case 404:
        // 渲染404页面
        await ctx.render('views/404.html')
        break
      case 500:
        // 记录Node错误
        loggerDefault.error(err)
        // 渲染500页面
        await ctx.render('views/500.html')
        break
    }
  }
}

module.exports = index
