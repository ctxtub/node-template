const InterfaceResponse = require('./InterfaceResponse');

const interfaceParamsValidate = function(needParams, req, res){

  return new Promise((resolve, reject) => {
    res.userParams = {};
    res.tempData = {};
    const method = req.method;

    for (let i = 0; i < needParams.length; i++) {
      let paramValue  =null;
      const paramName = needParams[i].name;
      const paramType = needParams[i].type;
      const paramRule = needParams[i].rule;
      const paramRequired = needParams[i].required;

      // 参数提取
      if (method === 'GET') {
        paramValue = req.query[paramName];
      } else if (method === 'POST') {
        paramValue = req.body[paramName];
      } else {
        res.InterfaceResponse = new InterfaceResponse(40009);
        reject();
      }

      res.userParams[paramName] = paramValue;

      if (!paramRequired && !paramValue) {
        continue;
      }

      // 参数是否存在
      if (!paramValue) {
        res.InterfaceResponse = new InterfaceResponse(40009 , {}, '请提提供参数：' + paramName);
        reject();
      }

      // 参数类型判断
      if (paramType) {
        const preType = Object.prototype.toString.call(paramValue);
        const realType = preType.substring(8, preType.length-1);

        switch (paramType) {
          case 'Number':
            const typeVerifyResult = isNaN(Number(paramValue));
            if (typeVerifyResult) {
              res.InterfaceResponse = new InterfaceResponse(10001 , {}, paramName + '类型需为' + paramType);
              reject();
            };
            break;
          default:
            if (realType !== paramType) {
              res.InterfaceResponse = new InterfaceResponse(10001 , {}, paramName + '类型需为' + paramType);
              reject();
            };
        }
      }

      // 参数规则校验
      if (paramRule) {
        const ruleVerifyResult = ruleCollection[paramRule](paramValue);
        if (!ruleVerifyResult.result) {
          res.InterfaceResponse = new InterfaceResponse(10001 , {}, ruleVerifyResult.msg);
          reject();
        }
      }

    };

    resolve();
  });
};

let ruleCollection = {
  mobile: function (value) {
    const result = {};
    result.result = new RegExp('^(13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])\\d{8}$').test(value);
    result.msg = '请提供正确的手机号码';
    return result;
  },
  timeStr: function (value) {
    const result = {};
    if (new Date(value) === 'Invalid Date') {
      result.result = false;
    } else {
      result.result = true;
    }
    result.msg = '请提供正确的时间格式';
    return result;
  }
}

module.exports = interfaceParamsValidate;