const express = require('express');
let apiRouter = express.Router();
const fs = require('fs');
const path = require('path');

const routerPath = path.resolve(__dirname , '../router');
const routerDirArr = fs.readdirSync(routerPath);

const routerDirPathArr = routerDirArr.map(dir => {
  return {
            name: dir,
            path: path.resolve(routerPath , dir)
         };
});

routerDirPathArr.forEach(dirObj => {
  dirObj.files = fs.readdirSync(dirObj.path);

  dirObj.files.forEach(file => {
    filePath = dirObj.path + '/' + file;
    const router = require(filePath);

    if (typeof router === 'function') {
      apiRouter[dirObj.name]('/' + file.split('.')[0], router);
    }
  })
});

console.log(routerDirPathArr);

module.exports = apiRouter;
