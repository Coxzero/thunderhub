const jwt = require('jsonwebtoken');

const errorType = require('../constants/err-types');
const userService = require('../service/user.service');
const authService = require('../service/auth.service');
const md5Password = require('../utils/password.handle');
const { PUBLIC_KEY } = require('../app/config');

const verifyLogin = async (ctx, next) => {
  const { name, password } = ctx.request.body;

  //判断用户名和密码是否为空
  if (!name || !password) {
    const err = new Error(errorType.NAME_OR_PASSWORD_IS_REQUIRED);
    return ctx.app.emit('error', err, ctx);
  }

  //判断用户名是否存在
  const result = await userService.getUserByName(name);
  let user = result[0];
  if (!user) {
    const err = new Error(errorType.USER_DOES_NOT_EXISTS);
    return ctx.app.emit('error', err, ctx);
  }
  //判断密码是否和数据库中的密码一致（加密）
  if (md5Password(password) !== user.password) {
    const err = new Error(errorType.PASSWORD_IS_INCORRENT);
    return ctx.app.emit('error', err, ctx);
  }

  ctx.user = user;
  await next();
};

const verifyAuth = async (ctx, next) => {
  console.log('验证授权的middleware');
  //获取token
  const authorization = ctx.headers.authorization;
  if (!authorization) {
    const error = new Error(errorType.UNAUTH_RIZATION);
    return ctx.app.emit('error', error, ctx);
  }
  const token = authorization.replace('Bearer ', '');

  //验证token
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ['RS256'],
    });
    ctx.user = result;
    await next();
  } catch (err) {
    const error = new Error(errorType.UNAUTH_RIZATION);
    ctx.app.emit('error', error, ctx);
  }
};
//修改评论权限
/* 
  接口：属于业务接口
*/
const verifyPermission = async (ctx, next) => {
  //获取权限
  const [resourceKey] = Object.keys(ctx.params);
  const tablename = resourceKey.replace('Id', '');
  const resourceId = ctx.params[resourceKey];
  const { id } = ctx.user;
  //2.查询是否具备权限
  try {
    const isPermission = await authService.checkResource(tablename, resourceId, id);
    if (!isPermission) throw new Error();
    await next();
  } catch (err) {
    const error = new Error(errorType.UNPERMISSION);
    return ctx.app.emit('error', error, ctx);
  }
};

module.exports = {
  verifyLogin,
  verifyAuth,
  verifyPermission,
};
