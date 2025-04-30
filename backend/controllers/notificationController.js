// src/controllers/notificationController.js
import pool from '../config/db.js';

// GET /notifications - Ambil notifikasi milik user
export const getNotifications = async (req, res) => {
  const userId = req.user.id;

  try {
    const [notifications] = await pool.query(
      `SELECT id, message, status, created_at 
       FROM notifications 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil notifikasi' });
  }
};


// PUT /notifications/:id/read - Tandai notifikasi sebagai sudah dibaca
export const markNotificationAsRead = async (req, res) => {
    const userId = req.user.id;
    const notificationId = req.params.id;
  
    try {
      // Cek apakah notifikasi milik user
      const [rows] = await pool.query(
        `SELECT * FROM notifications WHERE id = ? AND user_id = ?`,
        [notificationId, userId]
      );
  
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Notifikasi tidak ditemukan' });
      }
  
      // Update status jadi read
      await pool.query(
        `UPDATE notifications SET status = 'read' WHERE id = ?`,
        [notificationId]
      );
  
      res.json({ message: 'Notifikasi ditandai sebagai sudah dibaca' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Gagal mengubah status notifikasi' });
    }
  };
  