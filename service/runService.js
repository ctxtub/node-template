const apiRouter = require('./routerApiActivate.js');
const mysqlEntry = require('./mysqlEntry.js');
const redisEntry = require('./redisEntry.js');

module.exports = {
  apiRouter,
  mysqlEntry,
  redisEntry
};