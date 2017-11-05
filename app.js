const express = require('express');
const log4js = require('log4js');
const runService = require('./service/runService');
const app = express();

// public method set
InterfaceResponse = require('./lib/InterfaceResponse');

// logInstance for different service
loggerGlobal = require('./lib/log4js').logger('global');
loggerRouter = require('./lib/log4js').logger('router');
loggerApi = require('./lib/log4js').logger('api');
loggerSql = require('./lib/log4js').logger('sql');
loggerRedis = require('./lib/log4js').logger('redis');

// record interface request
app.use(log4js.connectLogger(loggerRouter, {level: 'auto', format: ':remote-addr - ":method :url" - :status - :response-timems'}));

// database entry
mysql = runService.mysqlEntry;
redis = runService.edisEntry;

// set api router
app.use('/api', runService.apiRouter);

//listening port
let argv = {};
for (let i = 0; i < process.argv.length; i = i + 2) {
	argv[process.argv[i]] = process.argv[i + 1];
}
const port = argv['--PORT'] || '3000';

app.listen(port, '0.0.0.0');
loggerGlobal.info('端口已开启 : ' + port);