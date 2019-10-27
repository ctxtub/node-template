const fs = require('fs')
const path = require('path')
const router = require('koa-router')()
const axios = require('axios')
const loggerDefault = require('../../services/log4js')()
const { rootPath } = require('../../CONFIG')

class RouterMount {
  /**
   * 路由挂载入口
   *
   * @returns routes
   * @memberof RouterMount
   */
  mount () {
    const applications = this.getApplications()

    applications.map(appPath => {
      const { appRootPath, proxy, custom } = require(`${appPath}/index`)

      // 透传路径 路由挂载
      proxy && Object.entries(proxy).map(([path, target]) => {
        this.proxyMount(`${rootPath}${appRootPath}${path}`, target)
      })

      // 自定义Controller路径 路由挂载
      custom && Object.entries(custom).map(([path, ctrl]) => {
        this.customMount(`${rootPath}${appRootPath}${path}`, ctrl)
      })
    })

    return router.routes()
  }

  /**
   * 获取应用目录
   *
   * @returns {Array} 所有应用目录
   * @memberof RouterMount
   */
  getApplications () {
    const applications = []
    const rootDirPath = path.resolve(__dirname, '../../applications')
    const appDirs = fs.readdirSync(rootDirPath)

    appDirs.map(dir => {
      const dirPath = `${rootDirPath}/${dir}`
      const isDirectory = fs.lstatSync(dirPath).isDirectory()
      const haveIndexFile = fs.existsSync(`${dirPath}/index.js`)
      if (isDirectory && haveIndexFile) {
        applications.push(dirPath)
      }
    })

    loggerDefault.trace('挂载应用目录：', JSON.stringify(applications))

    return applications
  }

  /**
   * 挂载透传路由
   *
   * @param {*} path 接口路径
   * @param {*} target 透传接口路径
   * @memberof RouterMount
   */
  proxyMount (path, target) {
    loggerDefault.trace(`挂载透传路由：${path} -> ${target}`)
    router.all(path, async ctx => {
      const { method, headers } = ctx
      // 去除host项，防止https证书校验失败或接口跨域等问题
      delete headers.host
      const options = {
        method: method,
        url: target,
        // 透传源站cookie等信息
        headers: headers,
        params: ctx.query,
        // 目标接口的状态码在大于或等于500时，才会reject，并记录本次错误日志
        // 状态码500以下时，透传接口响应信息
        validateStatus: (status) => {
          return status < 500
        }
      }
      // post请求传请求体
      if (method.toLowerCase() === 'post') {
        options.data = ctx.request.body
      }
      const result = await axios(options)
      // 设置响应头信息以及数据
      ctx.set(result.headers)
      ctx.body = result.data
    })
  }

  /**
   * 挂载自定义controller路由
   *
   * @param {*} path 接口路径
   * @param {*} ctrl 接口对应controller
   * @memberof RouterMount
   */
  customMount (path, ctrl) {
    loggerDefault.trace(`挂载自定义路由：${path} -> ${ctrl}`)
    router.all(path, async ctx => {
      await ctrl(ctx)
    })
  }
}

module.exports = new RouterMount()
