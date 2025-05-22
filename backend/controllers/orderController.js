// src/controllers/orderController.js
import pool from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';
import { calculateTotalCost } from '../utils/calculateTotal.js';
import Order from '../models/Order.js';
import User from '../models/User.js'; // <-- Tambahkan import ini untuk model User
import { notifyAdminOfNewOrder } from '../utils/notification.js'; // <-- Tambahkan import ini

export const createOrder = async (req, res) => {
  const { gpu_package_id, duration_hours } = req.body;
  const userId = req.user.id; // Asumsi req.user.id tersedia dari middleware autentikasi

  try {
    // Input validation
    if (!gpu_package_id || !duration_hours) {
      return res.status(400).json({ error: true, message: 'gpu_package_id dan duration_hours wajib diisi' });
    }

    if (typeof duration_hours !== 'number' || duration_hours <= 0) {
      return res.status(400).json({ error: true, message: 'Durasi harus berupa angka dan lebih dari 0' });
    }

    // Retrieve package data from the database, including stock_available
    const [gpuPackage] = await pool.query('SELECT * FROM gpu_packages WHERE id = ?', [gpu_package_id]);
    if (!gpuPackage[0]) {
      return res.status(404).json({ error: true, message: 'Paket GPU tidak ditemukan.' });
    }
    const packageData = gpuPackage[0];

    // --- Ambil data user untuk notifikasi admin (nama, email, telepon) ---
    const [userResult] = await pool.query('SELECT name, email, phone FROM users WHERE id = ?', [userId]);
    if (!userResult[0]) {
      // Ini seharusnya tidak terjadi jika autentikasi berfungsi dengan baik
      return res.status(404).json({ error: true, message: 'Pengguna tidak ditemukan.' });
    }
    const userData = userResult[0];
    // --- Akhir pengambilan data user ---

    const minPeriodHours = packageData.min_period_hours || 1; // Default if null in DB

    // Validate duration based on package's minimum period
    if (duration_hours < minPeriodHours) {
      return res.status(400).json({
        error: true,
        message: `Durasi minimal untuk paket ini adalah ${minPeriodHours} Jam`
      });
    }

    // --- Stock Availability Check (Still important to prevent orders for out-of-stock items) ---
    if (packageData.stock_available <= 0) {
      return res.status(400).json({ error: true, message: 'Maaf, stok GPU untuk paket ini sedang tidak tersedia.' });
    }
    // --- End of Stock Availability Check ---

    // Calculate total cost (Pastikan fungsi calculateTotalCost tersedia di scope ini)
    const totalCost = calculateTotalCost(packageData.price_per_hour, duration_hours);

    // Start transaction to ensure data consistency for order creation
    await pool.query('START TRANSACTION');

    try {
      // --- REMOVED: Stock reduction logic is removed from here ---
      // await pool.query('UPDATE gpu_packages SET stock_available = stock_available - 1 WHERE id = ?', [gpu_package_id]);

      // Save the order using the Order model
      const result = await Order.create({
        user_id: userId,
        gpu_package_id,
        duration_hours,
        total_cost: totalCost,
        status: 'pending_payment' // Order status set to pending payment
      });

      // Commit transaction jika semua berhasil
      await pool.query('COMMIT');

      // --- Kirim notifikasi ke admin setelah pesanan berhasil dibuat ---
      await notifyAdminOfNewOrder(result.insertId, packageData, userData, totalCost, duration_hours);
      // --- Akhir notifikasi admin ---

      // Success response
      res.status(201).json({
        error: false,
        orderId: result.insertId,
        totalCost: totalCost,
        message: 'Pesanan berhasil dibuat dan menunggu pembayaran.' // Updated message
      });

    } catch (transactionError) {
      // Rollback transaction if an error occurs
      await pool.query('ROLLBACK');
      console.error('Transaction Error during order creation:', transactionError); // Log transaction error
      res.status(500).json({ error: true, message: 'Gagal membuat pesanan akibat kesalahan transaksi.' });
    }

  } catch (err) {
    console.error('Error creating order:', err); // Log general error
    res.status(500).json({ error: true, message: 'Gagal membuat pesanan.' });
  }
};
