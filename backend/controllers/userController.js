// src/controllers/userController.js
import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

export const getMyOrders = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const [orders] = await pool.query(
      `SELECT 
         o.*, 
         g.name AS package_name, 
         p.proof_url, 
         p.status AS payment_status, 
         p.verified_by 
       FROM orders o
       JOIN gpu_packages g ON o.gpu_package_id = g.id
       LEFT JOIN payments p ON p.order_id = o.id
       WHERE o.user_id = ?`,
      [req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
};



export const getGpuToken = async (req, res) => {
  const { id } = req.params; // Mendapatkan id pesanan dari parameter URL
  const userId = req.user.id; // Mendapatkan id pengguna dari token JWT

  try {
    // Query untuk mencari pesanan dengan id dan user_id yang sesuai
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [id, userId]);
    const order = orders[0]; // Mengambil pesanan pertama

    // Jika pesanan tidak ditemukan, kirimkan respons 404
    if (!order) {
      return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
    }

    // Menangani setiap status pesanan
    switch (order.status) {
      case 'pending_payment':
        return res.status(400).json({ error: 'Pesanan masih menunggu pembayaran' });
      case 'pending_approval':
        return res.status(400).json({ error: 'Pesanan masih menunggu persetujuan' });
      case 'rejected':
        return res.status(403).json({ error: 'Pesanan telah ditolak' });
      case 'approved':
        // Jika statusnya approved, kembalikan token GPU
        return res.json({ token: order.gpu_token });
      case 'active':
        return res.json({ token: order.gpu_token });
      case 'completed':
        return res.status(403).json({ error: 'Pesanan telah selesai' });
      default:
        return res.status(400).json({ error: 'Status pesanan tidak valid' });
    }
  } catch (err) {
    // Jika ada kesalahan pada query atau server, kirimkan respons 500
    res.status(500).json({ error: 'Gagal mengambil token' });
  }
};


// src/controllers/userController.js
export const deleteOrder = async (req, res) => {
  const orderId = req.params.id;
  const userId = req.user.id;

  try {
    // Periksa apakah order milik user yang sedang login
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [orderId, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order tidak ditemukan atau bukan milik Anda' });
    }

    // Hapus pembayaran terkait jika ada
    await pool.query('DELETE FROM payments WHERE order_id = ?', [orderId]);

    // Hapus order
    await pool.query('DELETE FROM orders WHERE id = ?', [orderId]);

    res.json({ message: 'Order berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menghapus order' });
  }
};

export const updateProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, email, phone } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name dan email wajib diisi' });
  }

  try {
    await pool.query(
      'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?',
      [name, email, phone || null, userId]
    );
    res.json({ message: 'Profil berhasil diperbarui' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal memperbarui profil' });
  }
};

export const updatePassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Password lama dan baru wajib diisi' });
  }

  try {
    const [users] = await pool.query('SELECT password FROM users WHERE id = ?', [userId]);
    const user = users[0];

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Password lama salah' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, userId]);

    res.json({ message: 'Password berhasil diperbarui' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal memperbarui password' });
  }
};

