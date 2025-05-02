"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notifyUserWithToken = notifyUserWithToken;

var _sendEmail = _interopRequireDefault(require("./sendEmail.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Pastikan ini adalah helper untuk Nodemailer
function notifyUserWithToken(userEmail, userName, token, domain) {
  var subject, primaryColor, secondaryColor, message;
  return regeneratorRuntime.async(function notifyUserWithToken$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          subject = 'Informasi Aktivasi Layanan GPU - Universitas Syiah Kuala';
          primaryColor = '#007bff'; // Warna biru UNSYIA atau warna primer pilihan Anda

          secondaryColor = '#6c757d'; // Warna abu-abu sekunder

          message = "\n    <div style=\"font-family: 'Arial', sans-serif; line-height: 1.6; color: ".concat(secondaryColor, "; margin: 20px;\">\n      <h2 style=\"color: ").concat(primaryColor, "; margin-bottom: 20px;\">Aktivasi Layanan GPU Anda Berhasil</h2>\n      <p style=\"margin-bottom: 15px;\">Yang terhormat Bapak/Ibu ").concat(userName, ",</p>\n      <p style=\"margin-bottom: 15px;\">Dengan hormat,</p>\n      <p style=\"margin-bottom: 15px;\">Kami informasikan bahwa permohonan Anda untuk layanan GPU telah disetujui. Berikut adalah detail akses yang diperlukan untuk mengaktifkan dan menggunakan layanan:</p>\n      <div style=\"background-color: #f8f9fa; border: 1px solid #ced4da; border-radius: 5px; padding: 15px; margin-bottom: 10px;\">\n        <label style=\"display: block; margin-bottom: 5px; color: ").concat(primaryColor, "; font-weight: bold;\">Token Akses:</label>\n        <div style=\"display: flex; align-items: center;\">\n          <input\n            type=\"text\"\n            value=\"").concat(token, "\"\n            id=\"accessToken\"\n            style=\"flex-grow: 1; padding: 10px; border: 1px solid #ced4da; border-radius: 3px; font-size: 16px; color: ").concat(secondaryColor, ";\"\n            readonly\n            onClick=\"this.select(); document.execCommand('copy');\"\n          />\n        </div>\n        <p style=\"font-size: 12px; color: #6c757d; margin-top: 5px;\">Sentuh pada kotak token untuk untuk menyalin token.</p>\n      </div>\n      ").concat(domain ? "\n      <div style=\"background-color: #f8f9fa; border: 1px solid #ced4da; border-radius: 5px; padding: 15px; margin-bottom: 20px;\">\n        <label style=\"display: block; margin-bottom: 5px; color: ".concat(primaryColor, "; font-weight: bold;\">Domain Anda:</label>\n        <p style=\"padding: 10px; border: 1px solid #ced4da; border-radius: 3px; font-size: 16px; color: ").concat(secondaryColor, ";\">").concat(domain, "</p>\n      </div>\n      ") : '', "\n      <p style=\"margin-bottom: 15px;\">Mohon simpan informasi ini dengan aman dan jangan bagikan kepada pihak yang tidak berwenang. Token ini akan diperlukan setiap kali Anda mengakses layanan GPU melalui domain yang telah ditentukan.</p>\n      <p style=\"margin-bottom: 15px;\">Apabila Anda mengalami kendala atau memiliki pertanyaan lebih lanjut terkait aktivasi maupun penggunaan layanan, jangan ragu untuk menghubungi tim dukungan teknis kami melalui email ini atau melalui kanal komunikasi resmi yang tertera pada sistem layanan.</p>\n      <p style=\"margin-bottom: 20px;\">Terima kasih atas kepercayaan Anda dalam menggunakan layanan GPU Universitas Syiah Kuala.</p>\n      <hr style=\"border: 1px solid #e0e0e0; margin-bottom: 20px;\">\n      <p style=\"font-size: 14px; color: ").concat(secondaryColor, ";\">Hormat kami,</p>\n      <strong style=\"color: ").concat(primaryColor, ";\">Tim Pengelola Layanan GPU ICT</strong><br>\n      <strong>Universitas Syiah Kuala</strong><br>\n      <a href=\"https://support.google.com/photos/thread/202686606/apakah-foto-atau-video-yg-dihapus-secara-permanen-tidak-akan-bisa-kembali-lagi?hl=id\" style=\"color: ").concat(primaryColor, "; text-decoration: none;\">https://support.google.com/photos/thread/202686606/apakah-foto-atau-video-yg-dihapus-secara-permanen-tidak-akan-bisa-kembali-lagi?hl=id</a>\n    </div>\n  ");
          _context.next = 6;
          return regeneratorRuntime.awrap((0, _sendEmail["default"])(userEmail, subject, message));

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}