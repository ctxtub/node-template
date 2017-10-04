const redis = require('redis');
const client = redis.createClient(require('../config/config').redis);

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


// client.set("string key", "string val", redis.print);

// this.expire('string key', 50).then(res=> {
//   console.log(res);
// }).catch(err => {
//   console.log(err);
// })


// client.set("string key", "string val", redis.print);

// client.hset("hash key", "hashtest 1", "some value", redis.print);
// client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
// client.hkeys("hash key", function (err, replies) {
//     console.log(replies.length + " replies:");
//     replies.forEach(function (reply, i) {
//         console.log("    " + i + ": " + reply);
//     });
//     client.quit();
// });