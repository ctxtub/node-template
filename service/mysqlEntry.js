const mysql = require('mysql');
const pool = mysql.createPool(require('../config/config').mysql);

pool.getConnection((err, connection) => {
  if (err) {
    loggerSql.error("mysql init err: " + err);
    return;
  }
  loggerSql.info("mysql init success!");
  connection.release();
}) 

const queryStr = function (sql) {

  return new Promise((resolve, reject) => {

    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      };

      connection.query(sql, (err, results, fields) => {
        if (err) {
          reject(err);
        };

        resolve(results);
        connection.release();
      });
    });

  });

}

const queryArr = function (sqlArr) {

  return new Promise((resolve, reject) => {

    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      };

      connection.beginTransaction(err => {
        if (err) {
          reject(err);
        }
        // void query methoad
        const query = function (sql) {

          return new Promise((resolve, reject) => {

            connection.query(sql, (err, results, fields) => {
              if (err) {
                reject(err);
              };
              resolve(results);
            });
        
          });
        }

        // deal sqls
        let queryFnArr = [];
        sqlArr.forEach(sql => {
          queryFnArr.push(query(sql));
        });

        // run sqls
        Promise.all(queryFnArr)
          .then(data => {

            connection.commit((err, result) => {
              if (err) {
                connection.rollback(function() {  
                  connection.release();
                });
                reject(err);
              }

              resolve({data: data, commitResult: result});
            })

          })
          .catch(err => {

            connection.rollback(function() {
              connection.release();
            });

            reject(err);
          });

      })
    });

  })

}

// entry
const query = function (originSql) {
  const preType = Object.prototype.toString.call(originSql);
  const realType = preType.substring(8, preType.length-1);
  let result;

  switch (realType) {
    case 'Array':
      result = queryArr(originSql);
      break;
    case 'String':
      result = queryStr(originSql);
      break;
    default:
      result = new Promise((resolve, reject) => {
        reject('sql不符合规则');
      });
  }

  return result;
}

module.exports = query;
