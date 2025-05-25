"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _nodeCron = _interopRequireDefault(require("node-cron"));

var _Order = _interopRequireDefault(require("../models/Order.js"));

var _db = _interopRequireDefault(require("../config/db.js"));

var _moment = _interopRequireDefault(require("moment"));

var _notification = require("../utils/notification.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Import fungsi notifikasi penonaktifan
var runDeactivationCronJob = function runDeactivationCronJob() {
  // Jadwalkan untuk berjalan setiap menit
  _nodeCron["default"].schedule('* * * * *', function _callee() {
    var _ref, _ref2, expiredOrders, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, order, updateOrderResult, _ref3, _ref4, updateGpuResult;

    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            console.log("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Memeriksa dan menonaktifkan pesanan kedaluwarsa...")); // Mengambil order yang aktif dan end_date-nya sudah lewat
            // Lakukan JOIN dengan tabel users untuk mendapatkan email dan nama pengguna
            // serta token dan domain dari tabel orders untuk notifikasi email.

            _context.next = 4;
            return regeneratorRuntime.awrap(_db["default"].query("SELECT o.id, o.token, o.domain, o.gpu_package_id, o.end_date, u.email AS user_email, u.name AS user_name\n                 FROM orders o\n                 JOIN users u ON o.user_id = u.id\n                 WHERE o.is_active = 1\n                   AND o.end_date <= NOW()"));

          case 4:
            _ref = _context.sent;
            _ref2 = _slicedToArray(_ref, 1);
            expiredOrders = _ref2[0];

            if (!(expiredOrders.length > 0)) {
              _context.next = 68;
              break;
            }

            console.log("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Menemukan ").concat(expiredOrders.length, " pesanan kedaluwarsa."));
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 12;
            _iterator = expiredOrders[Symbol.iterator]();

          case 14:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 52;
              break;
            }

            order = _step.value;
            _context.next = 18;
            return regeneratorRuntime.awrap(_db["default"].query('START TRANSACTION'));

          case 18:
            _context.prev = 18;
            _context.next = 21;
            return regeneratorRuntime.awrap(_Order["default"].findByIdAndUpdate(order.id, {
              is_active: 0,
              status: 'completed'
            }));

          case 21:
            updateOrderResult = _context.sent;

            if (!(updateOrderResult.affectedRows > 0)) {
              _context.next = 39;
              break;
            }

            console.log("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Pesanan ID ").concat(order.id, " dinonaktifkan.")); // 2. Kembalikan stok GPU ke gpu_packages

            if (!order.gpu_package_id) {
              _context.next = 33;
              break;
            }

            _context.next = 27;
            return regeneratorRuntime.awrap(_db["default"].query('UPDATE gpu_packages SET stock_available = stock_available + 1 WHERE id = ?', [order.gpu_package_id]));

          case 27:
            _ref3 = _context.sent;
            _ref4 = _slicedToArray(_ref3, 1);
            updateGpuResult = _ref4[0];

            if (updateGpuResult.affectedRows > 0) {
              console.log("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Stok GPU untuk Paket ID ").concat(order.gpu_package_id, " berhasil dikembalikan untuk Pesanan ID ").concat(order.id, "."));
            } else {
              console.warn("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Gagal mengembalikan stok untuk Paket ID ").concat(order.gpu_package_id, " (Pesanan ID ").concat(order.id, ")."));
            }

            _context.next = 34;
            break;

          case 33:
            console.warn("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: gpu_package_id tidak ditemukan untuk Pesanan ID ").concat(order.id, "."));

          case 34:
            _context.next = 36;
            return regeneratorRuntime.awrap((0, _notification.sendDeactivationEmailNotification)(order.user_email, order.user_name, order.id, order.token, order.domain, order.end_date // Menggunakan end_date dari hasil query
            ));

          case 36:
            console.log("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Email penonaktifan terkirim untuk Pesanan ID ").concat(order.id, "."));
            _context.next = 40;
            break;

          case 39:
            console.warn("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Gagal menonaktifkan pesanan ID ").concat(order.id, "."));

          case 40:
            _context.next = 42;
            return regeneratorRuntime.awrap(_db["default"].query('COMMIT'));

          case 42:
            _context.next = 49;
            break;

          case 44:
            _context.prev = 44;
            _context.t0 = _context["catch"](18);
            _context.next = 48;
            return regeneratorRuntime.awrap(_db["default"].query('ROLLBACK'));

          case 48:
            // Rollback jika ada kesalahan dalam transaksi
            console.error("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Kesalahan transaksi untuk Pesanan ID ").concat(order.id, ":"), _context.t0);

          case 49:
            _iteratorNormalCompletion = true;
            _context.next = 14;
            break;

          case 52:
            _context.next = 58;
            break;

          case 54:
            _context.prev = 54;
            _context.t1 = _context["catch"](12);
            _didIteratorError = true;
            _iteratorError = _context.t1;

          case 58:
            _context.prev = 58;
            _context.prev = 59;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 61:
            _context.prev = 61;

            if (!_didIteratorError) {
              _context.next = 64;
              break;
            }

            throw _iteratorError;

          case 64:
            return _context.finish(61);

          case 65:
            return _context.finish(58);

          case 66:
            _context.next = 69;
            break;

          case 68:
            console.log("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Tidak ada pesanan kedaluwarsa yang ditemukan."));

          case 69:
            console.log("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Selesai memeriksa pesanan kedaluwarsa."));
            _context.next = 75;
            break;

          case 72:
            _context.prev = 72;
            _context.t2 = _context["catch"](0);
            console.error("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job error (luar loop):"), _context.t2);

          case 75:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 72], [12, 54, 58, 66], [18, 44], [59,, 61, 65]]);
  });

  console.log("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job untuk penonaktifan pesanan dijadwalkan."));
};

var _default = runDeactivationCronJob;
exports["default"] = _default;