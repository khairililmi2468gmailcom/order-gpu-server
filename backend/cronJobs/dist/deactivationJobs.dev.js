"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _nodeCron = _interopRequireDefault(require("node-cron"));

var _Order = _interopRequireDefault(require("../models/Order.js"));

var _db = _interopRequireDefault(require("../config/db.js"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Pastikan moment sudah terinstal (npm install moment)
var runDeactivationCronJob = function runDeactivationCronJob() {
  // Jadwalkan untuk berjalan setiap menit
  _nodeCron["default"].schedule('* * * * *', function _callee() {
    var expiredOrders, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, order, orderDetail, updateOrderResult, _ref, _ref2, updateGpuResult;

    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            console.log("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Memeriksa dan menonaktifkan pesanan kedaluwarsa...")); // Mengambil order yang aktif dan end_date-nya sudah lewat

            _context.next = 4;
            return regeneratorRuntime.awrap(_Order["default"].findExpiredActiveOrders());

          case 4:
            expiredOrders = _context.sent;

            if (!(expiredOrders.length > 0)) {
              _context.next = 71;
              break;
            }

            console.log("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Menemukan ").concat(expiredOrders.length, " pesanan kedaluwarsa."));
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 10;
            _iterator = expiredOrders[Symbol.iterator]();

          case 12:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 55;
              break;
            }

            order = _step.value;
            _context.next = 16;
            return regeneratorRuntime.awrap(_db["default"].query('START TRANSACTION'));

          case 16:
            _context.prev = 16;
            _context.next = 19;
            return regeneratorRuntime.awrap(_Order["default"].findById(order.id));

          case 19:
            orderDetail = _context.sent;

            if (orderDetail) {
              _context.next = 25;
              break;
            }

            console.warn("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Pesanan ID ").concat(order.id, " tidak ditemukan, kemungkinan sudah dihapus."));
            _context.next = 24;
            return regeneratorRuntime.awrap(_db["default"].query('ROLLBACK'));

          case 24:
            return _context.abrupt("continue", 52);

          case 25:
            _context.next = 27;
            return regeneratorRuntime.awrap(_Order["default"].findByIdAndUpdate(order.id, {
              is_active: 0,
              status: 'expired' // Menambahkan status 'expired'

            }));

          case 27:
            updateOrderResult = _context.sent;

            if (!(updateOrderResult.affectedRows > 0)) {
              _context.next = 42;
              break;
            }

            console.log("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Pesanan ID ").concat(order.id, " dinonaktifkan.")); // 3. Kembalikan stok GPU ke gpu_packages

            if (!orderDetail.gpu_package_id) {
              _context.next = 39;
              break;
            }

            _context.next = 33;
            return regeneratorRuntime.awrap(_db["default"].query('UPDATE gpu_packages SET stock_available = stock_available + 1 WHERE id = ?', [orderDetail.gpu_package_id]));

          case 33:
            _ref = _context.sent;
            _ref2 = _slicedToArray(_ref, 1);
            updateGpuResult = _ref2[0];

            if (updateGpuResult.affectedRows > 0) {
              console.log("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Stok GPU untuk Paket ID ").concat(orderDetail.gpu_package_id, " berhasil dikembalikan untuk Pesanan ID ").concat(order.id, "."));
            } else {
              console.warn("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Gagal mengembalikan stok untuk Paket ID ").concat(orderDetail.gpu_package_id, " (Pesanan ID ").concat(order.id, ")."));
            }

            _context.next = 40;
            break;

          case 39:
            console.warn("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: gpu_package_id tidak ditemukan untuk Pesanan ID ").concat(order.id, "."));

          case 40:
            _context.next = 43;
            break;

          case 42:
            console.warn("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Gagal menonaktifkan pesanan ID ").concat(order.id, "."));

          case 43:
            _context.next = 45;
            return regeneratorRuntime.awrap(_db["default"].query('COMMIT'));

          case 45:
            _context.next = 52;
            break;

          case 47:
            _context.prev = 47;
            _context.t0 = _context["catch"](16);
            _context.next = 51;
            return regeneratorRuntime.awrap(_db["default"].query('ROLLBACK'));

          case 51:
            // Rollback jika ada kesalahan dalam transaksi
            console.error("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Kesalahan transaksi untuk Pesanan ID ").concat(order.id, ":"), _context.t0);

          case 52:
            _iteratorNormalCompletion = true;
            _context.next = 12;
            break;

          case 55:
            _context.next = 61;
            break;

          case 57:
            _context.prev = 57;
            _context.t1 = _context["catch"](10);
            _didIteratorError = true;
            _iteratorError = _context.t1;

          case 61:
            _context.prev = 61;
            _context.prev = 62;

            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }

          case 64:
            _context.prev = 64;

            if (!_didIteratorError) {
              _context.next = 67;
              break;
            }

            throw _iteratorError;

          case 67:
            return _context.finish(64);

          case 68:
            return _context.finish(61);

          case 69:
            _context.next = 72;
            break;

          case 71:
            console.log("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Tidak ada pesanan kedaluwarsa yang ditemukan."));

          case 72:
            console.log("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job: Selesai memeriksa pesanan kedaluwarsa."));
            _context.next = 78;
            break;

          case 75:
            _context.prev = 75;
            _context.t2 = _context["catch"](0);
            console.error("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job error (luar loop):"), _context.t2);

          case 78:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 75], [10, 57, 61, 69], [16, 47], [62,, 64, 68]]);
  });

  console.log("[".concat((0, _moment["default"])().format('YYYY-MM-DD HH:mm:ss'), "] Cron job untuk penonaktifan pesanan dijadwalkan."));
};

var _default = runDeactivationCronJob;
exports["default"] = _default;