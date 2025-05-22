// utils/notification.js
import sendEmail from './sendEmail.js'; // Pastikan ini adalah helper untuk Nodemailer
import pool from '../config/db.js';

export async function notifyUserWithToken(userEmail, userName, token, domain) {
  const subject = 'Informasi Aktivasi Layanan GPU - Universitas Syiah Kuala';
  const primaryColor = '#007bff'; // Warna biru UNSYIA atau warna primer pilihan Anda
  const secondaryColor = '#6c757d'; // Warna abu-abu sekunder

  const message = `
    <div style="font-family: 'Arial', sans-serif; line-height: 1.6; color: ${secondaryColor}; margin: 20px;">
      <h2 style="color: ${primaryColor}; margin-bottom: 20px;">Aktivasi Layanan GPU Anda Berhasil</h2>
      <p style="margin-bottom: 15px;">Yang terhormat Bapak/Ibu ${userName},</p>
      <p style="margin-bottom: 15px;">Dengan hormat,</p>
      <p style="margin-bottom: 15px;">Kami informasikan bahwa permohonan Anda untuk layanan GPU telah disetujui. Berikut adalah detail akses yang diperlukan untuk mengaktifkan dan menggunakan layanan:</p>
      <div style="background-color: #f8f9fa; border: 1px solid #ced4da; border-radius: 5px; padding: 15px; margin-bottom: 10px;">
        <label style="display: block; margin-bottom: 5px; color: ${primaryColor}; font-weight: bold;">Token Akses:</label>
        <div style="display: flex; align-items: center;">
          <input
            type="text"
            value="${token}"
            id="accessToken"
            style="flex-grow: 1; padding: 10px; border: 1px solid #ced4da; border-radius: 3px; font-size: 16px; color: ${secondaryColor};"
            readonly
            onClick="this.select(); document.execCommand('copy');"
          />
        </div>
        <p style="font-size: 12px; color: #6c757d; margin-top: 5px;">Sentuh pada kotak token untuk untuk menyalin token.</p>
      </div>
      ${domain ? `
      <div style="background-color: #f8f9fa; border: 1px solid #ced4da; border-radius: 5px; padding: 15px; margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 5px; color: ${primaryColor}; font-weight: bold;">Domain Anda:</label>
        <p style="padding: 10px; border: 1px solid #ced4da; border-radius: 3px; font-size: 16px; color: ${secondaryColor};">${domain}</p>
      </div>
      ` : ''}
      <p style="margin-bottom: 15px;">Mohon simpan informasi ini dengan aman dan jangan bagikan kepada pihak yang tidak berwenang. Token ini akan diperlukan setiap kali Anda mengakses layanan GPU melalui domain yang telah ditentukan.</p>
      <p style="margin-bottom: 15px;">Apabila Anda mengalami kendala atau memiliki pertanyaan lebih lanjut terkait aktivasi maupun penggunaan layanan, jangan ragu untuk menghubungi tim dukungan teknis kami melalui email ini atau melalui kanal komunikasi resmi yang tertera pada sistem layanan.</p>
      <p style="margin-bottom: 20px;">Terima kasih atas kepercayaan Anda dalam menggunakan layanan GPU Universitas Syiah Kuala.</p>
      <hr style="border: 1px solid #e0e0e0; margin-bottom: 20px;">
      <p style="font-size: 14px; color: ${secondaryColor};">Hormat kami,</p>
      <strong style="color: ${primaryColor};">Tim Pengelola Layanan GPU FMIPA USK</strong><br>
      <strong>Universitas Syiah Kuala</strong><br>
      <a href="https://support.google.com/photos/thread/202686606/apakah-foto-atau-video-yg-dihapus-secara-permanen-tidak-akan-bisa-kembali-lagi?hl=id" style="color: ${primaryColor}; text-decoration: none;">https://support.google.com/photos/thread/202686606/apakah-foto-atau-video-yg-dihapus-secara-permanen-tidak-akan-bisa-kembali-lagi?hl=id</a>
    </div>
  `;

  await sendEmail(userEmail, subject, message);
}

export async function notifyPaymentRejected(userEmail, userName, orderId, gpuPackageName, totalCost, rejectionReason) {
  const subject = 'Pembaruan Status Pesanan Anda - Pembayaran Ditolak';
  const primaryColor = '#dc3545'; // Warna merah untuk penolakan
  const secondaryColor = '#6c757d';

  const message = `
      <div style="font-family: 'Arial', sans-serif; line-height: 1.6; color: ${secondaryColor}; margin: 20px;">
          <h2 style="color: ${primaryColor}; margin-bottom: 20px;">Pembayaran Pesanan Anda Ditolak</h2>
          <p style="margin-bottom: 15px;">Yang terhormat Bapak/Ibu ${userName},</p>
          <p style="margin-bottom: 15px;">Kami memberitahukan bahwa pembayaran untuk pesanan Anda **#${orderId}** dengan detail sebagai berikut telah **ditolak**:</p>
          <div style="background-color: #f8f9fa; border: 1px solid #ced4da; border-radius: 5px; padding: 15px; margin-bottom: 20px;">
              <p><strong>ID Pesanan:</strong> #${orderId}</p>
              <p><strong>Nama Paket GPU:</strong> ${gpuPackageName}</p>
              <p><strong>Jumlah Pembayaran:</strong> Rp${parseFloat(totalCost).toLocaleString('id-ID')}</p>
              <p style="margin-top: 10px;"><strong>Alasan Penolakan:</strong></p>
              <p style="white-space: pre-wrap; background-color: #ffe0e0; padding: 10px; border-radius: 3px; border: 1px solid #ffb3b3;">${rejectionReason}</p>
          </div>
          <p style="margin-bottom: 15px;">Dikarenakan pembayaran ditolak, pesanan Anda telah dibatalkan dan stok GPU yang sebelumnya dialokasikan telah dikembalikan.</p>
          <p style="margin-bottom: 15px;">Jika Anda memiliki pertanyaan atau ingin mengajukan pesanan baru setelah memperbaiki kendala pembayaran, silakan hubungi tim dukungan kami.</p>
          <p style="margin-bottom: 20px;">Terima kasih atas pengertian Anda.</p>
          <hr style="border: 1px solid #e0e0e0; margin-bottom: 20px;">
          <p style="font-size: 14px; color: ${secondaryColor};">Hormat kami,</p>
          <strong style="color: #007bff;">Tim Pengelola Layanan GPU FMIPA USK</strong><br>
          <strong>Universitas Syiah Kuala</strong><br>
          <a href="https://support.google.com/photos/thread/202686606/apakah-foto-atau-video-yg-dihapus-secara-permanen-tidak-akan-bisa-kembali-lagi?hl=id" style="color: #007bff; text-decoration: none;">https://support.google.com/photos/thread/202686606/apakah-foto-atau-video-yg-dihapus-secara-permanen-tidak-akan-bisa-kembali-lagi?hl=id</a>
      </div>
  `;

  await sendEmail(userEmail, subject, message);
}




export async function notifyAdminOfNewOrder(orderId, packageData, userData, totalCost, durationHours) {
  const subject = `Pemberitahuan Pesanan Baru: #${orderId} - ${packageData.name}`;
  const primaryColor = '#28a745'; // Warna hijau untuk notifikasi baru
  const secondaryColor = '#6c757d';

  try {
    // Ambil semua email admin dari database
    const [adminEmailsResult] = await pool.query("SELECT email FROM users WHERE role = 'admin'");
    const adminEmails = adminEmailsResult.map(row => row.email);

    if (adminEmails.length === 0) {
      console.warn('Tidak ada admin ditemukan untuk menerima notifikasi pesanan baru.');
      return;
    }

    const message = `
      <div style="font-family: 'Arial', sans-serif; line-height: 1.6; color: ${secondaryColor}; margin: 20px;">
        <h2 style="color: ${primaryColor}; margin-bottom: 20px;">Pesanan Baru Telah Dibuat!</h2>
        <p style="margin-bottom: 15px;">Halo Admin,</p>
        <p style="margin-bottom: 15px;">Sebuah pesanan baru telah berhasil dibuat di sistem Anda. Berikut adalah detail pesanan:</p>
        <div style="background-color: #f8f9fa; border: 1px solid #ced4da; border-radius: 5px; padding: 15px; margin-bottom: 20px;">
          <h3 style="color: ${primaryColor}; margin-top: 0; margin-bottom: 10px;">Detail Pesanan</h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="margin-bottom: 8px;"><strong>ID Pesanan:</strong> ${orderId}</li>
            <li style="margin-bottom: 8px;"><strong>Paket GPU:</strong> ${packageData.name}</li>
            <li style="margin-bottom: 8px;"><strong>Durasi:</strong> ${durationHours} Jam</li>
            <li style="margin-bottom: 8px;"><strong>Total Biaya:</strong> Rp ${parseFloat(totalCost).toLocaleString('id-ID')}</li>
            <li style="margin-bottom: 8px;"><strong>Status:</strong> Pending Pembayaran</li>
          </ul>
        </div>
        <div style="background-color: #f8f9fa; border: 1px solid #ced4da; border-radius: 5px; padding: 15px; margin-bottom: 20px;">
          <h3 style="color: ${primaryColor}; margin-top: 0; margin-bottom: 10px;">Biodata Pemesan</h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="margin-bottom: 8px;"><strong>Nama:</strong> ${userData.name}</li>
            <li style="margin-bottom: 8px;"><strong>Email:</strong> ${userData.email}</li>
            <li style="margin-bottom: 8px;"><strong>Telepon:</strong> ${userData.phone || '-'}</li>
          </ul>
        </div>
        <p style="margin-bottom: 15px;">Mohon segera periksa pesanan ini dan tunggu konfirmasi pembayaran dari pelanggan.</p>
        <p style="margin-bottom: 20px;">Anda dapat melihat detail pesanan dan memprosesnya melalui panel admin Anda.</p>
        <p style="text-align: center; margin-bottom: 20px;">
          <a href="${process.env.FRONTEND_URL}/admin/orders" style="display: inline-block; padding: 12px 25px; background-color: ${primaryColor}; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">Buka Panel Admin</a>
        </p>
        <hr style="border: 1px solid #e0e0e0; margin-bottom: 20px;">
        <p style="font-size: 14px; color: ${secondaryColor};">Hormat kami,</p>
        <strong style="color: ${primaryColor};">Sistem Notifikasi GPU FMIPA USK</strong>
      </div>
    `;

    // Kirim email ke semua admin
    for (const email of adminEmails) {
      await sendEmail(email, subject, message);
    }

  } catch (error) {
    console.error('Error sending new order notification to admin:', error);
  }
}
