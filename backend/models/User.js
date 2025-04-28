// models/User.js
import db from '../config/db.js';

const User = {
  async findById(id) {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  async updateById(id, { name, email, phone }) {
    const [result] = await db.query(
      'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?',
      [name, email, phone, id]
    );
    return result;
  }
};

export default User;
