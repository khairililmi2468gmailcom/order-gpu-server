// src/controllers/adminController.js
import pool from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

export const getAllOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.*, u.name AS user_name, g.name AS package_name FROM orders o 
       JOIN users u ON o.user_id = u.id 
       JOIN gpu_packages g ON o.gpu_package_id = g.id`
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil semua pesanan' });
  }
};


export const verifyPayment = async (req, res) => {
  const { payment_id, status } = req.body;

  try {
    // Validasi status
    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status tidak valid' });
    }

    // Ambil data pembayaran
    const [paymentResult] = await pool.query('SELECT * FROM payments WHERE id = ?', [payment_id]);
    if (paymentResult.length === 0) {
      return res.status(404).json({ error: 'Payment ID tidak ditemukan' });
    }

    const payment = paymentResult[0];
    const verifiedAt = new Date();

    // Update tabel payments
    await pool.query(
      'UPDATE payments SET status = ?, verified_by = ?, verified_at = ? WHERE id = ?',
      [status, req.user.id, verifiedAt, payment_id]
    );

    // Jika status "verified", update status order + tambahkan gpu_token
    if (status === 'verified') {
      const gpuToken = uuidv4(); // Token unik
      await pool.query(
        'UPDATE orders SET status = ?, gpu_token = ? WHERE id = ?',
        ['approved', gpuToken, payment.order_id] // Update order status ke 'approved'
      );
    } else {
      // Kalau status "rejected", ubah status order menjadi "rejected"
      await pool.query(
        'UPDATE orders SET status = ? WHERE id = ?',
        ['rejected', payment.order_id]
      );
    }

    res.json({ message: `Pembayaran berhasil diverifikasi dengan status ${status}` });
  } catch (err) {
    console.error('Verify Payment Error:', err);
    res.status(500).json({ error: 'Gagal verifikasi pembayaran' });
  }
};
export const approveOrder = async (req, res) => {
  const { order_id, action } = req.body;

  try {
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [order_id]);
    if (!orders[0]) return res.status(404).json({ error: 'Pesanan tidak ditemukan' });

    if (action === 'approve') {
      const gpuToken = uuidv4();

      await pool.query(
        'UPDATE orders SET status = ?, gpu_token = ?, is_active = ? WHERE id = ?',
        ['approved', gpuToken, true, order_id]
      );

      res.json({ message: 'Pesanan disetujui', token: gpuToken });
    } else if (action === 'reject') {
      await pool.query(
        'UPDATE orders SET status = ? WHERE id = ?',
        ['rejected', order_id]
      );
      res.json({ message: 'Pesanan ditolak' });
    } else {
      res.status(400).json({ error: 'Aksi tidak valid' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Gagal memproses pesanan' });
  }
};

export const getTokens = async (req, res) => {
  try {
    const [tokens] = await pool.query('SELECT * FROM orders WHERE is_active = ?', [true]);
    res.json(tokens);
  } catch (err) {
    console.error('Get Tokens Error:', err);
    res.status(500).json({ error: 'Gagal mengambil aktivitas token' });
  }
};

export const deactivateToken = async (req, res) => {
  const { order_id } = req.body;

  try {
    const [order] = await pool.query('SELECT * FROM orders WHERE id = ?', [order_id]);
    if (!order[0]) return res.status(404).json({ error: 'Pesanan tidak ditemukan' });

    // Nonaktifkan token
    await pool.query(
      'UPDATE orders SET is_active = ? WHERE id = ?',
      [false, order_id]
    );

    res.json({ message: 'Token berhasil dinonaktifkan' });
  } catch (err) {
    console.error('Deactivate Token Error:', err);
    res.status(500).json({ error: 'Gagal menonaktifkan token' });
  }
};

export const getWebsiteStats = async (req, res) => {
  try {
    // Hitung jumlah pengunjung
    const [visitorCount] = await pool.query('SELECT COUNT(DISTINCT ip) AS visitor_count FROM access_log');
    
    // Hitung jumlah pengguna
    const [userCount] = await pool.query('SELECT COUNT(id) AS user_count FROM users');

    // Hitung jumlah pesanan
    const [orderCount] = await pool.query('SELECT COUNT(id) AS order_count FROM orders');

    // Hitung pendapatan yang dihasilkan
    const [totalRevenue] = await pool.query('SELECT SUM(total_cost) AS total_revenue FROM orders WHERE status = "approved"');

    res.json({
      visitorCount: visitorCount[0].visitor_count,
      userCount: userCount[0].user_count,
      orderCount: orderCount[0].order_count,
      totalRevenue: totalRevenue[0].total_revenue,
    });
  } catch (err) {
    console.error('Get Website Stats Error:', err);
    res.status(500).json({ error: 'Gagal mengambil statistik website' });
  }
};
