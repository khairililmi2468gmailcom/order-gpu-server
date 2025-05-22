// src/cronJobs/activationJob.js
import cron from 'node-cron';
import pool from '../config/db.js'; // Import koneksi database pool
import Order from '../models/Order.js'; // Asumsi Order model memiliki findByIdAndUpdate
import moment from 'moment'; // Pastikan moment sudah terinstal (npm install moment)

const runActivationCronJob = () => {
    // Jadwalkan untuk berjalan setiap menit
    cron.schedule('* * * * *', async () => {
        try {
            console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Cron job: Memeriksa dan mengaktifkan pesanan yang tertunda...`);

            // Mengambil order yang berstatus 'approved', belum aktif (is_active = 0),
            // dan updated_at-nya sudah lebih dari 1 menit yang lalu.
            const [ordersToActivate] = await pool.query(
                `SELECT id, duration_hours FROM orders 
                 WHERE status = 'approved' 
                   AND is_active = 0 
                   AND token IS NOT NULL
                   AND updated_at <= NOW() - INTERVAL 1 MINUTE` // Mengambil pesanan yang approved 1 menit yang lalu atau lebih
            );

            if (ordersToActivate.length > 0) {
                console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Cron job: Menemukan ${ordersToActivate.length} pesanan untuk diaktifkan secara otomatis.`);

                for (const order of ordersToActivate) {
                    await pool.query('START TRANSACTION'); // Mulai transaksi untuk setiap order

                    try {
                        const startDate = new Date(); // Tanggal mulai adalah waktu saat ini
                        const endDate = new Date(startDate.getTime() + order.duration_hours * 60 * 60 * 1000); // Menghitung end_date

                        // Perbarui status pesanan menjadi 'active' dan set tanggal mulai/berakhir
                        const updateResult = await Order.findByIdAndUpdate(order.id, {
                            start_date: startDate,
                            end_date: endDate,
                            is_active: 1, // Set aktif
                            status: 'active' // Ubah status menjadi 'active'
                        });

                        if (updateResult.affectedRows > 0) {
                            console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Cron job: Pesanan ID ${order.id} berhasil diaktifkan secara otomatis.`);
                        } else {
                            console.warn(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Cron job: Gagal mengaktifkan pesanan ID ${order.id} (tidak ada baris yang terpengaruh).`);
                        }

                        await pool.query('COMMIT'); // Commit transaksi jika berhasil
                    } catch (transactionError) {
                        await pool.query('ROLLBACK'); // Rollback jika ada kesalahan dalam transaksi
                        console.error(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Cron job: Kesalahan transaksi saat mengaktifkan Pesanan ID ${order.id}:`, transactionError);
                    }
                }
            } else {
                console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Cron job: Tidak ada pesanan tertunda yang perlu diaktifkan.`);
            }
            console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Cron job: Selesai memeriksa pesanan tertunda.`);
        } catch (error) {
            console.error(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Cron job error (luar loop aktivasi):`, error);
        }
    });

    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Cron job untuk aktivasi pesanan dijadwalkan.`);
};

export default runActivationCronJob;
