import pool from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';
import { calculateTotalCost } from '../utils/calculateTotal.js';
import Order from '../models/Order.js';

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

    // Ambil data paket dari database, termasuk stock_available
    const [gpuPackage] = await pool.query('SELECT * FROM gpu_packages WHERE id = ?', [gpu_package_id]);
    if (!gpuPackage[0]) {
      return res.status(404).json({ error: true, message: 'Paket GPU tidak ditemukan.' });
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

    // --- Penambahan Logika Pemeriksaan Stok ---
    if (packageData.stock_available <= 0) {
      return res.status(400).json({ error: true, message: 'Maaf, stok GPU untuk paket ini sedang tidak tersedia.' });
    }
    // --- Akhir Penambahan Logika Pemeriksaan Stok ---


    // Hitung total biaya
    // This is where totalCost is correctly calculated.
    const totalCost = calculateTotalCost(packageData.price_per_hour, duration_hours);

    // Mulai transaksi untuk memastikan konsistensi data
    await pool.query('START TRANSACTION');

     try {
      // Kurangi stok GPU yang tersedia
      await pool.query('UPDATE gpu_packages SET stock_available = stock_available - 1 WHERE id = ?', [gpu_package_id]);

      // Simpan pesanan menggunakan model Order
      const result = await Order.create({
        user_id: userId,
        gpu_package_id,
        duration_hours,
        // FIX: Change 'total_cost' to 'totalCost' to match the variable declaration above
        total_cost: totalCost, // <-- This line was changed
        status: 'pending_payment'
      });

      // Commit transaksi jika semua berhasil
      await pool.query('COMMIT');

      // Respon sukses
      res.status(201).json({
        error: false,
        orderId: result.insertId,
        totalCost: totalCost,
        message: 'Pesanan berhasil dibuat.'
      });

    } catch (transactionError) {
      // Rollback transaksi jika terjadi kesalahan
      await pool.query('ROLLBACK');
      console.error('Transaction Error during order creation:', transactionError); // Log error transaksi
      res.status(500).json({ error: true, message: 'Gagal membuat pesanan akibat kesalahan transaksi.' });
    }

  } catch (err) {
    console.error('Error creating order:', err); // Log error umum
    res.status(500).json({ error: true, message: 'Gagal membuat pesanan.' });
  }
};