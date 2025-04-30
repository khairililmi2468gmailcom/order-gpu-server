// models/Notification.js
import db from '../config/db.js';

const Notification = {
  // Fungsi untuk membuat notifikasi baru
  async create({ user_id, message }) {
    const [result] = await db.query(
      'INSERT INTO notifications (user_id, message, status) VALUES (?, ?, ?)',
      [user_id, message, 'unread']
    );
    return result;
  },

  // Fungsi untuk mengambil semua notifikasi berdasarkan user_id
  async findByUserId(user_id) {
    const [rows] = await db.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [user_id]
    );
    return rows;
  },

  // Fungsi untuk menandai notifikasi sebagai 'read'
  async markAsRead(notification_id) {
    const [result] = await db.query(
      'UPDATE notifications SET status = "read" WHERE id = ?',
      [notification_id]
    );
    return result;
  },

  // Fungsi untuk menghapus notifikasi
  async deleteById(notification_id) {
    const [result] = await db.query('DELETE FROM notifications WHERE id = ?', [notification_id]);
    return result;
  }
};

export default Notification;
