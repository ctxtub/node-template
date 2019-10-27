const ctrl = require('./controllers/index')

module.exports = {
  appRootPath: '/myFirstApp',
  proxy: {
    '/i/proxy': 'https://api.douban.com/v2/movie/in_theaters'
  },
  custom: {
    '/': ctrl.testHtml
  }
}
