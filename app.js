const path = require('path')
const Koa = require('koa')
const views = require('koa-views')
const parser = require('koa-bodyparser')
const koaStatic = require('koa-static')
const koaMount = require('koa-mount')
const app = new Koa()

const { port, rootPath } = require('./config/config.json')
const middlewares = require('./middlewares/index')
// const register = require('./common/register')

// 公共数据
app.use(
  async (ctx, next) => {
  // ejs模版中使用该变量动态加载对应模版
    ctx.state = { RUN_ENV: 'dev' }
    // 继续向下匹配路由
    await next()
  }
)

// 入口页-注意：必须放在路由注册前面
app.use(
  views(path.join(__dirname, '/'), {})
)
// post参数解析
app.use(parser())
// 自定义拦截器
middlewares(app)
// 模块注册
// app.use(register.launch())
// 静态资源支持
app.use(
  koaMount(`${rootPath}/static`, koaStatic(path.join(__dirname, './static')))
)

app.listen(port)

console.log('\n App running at:')
console.log(' - Local:   http://localhost:' + port)
