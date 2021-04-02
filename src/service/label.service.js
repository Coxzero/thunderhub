const Connection = require('../app/database');

class LabelService {
  async create(name) {
    const statement = `
            INSERT INTO label (name) VALUES (?);
        `;
    const [result] = await Connection.execute(statement, [name]);
    return result;
  }
  async getLabelByName(name) {
    const statement = `
        SELECT * FROM label WHERE name=?;
      `;
    const [result] = await Connection.execute(statement, [name]);
    return result[0];
  }
  async getLabels(offset,limit) {
      const statement = `SELECT * FROM label LIMIT ?,?`
      const [result] = await Connection.execute(statement,[offset,limit])
      return result
  }
}
module.exports = new LabelService();
