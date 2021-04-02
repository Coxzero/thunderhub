const errorType = require('../constants/err-types');
const service = require('../service/user.service');
const md5Password = require('../utils/password.handle');
const verifyUser = async (ctx, next) => {
  //1.获取用户名和密码
  const { name, password } = ctx.request.body;

  //2.判断应户名和密码不能为空

  if (!name || !password) {
    const err = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED);
    return ctx.app.emit('error', err, ctx);
  }

  //3.判断这次注册的用户是否注册过
  const result = await service.getUserByName(name);
  if (result.length) {
    const err = new Error(errorType.USER_ALREADY_EXISTS);
    return ctx.app.emit('error', err, ctx);
  }

  await next();
};

const handlePassword = async (ctx, next) => {
  let { password } = ctx.request.body;
  // password = 加密之后的密码
  ctx.request.body.password = md5Password(password);
  await next();
};
module.exports = { verifyUser, handlePassword };
