/**
 * 自定义环境变量
 *
 * @param {Object} ctx
 * @param {Function} next
 */
const index = () => async (ctx, next) => {
  // 存储自定义环境变量
  ctx.state = { CUSTOM_ENV: process.env.CUSTOM_ENV }
  // 继续向下匹配路由
  await next()
}

module.exports = index
