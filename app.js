const express = require('express');
const log4js = require('log4js');
const app = express();
const interfaceParamsValidate = require('./lib/interfaceParamsValidate');

// public method set
InterfaceResponse = require('./lib/InterfaceResponse');
query = require('./lib/query');
redis = require('./lib/redis');

// logInstance for different service
loggerGlobal = require('./lib/log4js').logger('global');
loggerRouter = require('./lib/log4js').logger('router');
loggerApi = require('./lib/log4js').logger('api');
loggerSql = require('./lib/log4js').logger('sql');
loggerRedis = require('./lib/log4js').logger('redis');

// record interface request
app.use(log4js.connectLogger(loggerRouter, {level: 'auto', format: ':remote-addr - ":method :url" - :status - :response-timems'}));

app.use('/',(req, res, next) => {

  const needParams = [
    {
      name: 'devices',
      required: true,
      type: 'Array'
    }
  ];

  interfaceParamsValidate(needParams, req, res)
    .then((data) => {

      redis.set('string key', 50, 'EX', 100)
        .then(data => {
          res.InterfaceResponse = new InterfaceResponse(0 , data);
          res.json(res.InterfaceResponse);
        })
        .catch(err => {
          res.InterfaceResponse = new InterfaceResponse(40009 , {}, err);
          res.json(res.InterfaceResponse);
          console.log(err);
        })

    })
    .catch((err) => {
      res.json(res.InterfaceResponse);
    });
});

//listening port
let argv = {};
for (let i = 0; i < process.argv.length; i = i + 2) {
	argv[process.argv[i]] = process.argv[i + 1];
}
const port = argv['--PORT'] || '3000';

app.listen(port, '0.0.0.0');
loggerGlobal.info('端口已开启 : ' + port);