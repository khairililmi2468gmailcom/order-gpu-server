"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notifyUserWithToken = notifyUserWithToken;
exports.notifyPaymentRejected = notifyPaymentRejected;
exports.notifyAdminOfNewOrder = notifyAdminOfNewOrder;
exports.sendActivationEmailNotification = sendActivationEmailNotification;
exports.sendDeactivationEmailNotification = sendDeactivationEmailNotification;
exports.notifyAdminOfUserManualActivation = notifyAdminOfUserManualActivation;

var _sendEmail = _interopRequireDefault(require("./sendEmail.js"));

var _db = _interopRequireDefault(require("../config/db.js"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/**
 * Mengirim notifikasi email kepada pengguna setelah permohonan layanan GPU disetujui
 * dan token telah diberikan. Memberikan informasi tentang cara memulai layanan
 * secara manual atau aktivasi otomatis.
 * @param {string} userEmail - Email pengguna.
 * @param {string} userName - Nama pengguna.
 * @param {string} token - Token akses GPU.
 * @param {string | null} domain - Domain yang terkait dengan layanan GPU (opsional).
 */
function notifyUserWithToken(userEmail, userName, token, domain) {
  var subject, primaryColor, secondaryColor, message;
  return regeneratorRuntime.async(function notifyUserWithToken$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          subject = 'Informasi Layanan GPU Anda Telah Disetujui - Universitas Syiah Kuala';
          primaryColor = '#007bff'; // Warna biru UNSYIA atau warna primer pilihan Anda

          secondaryColor = '#6c757d'; // Warna abu-abu sekunder

          message = "\n    <div style=\"font-family: 'Arial', sans-serif; line-height: 1.6; color: ".concat(secondaryColor, "; margin: 20px;\">\n      <h2 style=\"color: ").concat(primaryColor, "; margin-bottom: 20px;\">Layanan GPU Anda Telah Disetujui!</h2>\n      <p style=\"margin-bottom: 15px;\">Yang terhormat Bapak/Ibu ").concat(userName, ",</p>\n      <p style=\"margin-bottom: 15px;\">Dengan hormat,</p>\n      <p style=\"margin-bottom: 15px;\">Kami informasikan bahwa permohonan Anda untuk layanan GPU telah disetujui dan token akses telah diberikan. Layanan Anda kini siap untuk diaktifkan.</p>\n      \n      <div style=\"background-color: #fff3cd; border: 1px solid #ffeeba; border-radius: 5px; padding: 15px; margin-bottom: 20px; color: #856404;\">\n        <h3 style=\"color: #856404; margin-top: 0; margin-bottom: 10px;\">Pemberitahuan Penting:</h3>\n        <p style=\"margin-bottom: 10px;\">Untuk memulai layanan GPU Anda, Anda dapat menekan tombol <strong>\"Start\"</strong> yang tersedia pada daftar pesanan GPU Anda di halaman akun.</p>\n        <p>Jika Anda tidak menekan tombol \"Start\", sistem akan secara otomatis mengaktifkan layanan Anda <strong>30 menit</strong> setelah pesanan Anda disetujui. Setelah diaktifkan, layanan akan berjalan sesuai durasi yang Anda pilih.</p>\n      </div>\n\n      <div style=\"background-color: #f8f9fa; border: 1px solid #ced4da; border-radius: 5px; padding: 15px; margin-bottom: 10px;\">\n        <label style=\"display: block; margin-bottom: 5px; color: ").concat(primaryColor, "; font-weight: bold;\">Token Akses:</label>\n        <div style=\"display: flex; align-items: center;\">\n          <input\n            type=\"text\"\n            value=\"").concat(token, "\"\n            id=\"accessToken\"\n            style=\"flex-grow: 1; padding: 10px; border: 1px solid #ced4da; border-radius: 3px; font-size: 16px; color: ").concat(secondaryColor, ";\"\n            readonly\n            onClick=\"this.select(); document.execCommand('copy');\"\n          />\n        </div>\n        <p style=\"font-size: 12px; color: #6c757d; margin-top: 5px;\">Sentuh pada kotak token untuk untuk menyalin token.</p>\n      </div>\n      ").concat(domain ? "\n      <div style=\"background-color: #f8f9fa; border: 1px solid #ced4da; border-radius: 5px; padding: 15px; margin-bottom: 20px;\">\n        <label style=\"display: block; margin-bottom: 5px; color: ".concat(primaryColor, "; font-weight: bold;\">Domain Anda:</label>\n        <p style=\"padding: 10px; border: 1px solid #ced4da; border-radius: 3px; font-size: 16px; color: ").concat(secondaryColor, ";\">").concat(domain, "</p>\n      </div>\n      ") : '', "\n      <p style=\"margin-bottom: 15px;\">Mohon simpan informasi ini dengan aman dan jangan bagikan kepada pihak yang tidak berwenang. Token ini akan diperlukan setiap kali Anda mengakses layanan GPU melalui domain yang telah ditentukan.</p>\n      <p style=\"margin-bottom: 15px;\">Apabila Anda mengalami kendala atau memiliki pertanyaan lebih lanjut terkait aktivasi maupun penggunaan layanan, jangan ragu untuk menghubungi tim dukungan teknis kami melalui email ini atau melalui kanal komunikasi resmi yang tertera pada sistem layanan.</p>\n      <p style=\"margin-bottom: 20px;\">Terima kasih atas kepercayaan Anda dalam menggunakan layanan GPU Universitas Syiah Kuala.</p>\n      <hr style=\"border: 1px solid #e0e0e0; margin-bottom: 20px;\">\n      <p style=\"font-size: 14px; color: ").concat(secondaryColor, ";\">Hormat kami,</p>\n      <strong style=\"color: ").concat(primaryColor, ";\">Tim Pengelola Layanan GPU FMIPA USK</strong><br>\n      <strong>Universitas Syiah Kuala</strong><br>\n      <a href=\"https://support.google.com/photos/thread/202686606/apakah-foto-atau-video-yg-dihapus-secara-permanen-tidak-akan-bisa-kembali-lagi?hl=id\" style=\"color: ").concat(primaryColor, "; text-decoration: none;\">https://support.google.com/photos/thread/202686606/apakah-foto-atau-video-yg-dihapus-secara-permanen-tidak-akan-bisa-kembali-lagi?hl=id</a>\n    </div>\n  ");
          _context.next = 6;
          return regeneratorRuntime.awrap((0, _sendEmail["default"])(userEmail, subject, message));

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}

function notifyPaymentRejected(userEmail, userName, orderId, gpuPackageName, totalCost, rejectionReason) {
  var subject, primaryColor, secondaryColor, message;
  return regeneratorRuntime.async(function notifyPaymentRejected$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          subject = 'Pembaruan Status Pesanan Anda - Pembayaran Ditolak';
          primaryColor = '#dc3545'; // Warna merah untuk penolakan

          secondaryColor = '#6c757d';
          message = "\n      <div style=\"font-family: 'Arial', sans-serif; line-height: 1.6; color: ".concat(secondaryColor, "; margin: 20px;\">\n          <h2 style=\"color: ").concat(primaryColor, "; margin-bottom: 20px;\">Pembayaran Pesanan Anda Ditolak</h2>\n          <p style=\"margin-bottom: 15px;\">Yang terhormat Bapak/Ibu ").concat(userName, ",</p>\n          <p style=\"margin-bottom: 15px;\">Kami memberitahukan bahwa pembayaran untuk pesanan Anda **#").concat(orderId, "** dengan detail sebagai berikut telah **ditolak**:</p>\n          <div style=\"background-color: #f8f9fa; border: 1px solid #ced4da; border-radius: 5px; padding: 15px; margin-bottom: 20px;\">\n              <p><strong>ID Pesanan:</strong> #").concat(orderId, "</p>\n              <p><strong>Nama Paket GPU:</strong> ").concat(gpuPackageName, "</p>\n              <p><strong>Jumlah Pembayaran:</strong> Rp").concat(parseFloat(totalCost).toLocaleString('id-ID'), "</p>\n              <p style=\"margin-top: 10px;\"><strong>Alasan Penolakan:</strong></p>\n              <p style=\"white-space: pre-wrap; background-color: #ffe0e0; padding: 10px; border-radius: 3px; border: 1px solid #ffb3b3;\">").concat(rejectionReason, "</p>\n          </div>\n          <p style=\"margin-bottom: 15px;\">Dikarenakan pembayaran ditolak, pesanan Anda telah dibatalkan dan stok GPU yang sebelumnya dialokasikan telah dikembalikan.</p>\n          <p style=\"margin-bottom: 15px;\">Jika Anda memiliki pertanyaan atau ingin mengajukan pesanan baru setelah memperbaiki kendala pembayaran, silakan hubungi tim dukungan kami.</p>\n          <p style=\"margin-bottom: 20px;\">Terima kasih atas pengertian Anda.</p>\n          <hr style=\"border: 1px solid #e0e0e0; margin-bottom: 20px;\">\n          <p style=\"font-size: 14px; color: ").concat(secondaryColor, ";\">Hormat kami,</p>\n          <strong style=\"color: #007bff;\">Tim Pengelola Layanan GPU FMIPA USK</strong><br>\n          <strong>Universitas Syiah Kuala</strong><br>\n          <a href=\"https://support.google.com/photos/thread/202686606/apakah-foto-atau-video-yg-dihapus-secara-permanen-tidak-akan-bisa-kembali-lagi?hl=id\" style=\"color: #007bff; text-decoration: none;\">https://support.google.com/photos/thread/202686606/apakah-foto-atau-video-yg-dihapus-secara-permanen-tidak-akan-bisa-kembali-lagi?hl=id</a>\n      </div>\n  ");
          _context2.next = 6;
          return regeneratorRuntime.awrap((0, _sendEmail["default"])(userEmail, subject, message));

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function notifyAdminOfNewOrder(orderId, packageData, userData, totalCost, durationHours) {
  var subject, primaryColor, secondaryColor, _ref, _ref2, adminEmailsResult, adminEmails, message, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, email;

  return regeneratorRuntime.async(function notifyAdminOfNewOrder$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          subject = "Pemberitahuan Pesanan Baru: #".concat(orderId, " - ").concat(packageData.name);
          primaryColor = '#28a745'; // Warna hijau untuk notifikasi baru

          secondaryColor = '#6c757d';
          _context3.prev = 3;
          _context3.next = 6;
          return regeneratorRuntime.awrap(_db["default"].query("SELECT email FROM users WHERE role = 'admin'"));

        case 6:
          _ref = _context3.sent;
          _ref2 = _slicedToArray(_ref, 1);
          adminEmailsResult = _ref2[0];
          adminEmails = adminEmailsResult.map(function (row) {
            return row.email;
          });

          if (!(adminEmails.length === 0)) {
            _context3.next = 13;
            break;
          }

          console.warn('Tidak ada admin ditemukan untuk menerima notifikasi pesanan baru.');
          return _context3.abrupt("return");

        case 13:
          message = "\n      <div style=\"font-family: 'Arial', sans-serif; line-height: 1.6; color: ".concat(secondaryColor, "; margin: 20px;\">\n        <h2 style=\"color: ").concat(primaryColor, "; margin-bottom: 20px;\">Pesanan Baru Telah Dibuat!</h2>\n        <p style=\"margin-bottom: 15px;\">Halo Admin,</p>\n        <p style=\"margin-bottom: 15px;\">Sebuah pesanan baru telah berhasil dibuat di sistem Anda. Berikut adalah detail pesanan:</p>\n        <div style=\"background-color: #f8f9fa; border: 1px solid #ced4da; border-radius: 5px; padding: 15px; margin-bottom: 20px;\">\n          <h3 style=\"color: ").concat(primaryColor, "; margin-top: 0; margin-bottom: 10px;\">Detail Pesanan</h3>\n          <ul style=\"list-style: none; padding: 0; margin: 0;\">\n            <li style=\"margin-bottom: 8px;\"><strong>ID Pesanan:</strong> ").concat(orderId, "</li>\n            <li style=\"margin-bottom: 8px;\"><strong>Paket GPU:</strong> ").concat(packageData.name, "</li>\n            <li style=\"margin-bottom: 8px;\"><strong>Durasi:</strong> ").concat(durationHours, " Jam</li>\n            <li style=\"margin-bottom: 8px;\"><strong>Total Biaya:</strong> Rp ").concat(parseFloat(totalCost).toLocaleString('id-ID'), "</li>\n            <li style=\"margin-bottom: 8px;\"><strong>Status:</strong> Pending Pembayaran</li>\n          </ul>\n        </div>\n        <div style=\"background-color: #f8f9fa; border: 1px solid #ced4da; border-radius: 5px; padding: 15px; margin-bottom: 20px;\">\n          <h3 style=\"color: ").concat(primaryColor, "; margin-top: 0; margin-bottom: 10px;\">Biodata Pemesan</h3>\n          <ul style=\"list-style: none; padding: 0; margin: 0;\">\n            <li style=\"margin-bottom: 8px;\"><strong>Nama:</strong> ").concat(userData.name, "</li>\n            <li style=\"margin-bottom: 8px;\"><strong>Email:</strong> ").concat(userData.email, "</li>\n            <li style=\"margin-bottom: 8px;\"><strong>Telepon:</strong> ").concat(userData.phone || '-', "</li>\n          </ul>\n        </div>\n        <p style=\"margin-bottom: 15px;\">Mohon segera periksa pesanan ini dan tunggu konfirmasi pembayaran dari pelanggan.</p>\n        <p style=\"margin-bottom: 20px;\">Anda dapat melihat detail pesanan dan memprosesnya melalui panel admin Anda.</p>\n        <p style=\"text-align: center; margin-bottom: 20px;\">\n          <a href=\"").concat(process.env.FRONTEND_URL, "/admin/orders\" style=\"display: inline-block; padding: 12px 25px; background-color: ").concat(primaryColor, "; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;\">Buka Panel Admin</a>\n        </p>\n        <hr style=\"border: 1px solid #e0e0e0; margin-bottom: 20px;\">\n        <p style=\"font-size: 14px; color: ").concat(secondaryColor, ";\">Hormat kami,</p>\n        <strong style=\"color: ").concat(primaryColor, ";\">Sistem Notifikasi GPU FMIPA USK</strong>\n      </div>\n    "); // Kirim email ke semua admin

          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context3.prev = 17;
          _iterator = adminEmails[Symbol.iterator]();

        case 19:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context3.next = 26;
            break;
          }

          email = _step.value;
          _context3.next = 23;
          return regeneratorRuntime.awrap((0, _sendEmail["default"])(email, subject, message));

        case 23:
          _iteratorNormalCompletion = true;
          _context3.next = 19;
          break;

        case 26:
          _context3.next = 32;
          break;

        case 28:
          _context3.prev = 28;
          _context3.t0 = _context3["catch"](17);
          _didIteratorError = true;
          _iteratorError = _context3.t0;

        case 32:
          _context3.prev = 32;
          _context3.prev = 33;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 35:
          _context3.prev = 35;

          if (!_didIteratorError) {
            _context3.next = 38;
            break;
          }

          throw _iteratorError;

        case 38:
          return _context3.finish(35);

        case 39:
          return _context3.finish(32);

        case 40:
          _context3.next = 45;
          break;

        case 42:
          _context3.prev = 42;
          _context3.t1 = _context3["catch"](3);
          console.error('Error sending new order notification to admin:', _context3.t1);

        case 45:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[3, 42], [17, 28, 32, 40], [33,, 35, 39]]);
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


function sendActivationEmailNotification(userEmail, userName, token, domain, startDate, endDate) {
  var subject, primaryColor, secondaryColor, formattedStartDate, formattedEndDate, message;
  return regeneratorRuntime.async(function sendActivationEmailNotification$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          subject = 'Informasi Aktivasi Layanan GPU - Universitas Syiah Kuala';
          primaryColor = '#007bff'; // Warna biru UNSYIA atau warna primer pilihan Anda

          secondaryColor = '#6c757d'; // Warna abu-abu sekunder
          // Format tanggal agar lebih mudah dibaca

          formattedStartDate = (0, _moment["default"])(startDate).format('DD MMMM YYYY HH:mm:ss');
          formattedEndDate = (0, _moment["default"])(endDate).format('DD MMMM YYYY HH:mm:ss');
          message = "\n    <div style=\"font-family: 'Arial', sans-serif; line-height: 1.6; color: ".concat(secondaryColor, "; margin: 20px;\">\n      <h2 style=\"color: ").concat(primaryColor, "; margin-bottom: 20px;\">Aktivasi Layanan GPU Anda Berhasil</h2>\n      <p style=\"margin-bottom: 15px;\">Yang terhormat Bapak/Ibu ").concat(userName, ",</p>\n      <p style=\"margin-bottom: 15px;\">Dengan hormat,</p>\n      <p style=\"margin-bottom: 15px;\">Kami informasikan bahwa layanan GPU Anda telah berhasil diaktifkan secara otomatis, 30 menit setelah pesanan Anda disetujui. Berikut adalah detail akses dan periode aktivasi layanan Anda:</p>\n      \n      <div style=\"background-color: #f8f9fa; border: 1px solid #ced4da; border-radius: 5px; padding: 15px; margin-bottom: 20px;\">\n        <label style=\"display: block; margin-bottom: 5px; color: ").concat(primaryColor, "; font-weight: bold;\">Periode Aktivasi Layanan:</label>\n        <p style=\"margin-bottom: 5px;\"><strong>Mulai:</strong> ").concat(formattedStartDate, " WIB</p>\n        <p><strong>Berakhir:</strong> ").concat(formattedEndDate, " WIB</p>\n      </div>\n\n      <div style=\"background-color: #f8f9fa; border: 1px solid #ced4da; border-radius: 5px; padding: 15px; margin-bottom: 10px;\">\n        <label style=\"display: block; margin-bottom: 5px; color: ").concat(primaryColor, "; font-weight: bold;\">Token Akses:</label>\n        <div style=\"display: flex; align-items: center;\">\n          <input\n            type=\"text\"\n            value=\"").concat(token, "\"\n            id=\"accessToken\"\n            style=\"flex-grow: 1; padding: 10px; border: 1px solid #ced4da; border-radius: 3px; font-size: 16px; color: ").concat(secondaryColor, ";\"\n            readonly\n            onClick=\"this.select(); document.execCommand('copy');\"\n          />\n        </div>\n        <p style=\"font-size: 12px; color: #6c757d; margin-top: 5px;\">Sentuh pada kotak token untuk untuk menyalin token.</p>\n      </div>\n      ").concat(domain ? "\n      <div style=\"background-color: #f8f9fa; border: 1px solid #ced4da; border-radius: 5px; padding: 15px; margin-bottom: 20px;\">\n        <label style=\"display: block; margin-bottom: 5px; color: ".concat(primaryColor, "; font-weight: bold;\">Domain Anda:</label>\n        <p style=\"padding: 10px; border: 1px solid #ced4da; border-radius: 3px; font-size: 16px; color: ").concat(secondaryColor, ";\">").concat(domain, "</p>\n      </div>\n      ") : '', "\n      <p style=\"margin-bottom: 15px;\">Mohon simpan informasi ini dengan aman dan jangan bagikan kepada pihak yang tidak berwenang. Token ini akan diperlukan setiap kali Anda mengakses layanan GPU melalui domain yang telah ditentukan.</p>\n      <p style=\"margin-bottom: 15px;\">Apabila Anda mengalami kendala atau memiliki pertanyaan lebih lanjut terkait aktivasi maupun penggunaan layanan, jangan ragu untuk menghubungi tim dukungan teknis kami melalui email ini atau melalui kanal komunikasi resmi yang tertera pada sistem layanan.</p>\n      <p style=\"margin-bottom: 20px;\">Terima kasih atas kepercayaan Anda dalam menggunakan layanan GPU Universitas Syiah Kuala.</p>\n      <hr style=\"border: 1px solid #e0e0e0; margin-bottom: 20px;\">\n      <p style=\"font-size: 14px; color: ").concat(secondaryColor, ";\">Hormat kami,</p>\n      <strong style=\"color: ").concat(primaryColor, ";\">Tim Pengelola Layanan GPU FMIPA USK</strong><br>\n      <strong>Universitas Syiah Kuala</strong><br>\n      <a href=\"https://support.google.com/photos/thread/202686606/apakah-foto-atau-video-yg-dihapus-secara-permanen-tidak-akan-bisa-kembali-lagi?hl=id\" style=\"color: ").concat(primaryColor, "; text-decoration: none;\">https://support.google.com/photos/thread/202686606/apakah-foto-atau-video-yg-dihapus-secara-permanen-tidak-akan-bisa-kembali-lagi?hl=id</a>\n    </div>\n  ");
          _context4.next = 8;
          return regeneratorRuntime.awrap((0, _sendEmail["default"])(userEmail, subject, message));

        case 8:
        case "end":
          return _context4.stop();
      }
    }
  });
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


function sendDeactivationEmailNotification(userEmail, userName, orderId, token, domain, endDate) {
  var subject, primaryColor, secondaryColor, formattedEndDate, message;
  return regeneratorRuntime.async(function sendDeactivationEmailNotification$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          subject = 'Pemberitahuan Penonaktifan Layanan GPU Anda - Universitas Syiah Kuala';
          primaryColor = '#dc3545'; // Warna merah untuk penonaktifan

          secondaryColor = '#6c757d'; // Warna abu-abu sekunder

          formattedEndDate = (0, _moment["default"])(endDate).format('DD MMMM HH:mm:ss');
          message = "\n    <div style=\"font-family: 'Arial', sans-serif; line-height: 1.6; color: ".concat(secondaryColor, "; margin: 20px;\">\n      <h2 style=\"color: ").concat(primaryColor, "; margin-bottom: 20px;\">Layanan GPU Anda Telah Dinonaktifkan</h2>\n      <p style=\"margin-bottom: 15px;\">Yang terhormat Bapak/Ibu ").concat(userName, ",</p>\n      <p style=\"margin-bottom: 15px;\">Dengan hormat,</p>\n      <p style=\"margin-bottom: 15px;\">Kami informasikan bahwa layanan GPU Anda dengan ID Pesanan <strong>#").concat(orderId, "</strong> telah dinonaktifkan pada tanggal <strong>").concat(formattedEndDate, " WIB</strong> karena telah mencapai akhir periode aktifnya.</p>\n      \n      <div style=\"background-color: #f8f9fa; border: 1px solid #ced4da; border-radius: 5px; padding: 15px; margin-bottom: 20px;\">\n        <label style=\"display: block; margin-bottom: 5px; color: ").concat(primaryColor, "; font-weight: bold;\">Detail Layanan yang Dinonaktifkan:</label>\n        <p style=\"margin-bottom: 5px;\"><strong>ID Pesanan:</strong> #").concat(orderId, "</p>\n        ").concat(token ? "<p style=\"margin-bottom: 5px;\"><strong>Token Akses:</strong> ".concat(token, "</p>") : '', "\n        ").concat(domain ? "<p><strong>Domain:</strong> ".concat(domain, "</p>") : '', "\n        <p><strong>Waktu Dinonaktifkan:</strong> ").concat(formattedEndDate, " WIB</p>\n      </div>\n\n      <p style=\"margin-bottom: 15px;\">Token akses dan domain yang terkait dengan layanan ini tidak lagi aktif. Jika Anda memerlukan layanan GPU kembali, Anda dapat mengajukan pesanan baru melalui portal layanan kami.</p>\n      <p style=\"margin-bottom: 15px;\">Apabila Anda memiliki pertanyaan atau memerlukan bantuan lebih lanjut, jangan ragu untuk menghubungi tim dukungan teknis kami.</p>\n      <p style=\"margin-bottom: 20px;\">Terima kasih atas kepercayaan Anda dalam menggunakan layanan GPU Universitas Syiah Kuala.</p>\n      <hr style=\"border: 1px solid #e0e0e0; margin-bottom: 20px;\">\n      <p style=\"font-size: 14px; color: ").concat(secondaryColor, ";\">Hormat kami,</p>\n      <strong style=\"color: ").concat(primaryColor, ";\">Tim Pengelola Layanan GPU FMIPA USK</strong><br>\n      <strong>Universitas Syiah Kuala</strong><br>\n      <a href=\"https://support.google.com/photos/thread/202686606/apakah-foto-atau-video-yg-dihapus-secara-permanen-tidak-akan-bisa-kembali-lagi?hl=id\" style=\"color: ").concat(primaryColor, "; text-decoration: none;\">https://support.google.com/photos/thread/202686606/apakah-foto-atau-video-yg-dihapus-secara-permanen-tidak-akan-bisa-kembali-lagi?hl=id</a>\n    </div>\n  ");
          _context5.next = 7;
          return regeneratorRuntime.awrap((0, _sendEmail["default"])(userEmail, subject, message));

        case 7:
        case "end":
          return _context5.stop();
      }
    }
  });
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


function notifyAdminOfUserManualActivation(orderId, userName, userEmail, startDate, endDate, domain) {
  var subject, primaryColor, secondaryColor, formattedStartDate, formattedEndDate, _ref3, _ref4, adminEmailsResult, adminEmails, message, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, email;

  return regeneratorRuntime.async(function notifyAdminOfUserManualActivation$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          subject = "Pemberitahuan: Pengguna Mengaktifkan Layanan GPU Secara Manual - Pesanan #".concat(orderId);
          primaryColor = '#28a745'; // Warna hijau untuk notifikasi

          secondaryColor = '#6c757d';
          formattedStartDate = (0, _moment["default"])(startDate).format('DD MMMM HH:mm:ss');
          formattedEndDate = (0, _moment["default"])(endDate).format('DD MMMM HH:mm:ss');
          _context6.prev = 5;
          _context6.next = 8;
          return regeneratorRuntime.awrap(_db["default"].query("SELECT email FROM users WHERE role = 'admin'"));

        case 8:
          _ref3 = _context6.sent;
          _ref4 = _slicedToArray(_ref3, 1);
          adminEmailsResult = _ref4[0];
          adminEmails = adminEmailsResult.map(function (row) {
            return row.email;
          });

          if (!(adminEmails.length === 0)) {
            _context6.next = 15;
            break;
          }

          console.warn('Tidak ada admin ditemukan untuk menerima notifikasi aktivasi manual pengguna.');
          return _context6.abrupt("return");

        case 15:
          message = "\n      <div style=\"font-family: 'Arial', sans-serif; line-height: 1.6; color: ".concat(secondaryColor, "; margin: 20px;\">\n        <h2 style=\"color: ").concat(primaryColor, "; margin-bottom: 20px;\">Layanan GPU Diaktifkan Secara Manual oleh Pengguna</h2>\n        <p style=\"margin-bottom: 15px;\">Halo Admin,</p>\n        <p style=\"margin-bottom: 15px;\">Seorang pengguna telah mengaktifkan layanan GPU mereka secara manual melalui tombol \"Start\". Berikut adalah detail pesanan yang diaktifkan:</p>\n        <div style=\"background-color: #f8f9fa; border: 1px solid #ced4da; border-radius: 5px; padding: 15px; margin-bottom: 20px;\">\n          <h3 style=\"color: ").concat(primaryColor, "; margin-top: 0; margin-bottom: 10px;\">Detail Aktivasi:</h3>\n          <ul style=\"list-style: none; padding: 0; margin: 0;\">\n            <li style=\"margin-bottom: 8px;\"><strong>ID Pesanan:</strong> #").concat(orderId, "</li>\n            <li style=\"margin-bottom: 8px;\"><strong>Nama Pengguna:</strong> ").concat(userName, "</li>\n            <li style=\"margin-bottom: 8px;\"><strong>Email Pengguna:</strong> ").concat(userEmail, "</li>\n            <li style=\"margin-bottom: 8px;\"><strong>Waktu Mulai:</strong> ").concat(formattedStartDate, " WIB</li>\n            <li style=\"margin-bottom: 8px;\"><strong>Waktu Berakhir:</strong> ").concat(formattedEndDate, " WIB</li>\n            ").concat(domain ? "<li style=\"margin-bottom: 8px;\"><strong>Domain:</strong> ".concat(domain, "</li>") : '', "\n          </ul>\n        </div>\n        <p style=\"margin-bottom: 15px;\">Layanan ini sekarang berstatus 'active' dan waktu penggunaan telah dimulai.</p>\n        <p style=\"margin-bottom: 20px;\">Mohon periksa detail pesanan ini di panel admin Anda jika diperlukan.</p>\n        <p style=\"text-align: center; margin-bottom: 20px;\">\n          <a href=\"").concat(process.env.FRONTEND_URL, "/admin/payments\" style=\"display: inline-block; padding: 12px 25px; background-color: ").concat(primaryColor, "; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;\">Lihat Pesanan di Admin Panel</a>\n        </p>\n        <hr style=\"border: 1px solid #e0e0e0; margin-bottom: 20px;\">\n        <p style=\"font-size: 14px; color: ").concat(secondaryColor, ";\">Hormat kami,</p>\n        <strong style=\"color: ").concat(primaryColor, ";\">Sistem Notifikasi GPU FMIPA USK</strong>\n      </div>\n    "); // Kirim email ke semua admin

          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context6.prev = 19;
          _iterator2 = adminEmails[Symbol.iterator]();

        case 21:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context6.next = 28;
            break;
          }

          email = _step2.value;
          _context6.next = 25;
          return regeneratorRuntime.awrap((0, _sendEmail["default"])(email, subject, message));

        case 25:
          _iteratorNormalCompletion2 = true;
          _context6.next = 21;
          break;

        case 28:
          _context6.next = 34;
          break;

        case 30:
          _context6.prev = 30;
          _context6.t0 = _context6["catch"](19);
          _didIteratorError2 = true;
          _iteratorError2 = _context6.t0;

        case 34:
          _context6.prev = 34;
          _context6.prev = 35;

          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }

        case 37:
          _context6.prev = 37;

          if (!_didIteratorError2) {
            _context6.next = 40;
            break;
          }

          throw _iteratorError2;

        case 40:
          return _context6.finish(37);

        case 41:
          return _context6.finish(34);

        case 42:
          _context6.next = 47;
          break;

        case 44:
          _context6.prev = 44;
          _context6.t1 = _context6["catch"](5);
          console.error('Error sending user manual activation notification to admin:', _context6.t1);

        case 47:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[5, 44], [19, 30, 34, 42], [35,, 37, 41]]);
}