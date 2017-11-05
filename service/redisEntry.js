const redis = require('redis');
const client = redis.createClient(require('../config/config').redis);

client.on('error', (err) => {
  loggerRedis.error("redis init err: " + err);
})
client.on('connect', () => {
  loggerRedis.info("redis init success! ");
})
let redisFunction = {};

redisFunction.native = client;

redisFunction.set = function(key, val, expireUnits, expireTime) {
  return new Promise((resolve, reject) => {
    if (expireTime) {
      client.set(key, val, expireUnits, expireTime, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      })
    } else {
      client.set(key, val, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      })
    }
  })
};

redisFunction.get = function(key) {
  return new Promise((resolve, reject) => {
    client.get(key, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    })
  })
};

redisFunction.del = function(key) {
  return new Promise((resolve, reject) => {
    client.get(key, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    })
  })
};

redisFunction.expire = function(key, expireTime) {
  return new Promise((resolve, reject) => {
    client.expire(key, expireTime, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    })
  })
};

module.exports = redisFunction;
