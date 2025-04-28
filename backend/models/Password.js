// models/User.js
import db from '../config/db.js';

const Password = {
  async findById(id) {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  async updateById(id, {  password }) {
    const [result] = await db.query(
      'UPDATE users SET  password = ? WHERE id = ?',
      [password, id]
    );
    return result;
  }
};

export default Password;
