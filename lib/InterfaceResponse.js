let InterfaceResponse = function(code, data, msg){
  let obj = {};
  obj.code = code;
  obj.data = data ? data : {};
  obj.msg = msg ? msg : InterfaceResponse.msgArr[code];

  return obj;
};

InterfaceResponse.msgArr = {
  0: 'ok',
  10001: '参数错误',
  10100: '计划重复',
  40009: '请求方式错误',
  50001: '服务器未知错误'
};

module.exports = InterfaceResponse;