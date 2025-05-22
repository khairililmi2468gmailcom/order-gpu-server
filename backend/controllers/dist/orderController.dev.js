"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createOrder = void 0;

var _db = _interopRequireDefault(require("../config/db.js"));

var _uuid = require("uuid");

var _calculateTotal = require("../utils/calculateTotal.js");

var _Order = _interopRequireDefault(require("../models/Order.js"));

var _User = _interopRequireDefault(require("../models/User.js"));

var _notification = require("../utils/notification.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// <-- Tambahkan import ini
var createOrder = function createOrder(req, res) {
  var _req$body, gpu_package_id, duration_hours, userId, _ref, _ref2, gpuPackage, packageData, _ref3, _ref4, userResult, userData, minPeriodHours, totalCost, result;

  return regeneratorRuntime.async(function createOrder$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, gpu_package_id = _req$body.gpu_package_id, duration_hours = _req$body.duration_hours;
          userId = req.user.id; // Asumsi req.user.id tersedia dari middleware autentikasi

          _context.prev = 2;

          if (!(!gpu_package_id || !duration_hours)) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: true,
            message: 'gpu_package_id dan duration_hours wajib diisi'
          }));

        case 5:
          if (!(typeof duration_hours !== 'number' || duration_hours <= 0)) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: true,
            message: 'Durasi harus berupa angka dan lebih dari 0'
          }));

        case 7:
          _context.next = 9;
          return regeneratorRuntime.awrap(_db["default"].query('SELECT * FROM gpu_packages WHERE id = ?', [gpu_package_id]));

        case 9:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 1);
          gpuPackage = _ref2[0];

          if (gpuPackage[0]) {
            _context.next = 14;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            error: true,
            message: 'Paket GPU tidak ditemukan.'
          }));

        case 14:
          packageData = gpuPackage[0]; // --- Ambil data user untuk notifikasi admin (nama, email, telepon) ---

          _context.next = 17;
          return regeneratorRuntime.awrap(_db["default"].query('SELECT name, email, phone FROM users WHERE id = ?', [userId]));

        case 17:
          _ref3 = _context.sent;
          _ref4 = _slicedToArray(_ref3, 1);
          userResult = _ref4[0];

          if (userResult[0]) {
            _context.next = 22;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            error: true,
            message: 'Pengguna tidak ditemukan.'
          }));

        case 22:
          userData = userResult[0]; // --- Akhir pengambilan data user ---

          minPeriodHours = packageData.min_period_hours || 1; // Default if null in DB
          // Validate duration based on package's minimum period

          if (!(duration_hours < minPeriodHours)) {
            _context.next = 26;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: true,
            message: "Durasi minimal untuk paket ini adalah ".concat(minPeriodHours, " Jam")
          }));

        case 26:
          if (!(packageData.stock_available <= 0)) {
            _context.next = 28;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: true,
            message: 'Maaf, stok GPU untuk paket ini sedang tidak tersedia.'
          }));

        case 28:
          // --- End of Stock Availability Check ---
          // Calculate total cost (Pastikan fungsi calculateTotalCost tersedia di scope ini)
          totalCost = (0, _calculateTotal.calculateTotalCost)(packageData.price_per_hour, duration_hours); // Start transaction to ensure data consistency for order creation

          _context.next = 31;
          return regeneratorRuntime.awrap(_db["default"].query('START TRANSACTION'));

        case 31:
          _context.prev = 31;
          _context.next = 34;
          return regeneratorRuntime.awrap(_Order["default"].create({
            user_id: userId,
            gpu_package_id: gpu_package_id,
            duration_hours: duration_hours,
            total_cost: totalCost,
            status: 'pending_payment' // Order status set to pending payment

          }));

        case 34:
          result = _context.sent;
          _context.next = 37;
          return regeneratorRuntime.awrap(_db["default"].query('COMMIT'));

        case 37:
          _context.next = 39;
          return regeneratorRuntime.awrap((0, _notification.notifyAdminOfNewOrder)(result.insertId, packageData, userData, totalCost, duration_hours));

        case 39:
          // --- Akhir notifikasi admin ---
          // Success response
          res.status(201).json({
            error: false,
            orderId: result.insertId,
            totalCost: totalCost,
            message: 'Pesanan berhasil dibuat dan menunggu pembayaran.' // Updated message

          });
          _context.next = 48;
          break;

        case 42:
          _context.prev = 42;
          _context.t0 = _context["catch"](31);
          _context.next = 46;
          return regeneratorRuntime.awrap(_db["default"].query('ROLLBACK'));

        case 46:
          console.error('Transaction Error during order creation:', _context.t0); // Log transaction error

          res.status(500).json({
            error: true,
            message: 'Gagal membuat pesanan akibat kesalahan transaksi.'
          });

        case 48:
          _context.next = 54;
          break;

        case 50:
          _context.prev = 50;
          _context.t1 = _context["catch"](2);
          console.error('Error creating order:', _context.t1); // Log general error

          res.status(500).json({
            error: true,
            message: 'Gagal membuat pesanan.'
          });

        case 54:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 50], [31, 42]]);
};

exports.createOrder = createOrder;