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

    // Loop through orders and check if there's a matching entry in the payments table
    for (let order of orders) {
      const [payment] = await pool.query(
        `SELECT p.proof_url FROM payments p WHERE p.order_id = ?`, [order.id]
      );
      
      // Check if a payment entry exists and has a proof_url
      order.hasUpload = payment.length > 0 && payment[0].proof_url ? true : false;
    }

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
    // Cards:
    const [visitorCount] = await pool.query('SELECT COUNT(DISTINCT ip) AS visitor_count FROM access_log');
    const [userCount] = await pool.query('SELECT COUNT(id) AS user_count FROM users');
    const [orderCount] = await pool.query('SELECT COUNT(id) AS order_count FROM orders');
    const [totalRevenue] = await pool.query('SELECT IFNULL(SUM(total_cost), 0) AS total_revenue FROM orders WHERE status = "approved"');
    const [pendingOrders] = await pool.query('SELECT COUNT(id) AS pending_order FROM orders WHERE status = "pending_payment"');
    const [approvedOrders] = await pool.query('SELECT COUNT(id) AS approved_order FROM orders WHERE status = "approved"');
    const [monthlyNewUsersTotal] = await pool.query(`
      SELECT COUNT(*) AS this_month_new_users
      FROM users
      WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())
    `);
    const [todayVisitors] = await pool.query(`
      SELECT COUNT(DISTINCT ip) AS today_visitors
      FROM access_log
      WHERE DATE(accessed_at) = CURDATE()
    `);

    // Charts:
    const [monthlyRevenue] = await pool.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') AS month,
        SUM(total_cost) AS total
      FROM orders
      WHERE status = "approved"
      GROUP BY month
      ORDER BY month ASC
    `);

    const [orderStatusCount] = await pool.query(`
      SELECT 
        status,
        COUNT(*) AS count
      FROM orders
      GROUP BY status
    `);

    const [monthlyNewUsers] = await pool.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') AS month,
        COUNT(*) AS new_users
      FROM users
      GROUP BY month
      ORDER BY month ASC
    `);

    const [dailyVisitors] = await pool.query(`
      SELECT 
        DATE(accessed_at) AS date,
        COUNT(DISTINCT ip) AS visitors
      FROM access_log
      WHERE accessed_at >= CURDATE() - INTERVAL 30 DAY
      GROUP BY date
      ORDER BY date ASC
    `);

    res.json({
      cards: {
        visitorCount: visitorCount[0].visitor_count,
        todayVisitors: todayVisitors[0].today_visitors,
        userCount: userCount[0].user_count,
        monthlyNewUsers: monthlyNewUsersTotal[0].this_month_new_users,
        orderCount: orderCount[0].order_count,
        pendingOrders: pendingOrders[0].pending_order,
        approvedOrders: approvedOrders[0].approved_order,
        totalRevenue: totalRevenue[0].total_revenue
      },
      charts: {
        lineChart: {
          label: "Pendapatan Bulanan",
          data: monthlyRevenue
        },
        barChart: {
          label: "User Baru per Bulan",
          data: monthlyNewUsers
        },
        pieChart: {
          label: "Status Order",
          data: orderStatusCount
        },
        areaChart: {
          label: "Visitor Harian (30 hari)",
          data: dailyVisitors
        }
      }
    });
  } catch (err) {
    console.error('Get Website Stats Error:', err);
    res.status(500).json({ error: 'Gagal mengambil statistik website' });
  }
};



export const getAllPayments = async (req, res) => {
  try {
    const [payments] = await pool.query(
      `SELECT 
          p.id AS payment_id,
          p.order_id,
          p.proof_url,
          p.status AS payment_status,
          p.verified_by,
          p.verified_at,
          
          o.id AS order_id,
          o.user_id,
          o.gpu_package_id,
          o.duration_days,
          o.total_cost,
          o.status AS order_status,
          o.start_date,
          o.end_date,
          o.created_at AS order_created_at,
          
          u.name AS user_name,
          u.email AS user_email,

          g.name AS gpu_package_name,
          g.price_per_hour,
          g.vcpu,
          g.ram,
          g.min_period_days
       FROM payments p 
       JOIN orders o ON p.order_id = o.id 
       JOIN users u ON o.user_id = u.id
       JOIN gpu_packages g ON o.gpu_package_id = g.id`
    );

    res.json(payments);
  } catch (err) {
    console.error('Get Payments Error:', err);
    res.status(500).json({ error: 'Gagal mengambil data pembayaran' });
  }
};

