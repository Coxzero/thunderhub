const errTypes = require('../constants/err-types');

const errHandle = (err, ctx) => {
  let status, message;

  switch (err.message) {
    case errTypes.NAME_OR_PASSWORD_IS_REQUIRED:
      status = 400; //bad request
      message = '用户名或者密码不能为空';
      break;
    case errTypes.USER_ALREADY_EXISTS:
      status = 409; //冲突
      message = '用户名已经存在~';
      break;
      case errTypes.USER_DOES_NOT_EXISTS:
      status = 400; //bad request
      message = '用户不存在~';
      break;
      case errTypes.UNAUTH_RIZATION:
      status = 401; //bad request
      message = '无效的token~';
      break;
      case errTypes.PASSWORD_IS_INCORRENT:
      status = 400; //bad request
      message = '密码不正确~';
      break;
      case errTypes.UNPERMISSION:
      status = 401; //bad request
      message = '您不具备操作的权限~';
      break;
    default:
      status = 404;
      message = 'NOT FOUND';
      
  }
  ctx.status = status;
  ctx.body = message;
  
};

module.exports = errHandle;
