"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deactivateOrder = exports.startUsage = exports.updatePassword = exports.updateProfile = exports.deleteOrder = exports.getGpuToken = exports.getMyOrders = void 0;

var _db = _interopRequireDefault(require("../config/db.js"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _Order = _interopRequireDefault(require("../models/Order.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var getMyOrders = function getMyOrders(req, res) {
  var _ref, _ref2, orders;

  return regeneratorRuntime.async(function getMyOrders$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(!req.user || !req.user.id)) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            error: 'User not authenticated'
          }));

        case 2:
          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap(_db["default"].query("SELECT \n         o.*, \n         g.name AS package_name, \n         p.proof_url, \n         p.status AS payment_status, \n         p.verified_by \n       FROM orders o\n       JOIN gpu_packages g ON o.gpu_package_id = g.id\n       LEFT JOIN payments p ON p.order_id = o.id\n       WHERE o.user_id = ?", [req.user.id]));

        case 5:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 1);
          orders = _ref2[0];

          if (!(orders.length === 0)) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: 'No orders found'
          }));

        case 10:
          res.json(orders);
          _context.next = 17;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](2);
          console.error(_context.t0);
          res.status(500).json({
            error: 'Failed to retrieve orders'
          });

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 13]]);
};

exports.getMyOrders = getMyOrders;

var getGpuToken = function getGpuToken(req, res) {
  var id, userId, _ref3, _ref4, orders, order;

  return regeneratorRuntime.async(function getGpuToken$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          id = req.params.id; // Mendapatkan id pesanan dari parameter URL

          userId = req.user.id; // Mendapatkan id pengguna dari token JWT

          _context2.prev = 2;
          _context2.next = 5;
          return regeneratorRuntime.awrap(_db["default"].query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [id, userId]));

        case 5:
          _ref3 = _context2.sent;
          _ref4 = _slicedToArray(_ref3, 1);
          orders = _ref4[0];
          order = orders[0]; // Mengambil pesanan pertama
          // Jika pesanan tidak ditemukan, kirimkan respons 404

          if (order) {
            _context2.next = 11;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            error: 'Pesanan tidak ditemukan'
          }));

        case 11:
          _context2.t0 = order.status;
          _context2.next = _context2.t0 === 'pending_payment' ? 14 : _context2.t0 === 'pending_approval' ? 15 : _context2.t0 === 'rejected' ? 16 : _context2.t0 === 'approved' ? 17 : _context2.t0 === 'active' ? 18 : _context2.t0 === 'completed' ? 19 : 20;
          break;

        case 14:
          return _context2.abrupt("return", res.status(400).json({
            error: 'Pesanan masih menunggu pembayaran'
          }));

        case 15:
          return _context2.abrupt("return", res.status(400).json({
            error: 'Pesanan masih menunggu persetujuan'
          }));

        case 16:
          return _context2.abrupt("return", res.status(403).json({
            error: 'Pesanan telah ditolak'
          }));

        case 17:
          return _context2.abrupt("return", res.json({
            token: order.gpu_token
          }));

        case 18:
          return _context2.abrupt("return", res.json({
            token: order.gpu_token
          }));

        case 19:
          return _context2.abrupt("return", res.status(403).json({
            error: 'Pesanan telah selesai'
          }));

        case 20:
          return _context2.abrupt("return", res.status(400).json({
            error: 'Status pesanan tidak valid'
          }));

        case 21:
          _context2.next = 26;
          break;

        case 23:
          _context2.prev = 23;
          _context2.t1 = _context2["catch"](2);
          // Jika ada kesalahan pada query atau server, kirimkan respons 500
          res.status(500).json({
            error: 'Gagal mengambil token'
          });

        case 26:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[2, 23]]);
}; // src/controllers/userController.js


exports.getGpuToken = getGpuToken;

var deleteOrder = function deleteOrder(req, res) {
  var orderId, userId, _ref5, _ref6, orders, orderToDelete;

  return regeneratorRuntime.async(function deleteOrder$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          orderId = req.params.id;
          userId = req.user.id; // Asumsi req.user.id tersedia dari middleware autentikasi

          _context3.prev = 2;
          _context3.next = 5;
          return regeneratorRuntime.awrap(_db["default"].query('SELECT id, is_active, status FROM orders WHERE id = ? AND user_id = ?', [orderId, userId]));

        case 5:
          _ref5 = _context3.sent;
          _ref6 = _slicedToArray(_ref5, 1);
          orders = _ref6[0];

          if (!(orders.length === 0)) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: 'Order tidak ditemukan atau bukan milik Anda'
          }));

        case 10:
          orderToDelete = orders[0]; // --- Penambahan Logika Validasi Status Aktif ---
          // Pesanan tidak bisa dihapus jika is_active = 1 DAN status = 'active'

          if (!(orderToDelete.is_active === 1 && orderToDelete.status === 'active')) {
            _context3.next = 13;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: 'Pesanan aktif tidak dapat dihapus.'
          }));

        case 13:
          _context3.next = 15;
          return regeneratorRuntime.awrap(_db["default"].query('START TRANSACTION'));

        case 15:
          _context3.prev = 15;
          _context3.next = 18;
          return regeneratorRuntime.awrap(_db["default"].query('DELETE FROM payments WHERE order_id = ?', [orderId]));

        case 18:
          _context3.next = 20;
          return regeneratorRuntime.awrap(_db["default"].query('DELETE FROM orders WHERE id = ?', [orderId]));

        case 20:
          _context3.next = 22;
          return regeneratorRuntime.awrap(_db["default"].query('COMMIT'));

        case 22:
          // Commit transaksi jika semua berhasil
          res.json({
            message: 'Order berhasil dihapus'
          });
          _context3.next = 31;
          break;

        case 25:
          _context3.prev = 25;
          _context3.t0 = _context3["catch"](15);
          _context3.next = 29;
          return regeneratorRuntime.awrap(_db["default"].query('ROLLBACK'));

        case 29:
          // Rollback jika ada kesalahan dalam transaksi
          console.error('Transaction Error during order deletion:', _context3.t0);
          res.status(500).json({
            error: 'Gagal menghapus order akibat kesalahan transaksi.'
          });

        case 31:
          _context3.next = 37;
          break;

        case 33:
          _context3.prev = 33;
          _context3.t1 = _context3["catch"](2);
          console.error('Error deleting order:', _context3.t1);
          res.status(500).json({
            error: 'Gagal menghapus order'
          });

        case 37:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[2, 33], [15, 25]]);
};

exports.deleteOrder = deleteOrder;

var updateProfile = function updateProfile(req, res) {
  var userId, _req$body, name, email, phone;

  return regeneratorRuntime.async(function updateProfile$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          userId = req.user.id;
          _req$body = req.body, name = _req$body.name, email = _req$body.email, phone = _req$body.phone;

          if (!(!name || !email)) {
            _context4.next = 4;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            error: 'Name dan email wajib diisi'
          }));

        case 4:
          _context4.prev = 4;
          _context4.next = 7;
          return regeneratorRuntime.awrap(_db["default"].query('UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?', [name, email, phone || null, userId]));

        case 7:
          res.json({
            message: 'Profil berhasil diperbarui'
          });
          _context4.next = 14;
          break;

        case 10:
          _context4.prev = 10;
          _context4.t0 = _context4["catch"](4);
          console.error(_context4.t0);
          res.status(500).json({
            error: 'Gagal memperbarui profil'
          });

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[4, 10]]);
};

exports.updateProfile = updateProfile;

var updatePassword = function updatePassword(req, res) {
  var userId, _req$body2, currentPassword, newPassword, _ref7, _ref8, users, user, match, hashed;

  return regeneratorRuntime.async(function updatePassword$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          userId = req.user.id;
          _req$body2 = req.body, currentPassword = _req$body2.currentPassword, newPassword = _req$body2.newPassword;

          if (!(!currentPassword || !newPassword)) {
            _context5.next = 4;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            error: 'Password lama dan baru wajib diisi'
          }));

        case 4:
          _context5.prev = 4;
          _context5.next = 7;
          return regeneratorRuntime.awrap(_db["default"].query('SELECT password FROM users WHERE id = ?', [userId]));

        case 7:
          _ref7 = _context5.sent;
          _ref8 = _slicedToArray(_ref7, 1);
          users = _ref8[0];
          user = users[0];
          _context5.next = 13;
          return regeneratorRuntime.awrap(_bcryptjs["default"].compare(currentPassword, user.password));

        case 13:
          match = _context5.sent;

          if (match) {
            _context5.next = 16;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            error: 'Password lama salah'
          }));

        case 16:
          _context5.next = 18;
          return regeneratorRuntime.awrap(_bcryptjs["default"].hash(newPassword, 10));

        case 18:
          hashed = _context5.sent;
          _context5.next = 21;
          return regeneratorRuntime.awrap(_db["default"].query('UPDATE users SET password = ? WHERE id = ?', [hashed, userId]));

        case 21:
          res.json({
            message: 'Password berhasil diperbarui'
          });
          _context5.next = 28;
          break;

        case 24:
          _context5.prev = 24;
          _context5.t0 = _context5["catch"](4);
          console.error(_context5.t0);
          res.status(500).json({
            error: 'Gagal memperbarui password'
          });

        case 28:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[4, 24]]);
};

exports.updatePassword = updatePassword;

var startUsage = function startUsage(req, res) {
  var orderId, order, startDate, endDate, updateResult, updatedOrder;
  return regeneratorRuntime.async(function startUsage$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          orderId = req.body.orderId;
          _context6.next = 4;
          return regeneratorRuntime.awrap(_Order["default"].findById(orderId));

        case 4:
          order = _context6.sent;

          if (order) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            message: 'Pesanan tidak ditemukan.'
          }));

        case 7:
          if (!(order.is_active === 1)) {
            _context6.next = 9;
            break;
          }

          return _context6.abrupt("return", res.status(200).json({
            message: 'Waktu penggunaan pesanan sudah dimulai sebelumnya.',
            order: order
          }));

        case 9:
          if (!(order.status !== 'approved')) {
            _context6.next = 11;
            break;
          }

          return _context6.abrupt("return", res.status(400).json({
            message: 'Pesanan belum disetujui untuk dimulai.'
          }));

        case 11:
          _context6.next = 13;
          return regeneratorRuntime.awrap(_db["default"].query('START TRANSACTION'));

        case 13:
          _context6.prev = 13;
          // --- DIHAPUS: Logika pemeriksaan dan pengurangan stok GPU ---
          // Logika ini sekarang ditangani di fungsi verifyPayment (saat status 'verified')
          // const [gpuPackage] = await pool.query('SELECT stock_available FROM gpu_packages WHERE id = ? FOR UPDATE', [order.gpu_package_id]);
          // if (!gpuPackage || gpuPackage.length === 0) {
          //   throw new Error('Paket GPU tidak ditemukan atau sudah dihapus.');
          // }
          // if (gpuPackage[0].stock_available <= 0) {
          //   throw new Error('Stok GPU tidak tersedia untuk memulai pesanan ini.');
          // }
          // await pool.query('UPDATE gpu_packages SET stock_available = stock_available - 1 WHERE id = ?', [order.gpu_package_id]);
          // --- AKHIR DIHAPUS ---
          // Perbarui detail pesanan: set tanggal mulai, tanggal berakhir, aktifkan, dan ubah status
          startDate = new Date();
          endDate = new Date(startDate.getTime() + order.duration_hours * 60 * 60 * 1000); // Menghitung end_date

          _context6.next = 18;
          return regeneratorRuntime.awrap(_Order["default"].findByIdAndUpdate(orderId, {
            start_date: startDate,
            end_date: endDate,
            is_active: 1,
            // Set aktif
            status: 'active' // Ubah status menjadi 'active'

          }));

        case 18:
          updateResult = _context6.sent;

          if (!(updateResult.affectedRows === 0)) {
            _context6.next = 21;
            break;
          }

          throw new Error('Gagal memperbarui status pesanan.');

        case 21:
          _context6.next = 23;
          return regeneratorRuntime.awrap(_db["default"].query('COMMIT'));

        case 23:
          _context6.next = 25;
          return regeneratorRuntime.awrap(_Order["default"].findById(orderId));

        case 25:
          updatedOrder = _context6.sent;
          return _context6.abrupt("return", res.status(200).json({
            message: 'Waktu penggunaan pesanan dimulai.',
            order: updatedOrder
          }));

        case 29:
          _context6.prev = 29;
          _context6.t0 = _context6["catch"](13);
          _context6.next = 33;
          return regeneratorRuntime.awrap(_db["default"].query('ROLLBACK'));

        case 33:
          console.error("Transaction failed during startUsage:", _context6.t0);
          return _context6.abrupt("return", res.status(500).json({
            message: _context6.t0.message || 'Terjadi kesalahan saat mencatat awal penggunaan (transaksi dibatalkan).'
          }));

        case 35:
          _context6.next = 41;
          break;

        case 37:
          _context6.prev = 37;
          _context6.t1 = _context6["catch"](0);
          console.error("Gagal mencatat awal penggunaan:", _context6.t1);
          return _context6.abrupt("return", res.status(500).json({
            message: 'Terjadi kesalahan saat mencatat awal penggunaan.'
          }));

        case 41:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 37], [13, 29]]);
};

exports.startUsage = startUsage;

var deactivateOrder = function deactivateOrder(req, res) {
  var id, order, updateResult;
  return regeneratorRuntime.async(function deactivateOrder$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          id = req.params.id;
          _context7.next = 4;
          return regeneratorRuntime.awrap(_Order["default"].findById(id));

        case 4:
          order = _context7.sent;

          if (order) {
            _context7.next = 7;
            break;
          }

          return _context7.abrupt("return", res.status(404).json({
            message: 'Pesanan tidak ditemukan.'
          }));

        case 7:
          if (!(order.is_active === 0)) {
            _context7.next = 9;
            break;
          }

          return _context7.abrupt("return", res.status(200).json({
            message: 'Pesanan sudah tidak aktif.'
          }));

        case 9:
          _context7.next = 11;
          return regeneratorRuntime.awrap(_Order["default"].findByIdAndUpdate(id, {
            is_active: 0
          }));

        case 11:
          updateResult = _context7.sent;

          if (!(updateResult.affectedRows > 0)) {
            _context7.next = 16;
            break;
          }

          return _context7.abrupt("return", res.status(200).json({
            message: 'Pesanan berhasil dinonaktifkan.'
          }));

        case 16:
          return _context7.abrupt("return", res.status(500).json({
            message: 'Gagal menonaktifkan pesanan.'
          }));

        case 17:
          _context7.next = 23;
          break;

        case 19:
          _context7.prev = 19;
          _context7.t0 = _context7["catch"](0);
          console.error("Gagal menonaktifkan pesanan:", _context7.t0);
          return _context7.abrupt("return", res.status(500).json({
            message: 'Terjadi kesalahan saat menonaktifkan pesanan.'
          }));

        case 23:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

exports.deactivateOrder = deactivateOrder;