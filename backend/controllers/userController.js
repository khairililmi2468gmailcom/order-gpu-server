// src/controllers/userController.js
import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import Order from '../models/Order.js';

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
  const userId = req.user.id; // Asumsi req.user.id tersedia dari middleware autentikasi

  try {
    // Periksa apakah order milik user yang sedang login dan ambil detailnya
    const [orders] = await pool.query(
      'SELECT id, is_active, status FROM orders WHERE id = ? AND user_id = ?',
      [orderId, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: 'Order tidak ditemukan atau bukan milik Anda' });
    }

    const orderToDelete = orders[0];

    // --- Penambahan Logika Validasi Status Aktif, Approved, dan Completed ---
    // Pesanan tidak bisa dihapus jika is_active = 1 DAN status = 'active'
    // ATAU jika status adalah 'approved' ATAU 'completed'
    if (orderToDelete.is_active === 1 && orderToDelete.status === 'active' ||
        orderToDelete.status === 'approved' ||
        orderToDelete.status === 'completed') {
      return res.status(400).json({ error: 'Pesanan tidak dapat dihapus karena sudah diproses atau aktif.' });
    }
    // --- Akhir Penambahan Logika Validasi ---

    // Mulai transaksi untuk memastikan atomisitas penghapusan
    await pool.query('START TRANSACTION');

    try {
      // Hapus pembayaran terkait jika ada
      await pool.query('DELETE FROM payments WHERE order_id = ?', [orderId]);

      // Hapus order
      await pool.query('DELETE FROM orders WHERE id = ?', [orderId]);

      await pool.query('COMMIT'); // Commit transaksi jika semua berhasil

      res.json({ message: 'Order berhasil dihapus' });
    } catch (transactionError) {
      await pool.query('ROLLBACK'); // Rollback jika ada kesalahan dalam transaksi
      console.error('Transaction Error during order deletion:', transactionError);
      // Mengirim pesan kesalahan transaksi yang lebih spesifik ke frontend
      res.status(500).json({ error: `Gagal menghapus order akibat kesalahan transaksi: ${transactionError.message || transactionError}` });
    }

  } catch (err) {
    console.error('Error deleting order:', err);
    // Mengirim pesan kesalahan umum yang lebih spesifik ke frontend
    res.status(500).json({ error: `Gagal menghapus order: ${err.message || err}` });
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


export const startUsage = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId); // Mengambil detail order

    if (!order) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan.' });
    }

    // Periksa jika pesanan sudah aktif atau belum disetujui
    if (order.is_active === 1) {
      return res.status(200).json({ message: 'Waktu penggunaan pesanan sudah dimulai sebelumnya.', order });
    }
    if (order.status !== 'approved') {
        return res.status(400).json({ message: 'Pesanan belum disetujui untuk dimulai.' });
    }

    // Mulai transaksi untuk atomisitas
    await pool.query('START TRANSACTION');

    try {
      // --- DIHAPUS: Logika pemeriksaan dan pengurangan stok GPU ---
      // Logika ini sekarang ditangani di fungsi verifyPayment (saat status 'verified')
      // const [gpuPackage] = await pool.query('SELECT stock_available FROM gpu_packages WHERE id = ? FOR UPDATE', [order.gpu_package_id]);
      // if (!gpuPackage || gpuPackage.length === 0) {
      //   throw new Error('Paket GPU tidak ditemukan atau sudah dihapus.');
      // }
      // if (gpuPackage[0].stock_available <= 0) {
      //   throw new Error('Stok GPU tidak tersedia untuk memulai pesanan ini.');
      // }
      // await pool.query('UPDATE gpu_packages SET stock_available = stock_available - 1 WHERE id = ?', [order.gpu_package_id]);
      // --- AKHIR DIHAPUS ---

      // Perbarui detail pesanan: set tanggal mulai, tanggal berakhir, aktifkan, dan ubah status
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + order.duration_hours * 60 * 60 * 1000); // Menghitung end_date

      const updateResult = await Order.findByIdAndUpdate(orderId, {
        start_date: startDate,
        end_date: endDate,
        is_active: 1, // Set aktif
        status: 'active' // Ubah status menjadi 'active'
      });

      if (updateResult.affectedRows === 0) {
        throw new Error('Gagal memperbarui status pesanan.');
      }

      // Commit transaksi jika semua berhasil
      await pool.query('COMMIT');

      const updatedOrder = await Order.findById(orderId); // Ambil data order terbaru setelah update
      return res.status(200).json({ message: 'Waktu penggunaan pesanan dimulai.', order: updatedOrder });

    } catch (transactionError) {
      // Rollback transaksi jika terjadi kesalahan
      await pool.query('ROLLBACK');
      console.error("Transaction failed during startUsage:", transactionError);
      return res.status(500).json({ message: transactionError.message || 'Terjadi kesalahan saat mencatat awal penggunaan (transaksi dibatalkan).' });
    }
  } catch (error) {
    console.error("Gagal mencatat awal penggunaan:", error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat mencatat awal penggunaan.' });
  }
};


export const deactivateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan.' });
    }

    if (order.is_active === 0) {
      return res.status(200).json({ message: 'Pesanan sudah tidak aktif.' });
    }

    const updateResult = await Order.findByIdAndUpdate(id, { is_active: 0 });

    if (updateResult.affectedRows > 0) {
      return res.status(200).json({ message: 'Pesanan berhasil dinonaktifkan.' });
    } else {
      return res.status(500).json({ message: 'Gagal menonaktifkan pesanan.' });
    }
  } catch (error) {
    console.error("Gagal menonaktifkan pesanan:", error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat menonaktifkan pesanan.' });
  }
};