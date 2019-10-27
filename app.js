const path = require('path')
const Koa = require('koa')
const views = require('koa-views')
const bodyParser = require('koa-bodyparser')
const koaStatic = require('koa-static')
const koaMount = require('koa-mount')
const app = new Koa()

const CONFIG = require('./CONFIG')
const middlewares = require('./middlewares/index')
const loggerDefault = require('./services/log4js')()
const routes = require('./services/routerMount').mount()

// 加载模板引擎
app.use(
  views(path.join(__dirname, '/'), {
    extension: 'ejs'
  })
)
// post参数解析
app.use(bodyParser())
// 自定义拦截器
middlewares(app)
// 注册路由
app.use(routes)
// 注册静态资源路由
app.use(
  koaMount(`${CONFIG.rootPath}/static`, koaStatic(path.join(__dirname, './static')))
)

app.listen(CONFIG.port)

loggerDefault.info(`运行环境：${process.env.CUSTOM_ENV}`)
loggerDefault.info(`运行配置：${JSON.stringify(CONFIG)}`)

console.log('\n App running at:')
console.log(` - Local:   http://localhost:${CONFIG.port}${CONFIG.rootPath}`)
