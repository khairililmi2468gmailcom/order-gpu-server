// src/cronJobs/deactivationJob.js
import cron from 'node-cron';
import Order from '../models/Order.js';
import moment from 'moment';

const runDeactivationCronJob = () => {
    // Jadwalkan untuk berjalan setiap menit
    cron.schedule('* * * * *', async () => {
        try {
            console.log('Cron job: Memeriksa dan menonaktifkan pesanan kedaluwarsa...');
            const now = moment();
            const expiredOrders = await Order.findExpiredActiveOrders(); // Gunakan fungsi yang spesifik

            if (expiredOrders.length > 0) {
                console.log(`Cron job: Menemukan ${expiredOrders.length} pesanan kedaluwarsa.`);
                for (const order of expiredOrders) {
                    const updateResult = await Order.findByIdAndUpdate(order.id, { is_active: 0 });
                    if (updateResult.affectedRows > 0) {
                        console.log(`Cron job: Pesanan ID ${order.id} dinonaktifkan.`);
                    } else {
                        console.warn(`Cron job: Gagal menonaktifkan pesanan ID ${order.id}.`);
                    }
                }
            } else {
                console.log('Cron job: Tidak ada pesanan kedaluwarsa yang ditemukan.');
            }
            console.log('Cron job: Selesai memeriksa pesanan kedaluwarsa.');
        } catch (error) {
            console.error('Cron job error:', error);
        }
    });

    console.log('Cron job untuk penonaktifan pesanan dijadwalkan.');
};

export default runDeactivationCronJob;