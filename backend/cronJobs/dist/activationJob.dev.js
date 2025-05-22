"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _nodeCron = _interopRequireDefault(require("node-cron"));

var _db = _interopRequireDefault(require("../config/db.js"));

var _Order = _interopRequireDefault(require("../models/Order.js"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Pastikan moment sudah terinstal (npm install moment)
var runActivationCronJob = function runActivationCronJob() {
  // Jadwalkan untuk berjalan setiap menit
  _nodeCron["default"].schedule('* * * * *', function _callee() {
    var _ref, _ref2, ordersToActivate, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, order, startDate, endDate, updateResult;

    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            console.log("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Memeriksa dan mengaktifkan pesanan yang tertunda...")); // Mengambil order yang berstatus 'approved', belum aktif (is_active = 0),
            // dan updated_at-nya sudah lebih dari 1 menit yang lalu.

            _context.next = 4;
            return regeneratorRuntime.awrap(_db["default"].query("SELECT id, duration_hours FROM orders \n                 WHERE status = 'approved' \n                   AND is_active = 0 \n                   AND token IS NOT NULL\n                   AND updated_at <= NOW() - INTERVAL 1 MINUTE" // Mengambil pesanan yang approved 1 menit yang lalu atau lebih
            ));

          case 4:
            _ref = _context.sent;
            _ref2 = _slicedToArray(_ref, 1);
            ordersToActivate = _ref2[0];

            if (!(ordersToActivate.length > 0)) {
              _context.next = 53;
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
              _context.next = 37;
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

            if (updateResult.affectedRows > 0) {
              console.log("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Pesanan ID ").concat(order.id, " berhasil diaktifkan secara otomatis."));
            } else {
              console.warn("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Gagal mengaktifkan pesanan ID ").concat(order.id, " (tidak ada baris yang terpengaruh)."));
            }

            _context.next = 27;
            return regeneratorRuntime.awrap(_db["default"].query('COMMIT'));

          case 27:
            _context.next = 34;
            break;

          case 29:
            _context.prev = 29;
            _context.t0 = _context["catch"](18);
            _context.next = 33;
            return regeneratorRuntime.awrap(_db["default"].query('ROLLBACK'));

          case 33:
            // Rollback jika ada kesalahan dalam transaksi
            console.error("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Kesalahan transaksi saat mengaktifkan Pesanan ID ").concat(order.id, ":"), _context.t0);

          case 34:
            _iteratorNormalCompletion = true;
            _context.next = 14;
            break;

          case 37:
            _context.next = 43;
            break;

          case 39:
            _context.prev = 39;
            _context.t1 = _context["catch"](12);
            _didIteratorError = true;
            _iteratorError = _context.t1;

          case 43:
            _context.prev = 43;
            _context.prev = 44;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 46:
            _context.prev = 46;

            if (!_didIteratorError) {
              _context.next = 49;
              break;
            }

            throw _iteratorError;

          case 49:
            return _context.finish(46);

          case 50:
            return _context.finish(43);

          case 51:
            _context.next = 54;
            break;

          case 53:
            console.log("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Tidak ada pesanan tertunda yang perlu diaktifkan."));

          case 54:
            console.log("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Selesai memeriksa pesanan tertunda."));
            _context.next = 60;
            break;

          case 57:
            _context.prev = 57;
            _context.t2 = _context["catch"](0);
            console.error("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job error (luar loop aktivasi):"), _context.t2);

          case 60:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 57], [12, 39, 43, 51], [18, 29], [44,, 46, 50]]);
  });

  console.log("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job untuk aktivasi pesanan dijadwalkan."));
};

var _default = runActivationCronJob;
exports["default"] = _default;