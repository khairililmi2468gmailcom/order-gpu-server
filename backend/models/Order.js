// models/Order.js
import db from '../config/db.js';

const Order = {
  // Fungsi untuk mencari pesanan berdasarkan ID
  async findById(id) {
    const [rows] = await db.query('SELECT * FROM orders WHERE id = ?', [id]);
    return rows[0];
  },

  // Fungsi untuk menemukan pesanan berdasarkan status
  async findByStatus(status) {
    const [rows] = await db.query('SELECT * FROM orders WHERE status = ?', [status]);
    return rows;
  },

  // Fungsi untuk menemukan pesanan berdasarkan user_id
  async findByUserId(user_id) {
    const [rows] = await db.query('SELECT * FROM orders WHERE user_id = ?', [user_id]);
    return rows;
  },

  // Fungsi untuk memperbarui status pesanan dan mengaktifkan token
  async updateOrderStatusAndToken(orderId, { status, token , domain}) {
    const [result] = await db.query(
      'UPDATE orders SET status = ?, token = ?, domain = ?, is_active = 1 WHERE id = ?',
      [status, token, domain, orderId]
    );
    return result;
  },

  // Fungsi untuk mencari pesanan dengan kondisi khusus
  async findActiveOrderWithToken() {
    const [rows] = await db.query(
      'SELECT * FROM orders WHERE is_active = 1 AND token IS NOT NULL'
    );
    return rows;
  },

  // Fungsi untuk mendapatkan semua pesanan
  async getAllOrders() {
    const [rows] = await db.query('SELECT * FROM orders');
    return rows;
  },
  
  // Fungsi untuk membuat pesanan baru
  async create({ user_id, gpu_package_id, duration_days, total_cost, status, token, start_date, end_date }) {
    const [result] = await db.query(
      'INSERT INTO orders (user_id, gpu_package_id, duration_days, total_cost, status, token, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [user_id, gpu_package_id, duration_days, total_cost, status, token, start_date, end_date]
    );
    return result;
  }
};

export default Order;
