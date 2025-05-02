import pool from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';
import { calculateTotalCost } from '../utils/calculateTotal.js';

export const createOrder = async (req, res) => {
  const { gpu_package_id, duration_hours } = req.body;
  const userId = req.user.id;

  try {
    // Validasi input awal
    if (!gpu_package_id || !duration_hours) {
      return res.status(400).json({ error: true, message: 'gpu_package_id dan duration_hours wajib diisi' });
    }

    if (typeof duration_hours !== 'number' || duration_hours <= 0) {
      return res.status(400).json({ error: true, message: 'Durasi harus berupa angka dan lebih dari 0' });
    }

    // Ambil data paket dari database
    const [gpuPackage] = await pool.query('SELECT * FROM gpu_packages WHERE id = ?', [gpu_package_id]);
    if (!gpuPackage[0]) {
      return res.status(404).json({ error: true, message: 'Paket tidak ditemukan' });
    }

    const packageData = gpuPackage[0];
    const minPeriodHours = packageData.min_period_hours || 1; // Default kalau null di DB

    // Validasi durasi sesuai paket
    if (duration_hours < minPeriodHours) {
      return res.status(400).json({
        error: true,
        message: `Durasi minimal untuk paket ini adalah ${minPeriodHours} Jam`
      });
    }

    // Hitung total biaya
    const totalCost = calculateTotalCost(packageData.price_per_hour, duration_hours);

    // Simpan pesanan
    const [result] = await pool.query(
      'INSERT INTO orders (user_id, gpu_package_id, duration_hours, total_cost, status) VALUES (?, ?, ?, ?, ?)',
      [userId, gpu_package_id, duration_hours, totalCost, 'pending_payment']
    );

    // Respon sukses
    res.status(201).json({ 
      error: false,
      orderId: result.insertId,
      totalCost: totalCost,
      message: 'Pesanan berhasil dibuat'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Gagal membuat pesanan' });
  }
};
