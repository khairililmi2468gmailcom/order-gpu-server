// src/cronJobs/deactivationJob.js
import cron from 'node-cron';
import Order from '../models/Order.js';
import pool from '../config/db.js'; // Import koneksi database pool
import moment from 'moment'; // Pastikan moment sudah terinstal (npm install moment)
import { sendDeactivationEmailNotification } from '../utils/notification.js'; // Import fungsi notifikasi penonaktifan

const runDeactivationCronJob = () => {
    // Jadwalkan untuk berjalan setiap menit
    cron.schedule('* * * * *', async () => {
        try {
            console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Cron job: Memeriksa dan menonaktifkan pesanan kedaluwarsa...`);
            
            // Mengambil order yang aktif dan end_date-nya sudah lewat
            // Lakukan JOIN dengan tabel users untuk mendapatkan email dan nama pengguna
            // serta token dan domain dari tabel orders untuk notifikasi email.
            const [expiredOrders] = await pool.query(
                `SELECT o.id, o.token, o.domain, o.gpu_package_id, o.end_date, u.email AS user_email, u.name AS user_name
                 FROM orders o
                 JOIN users u ON o.user_id = u.id
                 WHERE o.is_active = 1
                   AND o.end_date <= NOW()`
            );

            if (expiredOrders.length > 0) {
                console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Cron job: Menemukan ${expiredOrders.length} pesanan kedaluwarsa.`);
                
                for (const order of expiredOrders) {
                    await pool.query('START TRANSACTION'); // Mulai transaksi untuk setiap order

                    try {
                        // 1. Nonaktifkan pesanan dan ubah status menjadi 'completed'
                        const updateOrderResult = await Order.findByIdAndUpdate(order.id, { 
                            is_active: 0,
                            status: 'completed' 
                        });

                        if (updateOrderResult.affectedRows > 0) {
                            console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Cron job: Pesanan ID ${order.id} dinonaktifkan.`);

                            // 2. Kembalikan stok GPU ke gpu_packages
                            if (order.gpu_package_id) { // Menggunakan order.gpu_package_id langsung dari SELECT
                                const [updateGpuResult] = await pool.query(
                                    'UPDATE gpu_packages SET stock_available = stock_available + 1 WHERE id = ?',
                                    [order.gpu_package_id]
                                );

                                if (updateGpuResult.affectedRows > 0) {
                                    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Cron job: Stok GPU untuk Paket ID ${order.gpu_package_id} berhasil dikembalikan untuk Pesanan ID ${order.id}.`);
                                } else {
                                    console.warn(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Cron job: Gagal mengembalikan stok untuk Paket ID ${order.gpu_package_id} (Pesanan ID ${order.id}).`);
                                }
                            } else {
                                console.warn(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Cron job: gpu_package_id tidak ditemukan untuk Pesanan ID ${order.id}.`);
                            }

                            // 3. Kirim notifikasi email penonaktifan kepada pengguna
                            await sendDeactivationEmailNotification(
                                order.user_email,
                                order.user_name,
                                order.id,
                                order.token,
                                order.domain,
                                order.end_date // Menggunakan end_date dari hasil query
                            );
                            console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Cron job: Email penonaktifan terkirim untuk Pesanan ID ${order.id}.`);

                        } else {
                            console.warn(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Cron job: Gagal menonaktifkan pesanan ID ${order.id}.`);
                        }
                        
                        await pool.query('COMMIT'); // Commit transaksi jika semua berhasil
                    } catch (transactionError) {
                        await pool.query('ROLLBACK'); // Rollback jika ada kesalahan dalam transaksi
                        console.error(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Cron job: Kesalahan transaksi untuk Pesanan ID ${order.id}:`, transactionError);
                    }
                }
            } else {
                console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Cron job: Tidak ada pesanan kedaluwarsa yang ditemukan.`);
            }
            console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Cron job: Selesai memeriksa pesanan kedaluwarsa.`);
        } catch (error) {
            console.error(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Cron job error (luar loop):`, error);
        }
    });

    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Cron job untuk penonaktifan pesanan dijadwalkan.`);
};

export default runDeactivationCronJob;
