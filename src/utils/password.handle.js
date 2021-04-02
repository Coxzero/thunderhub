const crypto = require('crypto'); //自带库

const md5Password = (password) => {
  const md5 = crypto.createHash('md5'); //对象
  const result = md5.update(password).digest('hex');
  return result;
};
module.exports = md5Password;
