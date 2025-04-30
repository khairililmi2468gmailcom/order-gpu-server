import sendEmail from './sendEmail.js'; // Pastikan ini adalah helper untuk Nodemailer

export async function notifyUserWithToken(userEmail, userName, token) {
  const subject = 'Informasi Aktivasi Layanan GPU - Universitas Syiah Kuala';
  const primaryColor = '#007bff'; // Warna biru UNSYIA atau warna primer pilihan Anda
  const secondaryColor = '#6c757d'; // Warna abu-abu sekunder

  const message = `
    <div style="font-family: 'Arial', sans-serif; line-height: 1.6; color: ${secondaryColor}; margin: 20px;">
      <h2 style="color: ${primaryColor}; margin-bottom: 20px;">Aktivasi Layanan GPU Anda Berhasil</h2>
      <p style="margin-bottom: 15px;">Yang terhormat Bapak/Ibu ${userName},</p>
      <p style="margin-bottom: 15px;">Dengan hormat,</p>
      <p style="margin-bottom: 15px;">Kami informasikan bahwa permohonan Anda untuk layanan GPU telah disetujui. Berikut adalah detail token akses yang diperlukan untuk mengaktifkan dan menggunakan layanan:</p>
      <div style="background-color: #f8f9fa; border: 1px solid #ced4da; border-radius: 5px; padding: 15px; margin-bottom: 20px;">
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
      <p style="margin-bottom: 15px;">Mohon simpan token ini dengan aman dan jangan bagikan kepada pihak yang tidak berwenang. Token ini akan diperlukan setiap kali Anda mengakses layanan GPU.</p>
      <p style="margin-bottom: 15px;">Apabila Anda mengalami kendala atau memiliki pertanyaan lebih lanjut terkait aktivasi maupun penggunaan layanan, jangan ragu untuk menghubungi tim dukungan teknis kami melalui email ini atau melalui kanal komunikasi resmi yang tertera pada sistem layanan.</p>
      <p style="margin-bottom: 20px;">Terima kasih atas kepercayaan Anda dalam menggunakan layanan GPU Universitas Syiah Kuala.</p>
      <hr style="border: 1px solid #e0e0e0; margin-bottom: 20px;">
      <p style="font-size: 14px; color: ${secondaryColor};">Hormat kami,</p>
      <strong style="color: ${primaryColor};">Tim Pengelola Layanan GPU ICT</strong><br>
      <strong>Universitas Syiah Kuala</strong><br>
      <a href="[URL yang tidak valid dihapus]" style="color: ${primaryColor}; text-decoration: none;">[URL yang tidak valid dihapus]</a>
    </div>
  `;

  await sendEmail(userEmail, subject, message);
}