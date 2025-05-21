// src/cronJobs/deactivationJob.js
import cron from 'node-cron';
import Order from '../models/Order.js';
import pool from '../config/db.js'; // Import koneksi database pool
import moment from 'moment'; // Pastikan moment sudah terinstal (npm install moment)

const runDeactivationCronJob = () => {
    // Jadwalkan untuk berjalan setiap menit
    cron.schedule('* * * * *', async () => {
        try {
            console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Cron job: Memeriksa dan menonaktifkan pesanan kedaluwarsa...`);
            
            // Mengambil order yang aktif dan end_date-nya sudah lewat
            const expiredOrders = await Order.findExpiredActiveOrders();

            if (expiredOrders.length > 0) {
                console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Cron job: Menemukan ${expiredOrders.length} pesanan kedaluwarsa.`);
                
                for (const order of expiredOrders) {
                    await pool.query('START TRANSACTION'); // Mulai transaksi untuk setiap order

                    try {
                        // 1. Ambil detail order lengkap untuk mendapatkan gpu_package_id
                        // Lakukan SELECT FOR UPDATE jika ingin mengunci baris order dan package
                        const orderDetail = await Order.findById(order.id); 

                        if (!orderDetail) {
                            console.warn(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Cron job: Pesanan ID ${order.id} tidak ditemukan, kemungkinan sudah dihapus.`);
                            await pool.query('ROLLBACK'); // Batalkan transaksi jika order tidak ada
                            continue; // Lanjutkan ke order berikutnya
                        }

                        // 2. Nonaktifkan pesanan dan ubah status menjadi 'expired'
                        const updateOrderResult = await Order.findByIdAndUpdate(order.id, { 
                            is_active: 0,
                            status: 'expired' // Menambahkan status 'expired'
                        });

                        if (updateOrderResult.affectedRows > 0) {
                            console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Cron job: Pesanan ID ${order.id} dinonaktifkan.`);

                            // 3. Kembalikan stok GPU ke gpu_packages
                            if (orderDetail.gpu_package_id) {
                                const [updateGpuResult] = await pool.query(
                                    'UPDATE gpu_packages SET stock_available = stock_available + 1 WHERE id = ?',
                                    [orderDetail.gpu_package_id]
                                );

                                if (updateGpuResult.affectedRows > 0) {
                                    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Cron job: Stok GPU untuk Paket ID ${orderDetail.gpu_package_id} berhasil dikembalikan untuk Pesanan ID ${order.id}.`);
                                } else {
                                    console.warn(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Cron job: Gagal mengembalikan stok untuk Paket ID ${orderDetail.gpu_package_id} (Pesanan ID ${order.id}).`);
                                }
                            } else {
                                console.warn(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Cron job: gpu_package_id tidak ditemukan untuk Pesanan ID ${order.id}.`);
                            }
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