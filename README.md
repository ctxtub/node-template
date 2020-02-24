# node-template

这是一个Node.JS工程化模板。



## 基本功能

- [x] 自动挂载应用并注册路由
- [x] 基础参数配置化：端口 / 跟路径 / 日志等级 等
- [x] 错误捕获，友好地提示用户
- [x] 日志收集
- [ ] 数据持久化：redis（todo，可参考v1.0分支）
- [ ] 数据持久化：mysql（todo，可参考v1.0分支）



## 如何使用

### 配置基础参数

打开根目录下的 `CONFIG.js` 文件，一起来认识它吧。

```javascript
// 测试环境配置
const DEV_CONFIG = {
  // 运行端口
  port: 3000,
  // 服务的根路径（若自定义，路由会自动添加该路径作为前缀）
  // 未匹配路由返回404页面
  rootPath: '',
  // log4js日志等级
  logLevel: 'trace'
}

// 生产环境配置
const PROD_CONFIG = {
  port: 3000,
  rootPath: '/prod',
  logLevel: 'info'
}

```



### 初始化你的第一个应用

1. 首先找到它，`applications` 为应用根目录，内部可注册任意个应用。

2. 来看看第一个应用，打开 `myFirstApp`  目录。

3. 配置应用`index.js`文件。

   ```javascript
   const ctrl = require('./controllers/index')
   
   module.exports = {
     // 应用的根路径
     appRootPath: '/myFirstApp',
     proxy: {
       // 配置透传接口及路径
       // 当访问 http://localhost:3000/myFirstAppi/proxy 将返回所透传接口的结果
       '/i/proxy': 'https://www.zhihu.com/api/v3/explore/guest/feeds?limit=3'
     },
     custom: {
       // 自定义controller的接口配置在这儿配置
       '/': ctrl.testHtml
     }
   }
   
   ```

4. 将自己的ejs模板及controller配置好即可，示例项目中已配置完成。接下来启动项目吧。



###  用命令启动它

```shell
// 本地测试使用
npm run dev    // 使用测试环境配置
npm run prod   // 使用生产环境配置

// 服务器部署使用 PM2进程守护
npm run pm2:dev     // 使用测试环境配置
npm run pm2:prod    // 使用生产环境配置
```



### 进一步使用

像  `myFirstApp`   一样，在 `applications` 目录中创建多个应用吧。

具体实现可以参考目录结构，从而进行个性化的调整优化。



## 目录结构

```
  |-- CONFIG.js              // 基础配置文件（配置 端口 / 跟路径 / 日志等级 等）
  |-- app.js                 // 项目入口
  |-- package.json
  |-- pm2.config.js          // PM2配置
  |-- applications           // 应用目录
  |   |-- myFirstApp         // 示例应用
  |       |-- index.js       // 应用入口（配置 应用路径 / 透传接口 / 自定义路由）
  |       |-- controllers    // 应用controller
  |       |   |-- index.js
  |       |-- views          // 应用ejs模板
  |           |-- test.ejs
  |-- middlewares
  |   |-- index.js
  |   |-- catchError         // 错误捕获中间件
  |   |   |-- index.js
  |   |-- customEnv          // 环境变量设置中间件
  |       |-- index.js
  |-- services
  |   |-- log4js             // 日志采集
  |   |   |-- config.js
  |   |   |-- index.js
  |   |-- routerMount        // 路由挂载
  |       |-- index.js
  |-- static                 // 静态资源
  |   |-- logo.svg
  |-- views                  // 通用页面
      |-- 404.html
      |-- 500.html

```

