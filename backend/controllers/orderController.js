import pool from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';
import { calculateTotalCost } from '../utils/calculateTotal.js';

export const createOrder = async (req, res) => {
  const { gpu_package_id, duration_days } = req.body;
  const userId = req.user.id;

  try {
    // Validasi durasi minimal 10 hari
    if (duration_days < 10) {
      return res.status(400).json({ error: 'Durasi minimal 10 hari' });
    }

    // Ambil harga paket berdasarkan GPU Package ID
    const [gpuPackage] = await pool.query('SELECT * FROM gpu_packages WHERE id = ?', [gpu_package_id]);
    if (!gpuPackage[0]) return res.status(404).json({ error: 'Paket tidak ditemukan' });

    // Hitung total biaya
    const totalCost = calculateTotalCost(gpuPackage[0].price_per_hour, duration_days);

    // Simpan pesanan ke database
    const [result] = await pool.query(
      'INSERT INTO orders (user_id, gpu_package_id, duration_days, total_cost, status) VALUES (?, ?, ?, ?, ?)',
      [userId, gpu_package_id, duration_days, totalCost, 'pending_payment']
    );

    // Kirimkan response dengan ID pesanan dan biaya total
    res.status(201).json({ 
      orderId: result.insertId,
      totalCost: totalCost,
      message: 'Pesanan berhasil dibuat' 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal membuat pesanan' });
  }
};
