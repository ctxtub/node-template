const mysql = require('mysql');
const pool = mysql.createPool(require('../config/config').mysql);

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

/*query(['select * from test where id = 1',
'INSERT INTO `0926test`.`test` ( `name`, `sex`) VALUES ( \'233333\', \'1\')',
'select * from test where id = 2'])
  .then(data => {
    console.log(data);
    console.log('事务成功！');
  })
  .catch(err => {
    console.log(err);
    console.log('事务失败！');
  })*/

/*query('select * from test')
  .then((data) => {
    console.log(data);
  }).catch((err) => {
    console.log(err);
  })*/

/*query(1)
  .then((data) => {
    console.log(data);
  }).catch((err) => {
    console.log(err);
  })*/
