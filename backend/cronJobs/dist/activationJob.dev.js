"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _nodeCron = _interopRequireDefault(require("node-cron"));

var _db = _interopRequireDefault(require("../config/db.js"));

var _Order = _interopRequireDefault(require("../models/Order.js"));

var _moment = _interopRequireDefault(require("moment"));

var _notification = require("../utils/notification.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Import fungsi notifikasi email yang baru
var runActivationCronJob = function runActivationCronJob() {
  // Jadwalkan untuk berjalan setiap menit
  // Ini berarti cron job akan mengecek setiap menit,
  // tetapi aktivasi akan terjadi hanya untuk order yang sudah lebih dari 30 menit
  _nodeCron["default"].schedule('* * * * *', function _callee() {
    var _ref, _ref2, ordersToActivate, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, order, startDate, endDate, updateResult;

    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            console.log("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Memeriksa dan mengaktifkan pesanan yang tertunda...")); // Mengambil order yang berstatus 'approved', belum aktif (is_active = 0),
            // dan updated_at-nya sudah lebih dari 30 menit yang lalu.
            // Melakukan JOIN dengan tabel users untuk mendapatkan email dan nama pengguna
            // serta domain dari tabel orders (jika ada) untuk notifikasi email.

            _context.next = 4;
            return regeneratorRuntime.awrap(_db["default"].query("SELECT o.id, o.duration_hours, o.token, o.domain, u.email AS user_email, u.name AS user_name\n                 FROM orders o\n                 JOIN users u ON o.user_id = u.id\n                 WHERE o.status = 'approved'\n                   AND o.is_active = 0\n                   AND o.token IS NOT NULL\n                   AND o.updated_at <= NOW() - INTERVAL 30 MINUTE" // Mengambil pesanan yang approved 30 menit yang lalu atau lebih
            ));

          case 4:
            _ref = _context.sent;
            _ref2 = _slicedToArray(_ref, 1);
            ordersToActivate = _ref2[0];

            if (!(ordersToActivate.length > 0)) {
              _context.next = 60;
              break;
            }

            console.log("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Menemukan ").concat(ordersToActivate.length, " pesanan untuk diaktifkan secara otomatis."));
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 12;
            _iterator = ordersToActivate[Symbol.iterator]();

          case 14:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 44;
              break;
            }

            order = _step.value;
            _context.next = 18;
            return regeneratorRuntime.awrap(_db["default"].query('START TRANSACTION'));

          case 18:
            _context.prev = 18;
            startDate = new Date(); // Tanggal mulai adalah waktu saat ini

            endDate = new Date(startDate.getTime() + order.duration_hours * 60 * 60 * 1000); // Menghitung end_date
            // Perbarui status pesanan menjadi 'active' dan set tanggal mulai/berakhir

            _context.next = 23;
            return regeneratorRuntime.awrap(_Order["default"].findByIdAndUpdate(order.id, {
              start_date: startDate,
              end_date: endDate,
              is_active: 1,
              // Set aktif
              status: 'active' // Ubah status menjadi 'active'

            }));

          case 23:
            updateResult = _context.sent;

            if (!(updateResult.affectedRows > 0)) {
              _context.next = 31;
              break;
            }

            console.log("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Pesanan ID ").concat(order.id, " berhasil diaktifkan secara otomatis.")); // Kirim notifikasi email ke pengguna setelah pesanan diaktifkan

            _context.next = 28;
            return regeneratorRuntime.awrap((0, _notification.sendActivationEmailNotification)(order.user_email, order.user_name, order.token, order.domain, startDate, // Teruskan startDate
            endDate // Teruskan endDate
            ));

          case 28:
            console.log("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Email aktivasi terkirim untuk Pesanan ID ").concat(order.id, "."));
            _context.next = 32;
            break;

          case 31:
            console.warn("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Gagal mengaktifkan pesanan ID ").concat(order.id, " (tidak ada baris yang terpengaruh)."));

          case 32:
            _context.next = 34;
            return regeneratorRuntime.awrap(_db["default"].query('COMMIT'));

          case 34:
            _context.next = 41;
            break;

          case 36:
            _context.prev = 36;
            _context.t0 = _context["catch"](18);
            _context.next = 40;
            return regeneratorRuntime.awrap(_db["default"].query('ROLLBACK'));

          case 40:
            // Rollback jika ada kesalahan dalam transaksi
            console.error("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Kesalahan transaksi saat mengaktifkan Pesanan ID ").concat(order.id, ":"), _context.t0);

          case 41:
            _iteratorNormalCompletion = true;
            _context.next = 14;
            break;

          case 44:
            _context.next = 50;
            break;

          case 46:
            _context.prev = 46;
            _context.t1 = _context["catch"](12);
            _didIteratorError = true;
            _iteratorError = _context.t1;

          case 50:
            _context.prev = 50;
            _context.prev = 51;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 53:
            _context.prev = 53;

            if (!_didIteratorError) {
              _context.next = 56;
              break;
            }

            throw _iteratorError;

          case 56:
            return _context.finish(53);

          case 57:
            return _context.finish(50);

          case 58:
            _context.next = 61;
            break;

          case 60:
            console.log("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Tidak ada pesanan tertunda yang perlu diaktifkan."));

          case 61:
            console.log("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Selesai memeriksa pesanan tertunda."));
            _context.next = 67;
            break;

          case 64:
            _context.prev = 64;
            _context.t2 = _context["catch"](0);
            console.error("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job error (luar loop aktivasi):"), _context.t2);

          case 67:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 64], [12, 46, 50, 58], [18, 36], [51,, 53, 57]]);
  });

  console.log("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job untuk aktivasi pesanan dijadwalkan."));
};

var _default = runActivationCronJob;
exports["default"] = _default;