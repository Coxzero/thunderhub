/* 
评论权限相关
*/
const connection = require('../app/database');
class AuthService {
  async checkResource(tablename,id, userId) {
    try {
      const statement = `
        SELECT * FROM ${tablename} WHERE id=? AND user_id=?;
        `;
      const [result] =await connection.execute(statement, [id, userId]);
      return result.length ===0 ?false:true;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new AuthService();
