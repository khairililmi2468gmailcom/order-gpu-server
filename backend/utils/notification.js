// utils/notification.js
import sendEmail from './sendEmail.js'; // Pastikan ini adalah helper untuk Nodemailer
import pool from '../config/db.js';
import moment from 'moment';
/**
 * Mengirim notifikasi email kepada pengguna setelah permohonan layanan GPU disetujui
 * dan token telah diberikan. Memberikan informasi tentang cara memulai layanan
 * secara manual atau aktivasi otomatis.
 * @param {string} userEmail - Email pengguna.
 * @param {string} userName - Nama pengguna.
 * @param {string} token - Token akses GPU.
 * @param {string | null} domain - Domain yang terkait dengan layanan GPU (opsional).
 */
export async function notifyUserWithToken(userEmail, userName, token, domain) {
  const subject = 'Informasi Layanan GPU Anda Telah Disetujui - Universitas Syiah Kuala';
  const primaryColor = '#007bff'; // Warna biru UNSYIA atau warna primer pilihan Anda
  const secondaryColor = '#6c757d'; // Warna abu-abu sekunder

  const message = `
    <div style="font-family: 'Arial', sans-serif; line-height: 1.6; color: ${secondaryColor}; margin: 20px;">
      <h2 style="color: ${primaryColor}; margin-bottom: 20px;">Layanan GPU Anda Telah Disetujui!</h2>
      <p style="margin-bottom: 15px;">Yang terhormat Bapak/Ibu ${userName},</p>
      <p style="margin-bottom: 15px;">Dengan hormat,</p>
      <p style="margin-bottom: 15px;">Kami informasikan bahwa permohonan Anda untuk layanan GPU telah disetujui dan token akses telah diberikan. Layanan Anda kini siap untuk diaktifkan.</p>
      
      <div style="background-color: #fff3cd; border: 1px solid #ffeeba; border-radius: 5px; padding: 15px; margin-bottom: 20px; color: #856404;">
        <h3 style="color: #856404; margin-top: 0; margin-bottom: 10px;">Pemberitahuan Penting:</h3>
        <p style="margin-bottom: 10px;">Untuk memulai layanan GPU Anda, Anda dapat menekan tombol <strong>"Start"</strong> yang tersedia pada daftar pesanan GPU Anda di halaman akun.</p>
        <p>Jika Anda tidak menekan tombol "Start", sistem akan secara otomatis mengaktifkan layanan Anda <strong>30 menit</strong> setelah pesanan Anda disetujui. Setelah diaktifkan, layanan akan berjalan sesuai durasi yang Anda pilih.</p>
      </div>

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


/**
 * Mengirim notifikasi email kepada pengguna setelah layanan GPU mereka diaktifkan secara otomatis.
 * @param {string} userEmail - Email pengguna.
 * @param {string} userName - Nama pengguna.
 * @param {string} token - Token akses GPU.
 * @param {string | null} domain - Domain yang terkait dengan layanan GPU (opsional).
 * @param {Date} startDate - Tanggal dan waktu mulai aktivasi layanan.
 * @param {Date} endDate - Tanggal dan waktu berakhirnya aktivasi layanan.
 */
export async function sendActivationEmailNotification(userEmail, userName, token, domain, startDate, endDate) {
  const subject = 'Informasi Aktivasi Layanan GPU - Universitas Syiah Kuala';
  const primaryColor = '#007bff'; // Warna biru UNSYIA atau warna primer pilihan Anda
  const secondaryColor = '#6c757d'; // Warna abu-abu sekunder

  // Format tanggal agar lebih mudah dibaca
  const formattedStartDate = moment(startDate).format('DD MMMM YYYY HH:mm:ss');
  const formattedEndDate = moment(endDate).format('DD MMMM YYYY HH:mm:ss');

  const message = `
    <div style="font-family: 'Arial', sans-serif; line-height: 1.6; color: ${secondaryColor}; margin: 20px;">
      <h2 style="color: ${primaryColor}; margin-bottom: 20px;">Aktivasi Layanan GPU Anda Berhasil</h2>
      <p style="margin-bottom: 15px;">Yang terhormat Bapak/Ibu ${userName},</p>
      <p style="margin-bottom: 15px;">Dengan hormat,</p>
      <p style="margin-bottom: 15px;">Kami informasikan bahwa layanan GPU Anda telah berhasil diaktifkan secara otomatis, 30 menit setelah pesanan Anda disetujui. Berikut adalah detail akses dan periode aktivasi layanan Anda:</p>
      
      <div style="background-color: #f8f9fa; border: 1px solid #ced4da; border-radius: 5px; padding: 15px; margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 5px; color: ${primaryColor}; font-weight: bold;">Periode Aktivasi Layanan:</label>
        <p style="margin-bottom: 5px;"><strong>Mulai:</strong> ${formattedStartDate} WIB</p>
        <p><strong>Berakhir:</strong> ${formattedEndDate} WIB</p>
      </div>

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


/**
 * Mengirim notifikasi email kepada pengguna bahwa layanan GPU mereka telah dinonaktifkan.
 * @param {string} userEmail - Email pengguna.
 * @param {string} userName - Nama pengguna.
 * @param {string} orderId - ID Pesanan yang dinonaktifkan.
 * @param {string | null} token - Token akses GPU yang dinonaktifkan.
 * @param {string | null} domain - Domain yang terkait dengan layanan GPU yang dinonaktifkan.
 * @param {Date} endDate - Tanggal dan waktu berakhirnya layanan.
 */
export async function sendDeactivationEmailNotification(userEmail, userName, orderId, token, domain, endDate) {
  const subject = 'Pemberitahuan Penonaktifan Layanan GPU Anda - Universitas Syiah Kuala';
  const primaryColor = '#dc3545'; // Warna merah untuk penonaktifan
  const secondaryColor = '#6c757d'; // Warna abu-abu sekunder

  const formattedEndDate = moment(endDate).format('DD MMMM HH:mm:ss');

  const message = `
    <div style="font-family: 'Arial', sans-serif; line-height: 1.6; color: ${secondaryColor}; margin: 20px;">
      <h2 style="color: ${primaryColor}; margin-bottom: 20px;">Layanan GPU Anda Telah Dinonaktifkan</h2>
      <p style="margin-bottom: 15px;">Yang terhormat Bapak/Ibu ${userName},</p>
      <p style="margin-bottom: 15px;">Dengan hormat,</p>
      <p style="margin-bottom: 15px;">Kami informasikan bahwa layanan GPU Anda dengan ID Pesanan <strong>#${orderId}</strong> telah dinonaktifkan pada tanggal <strong>${formattedEndDate} WIB</strong> karena telah mencapai akhir periode aktifnya.</p>
      
      <div style="background-color: #f8f9fa; border: 1px solid #ced4da; border-radius: 5px; padding: 15px; margin-bottom: 20px;">
        <label style="display: block; margin-bottom: 5px; color: ${primaryColor}; font-weight: bold;">Detail Layanan yang Dinonaktifkan:</label>
        <p style="margin-bottom: 5px;"><strong>ID Pesanan:</strong> #${orderId}</p>
        ${token ? `<p style="margin-bottom: 5px;"><strong>Token Akses:</strong> ${token}</p>` : ''}
        ${domain ? `<p><strong>Domain:</strong> ${domain}</p>` : ''}
        <p><strong>Waktu Dinonaktifkan:</strong> ${formattedEndDate} WIB</p>
      </div>

      <p style="margin-bottom: 15px;">Token akses dan domain yang terkait dengan layanan ini tidak lagi aktif. Jika Anda memerlukan layanan GPU kembali, Anda dapat mengajukan pesanan baru melalui portal layanan kami.</p>
      <p style="margin-bottom: 15px;">Apabila Anda memiliki pertanyaan atau memerlukan bantuan lebih lanjut, jangan ragu untuk menghubungi tim dukungan teknis kami.</p>
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


/**
 * Mengirim notifikasi email kepada admin ketika seorang pengguna
 * secara manual mengaktifkan layanan GPU mereka.
 * @param {string} orderId - ID Pesanan yang diaktifkan.
 * @param {string} userName - Nama pengguna yang mengaktifkan.
 * @param {string} userEmail - Email pengguna yang mengaktifkan.
 * @param {Date} startDate - Tanggal dan waktu mulai aktivasi layanan.
 * @param {Date} endDate - Tanggal dan waktu berakhirnya aktivasi layanan.
 * @param {string | null} domain - Domain yang terkait dengan layanan GPU (opsional).
 */
export async function notifyAdminOfUserManualActivation(orderId, userName, userEmail, startDate, endDate, domain) {
  const subject = `Pemberitahuan: Pengguna Mengaktifkan Layanan GPU Secara Manual - Pesanan #${orderId}`;
  const primaryColor = '#28a745'; // Warna hijau untuk notifikasi
  const secondaryColor = '#6c757d';

  const formattedStartDate = moment(startDate).format('DD MMMM HH:mm:ss');
  const formattedEndDate = moment(endDate).format('DD MMMM HH:mm:ss');

  try {
    // Ambil semua email admin dari database
    const [adminEmailsResult] = await pool.query("SELECT email FROM users WHERE role = 'admin'");
    const adminEmails = adminEmailsResult.map(row => row.email);

    if (adminEmails.length === 0) {
      console.warn('Tidak ada admin ditemukan untuk menerima notifikasi aktivasi manual pengguna.');
      return;
    }

    const message = `
      <div style="font-family: 'Arial', sans-serif; line-height: 1.6; color: ${secondaryColor}; margin: 20px;">
        <h2 style="color: ${primaryColor}; margin-bottom: 20px;">Layanan GPU Diaktifkan Secara Manual oleh Pengguna</h2>
        <p style="margin-bottom: 15px;">Halo Admin,</p>
        <p style="margin-bottom: 15px;">Seorang pengguna telah mengaktifkan layanan GPU mereka secara manual melalui tombol "Start". Berikut adalah detail pesanan yang diaktifkan:</p>
        <div style="background-color: #f8f9fa; border: 1px solid #ced4da; border-radius: 5px; padding: 15px; margin-bottom: 20px;">
          <h3 style="color: ${primaryColor}; margin-top: 0; margin-bottom: 10px;">Detail Aktivasi:</h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="margin-bottom: 8px;"><strong>ID Pesanan:</strong> #${orderId}</li>
            <li style="margin-bottom: 8px;"><strong>Nama Pengguna:</strong> ${userName}</li>
            <li style="margin-bottom: 8px;"><strong>Email Pengguna:</strong> ${userEmail}</li>
            <li style="margin-bottom: 8px;"><strong>Waktu Mulai:</strong> ${formattedStartDate} WIB</li>
            <li style="margin-bottom: 8px;"><strong>Waktu Berakhir:</strong> ${formattedEndDate} WIB</li>
            ${domain ? `<li style="margin-bottom: 8px;"><strong>Domain:</strong> ${domain}</li>` : ''}
          </ul>
        </div>
        <p style="margin-bottom: 15px;">Layanan ini sekarang berstatus 'active' dan waktu penggunaan telah dimulai.</p>
        <p style="margin-bottom: 20px;">Mohon periksa detail pesanan ini di panel admin Anda jika diperlukan.</p>
        <p style="text-align: center; margin-bottom: 20px;">
          <a href="${process.env.FRONTEND_URL}/admin/payments" style="display: inline-block; padding: 12px 25px; background-color: ${primaryColor}; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">Lihat Pesanan di Admin Panel</a>
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
    console.error('Error sending user manual activation notification to admin:', error);
  }
}
