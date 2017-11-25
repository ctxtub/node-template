const interfaceParamsValidate = require('../../lib/interfaceParamsValidate');

const test = (req, res, next) => {
  const needParams = [{
    name: 'devices',
    required: true,
    type: 'Array'
  }];

  interfaceParamsValidate(needParams, req, res)
    .then((data) => {

      redis.set('string key', 50, 'EX', 100)
        .then(data => {
          res.InterfaceResponse = new InterfaceResponse(0, data);
          res.json(res.InterfaceResponse);
        })
        .catch(err => {
          res.InterfaceResponse = new InterfaceResponse(40009, {}, err);
          res.json(res.InterfaceResponse);
          console.log(err);
        })

    })
    .catch((err) => {
      res.json(res.InterfaceResponse);
    });
};

module.exports = test;