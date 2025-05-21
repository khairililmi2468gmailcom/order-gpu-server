"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createOrder = void 0;

var _db = _interopRequireDefault(require("../config/db.js"));

var _uuid = require("uuid");

var _calculateTotal = require("../utils/calculateTotal.js");

var _Order = _interopRequireDefault(require("../models/Order.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var createOrder = function createOrder(req, res) {
  var _req$body, gpu_package_id, duration_hours, userId, _ref, _ref2, gpuPackage, packageData, minPeriodHours, totalCost, result;

  return regeneratorRuntime.async(function createOrder$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, gpu_package_id = _req$body.gpu_package_id, duration_hours = _req$body.duration_hours;
          userId = req.user.id;
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
          packageData = gpuPackage[0];
          minPeriodHours = packageData.min_period_hours || 1; // Default kalau null di DB
          // Validasi durasi sesuai paket

          if (!(duration_hours < minPeriodHours)) {
            _context.next = 18;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: true,
            message: "Durasi minimal untuk paket ini adalah ".concat(minPeriodHours, " Jam")
          }));

        case 18:
          if (!(packageData.stock_available <= 0)) {
            _context.next = 20;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: true,
            message: 'Maaf, stok GPU untuk paket ini sedang tidak tersedia.'
          }));

        case 20:
          // --- Akhir Penambahan Logika Pemeriksaan Stok ---
          // Hitung total biaya
          // This is where totalCost is correctly calculated.
          totalCost = (0, _calculateTotal.calculateTotalCost)(packageData.price_per_hour, duration_hours); // Mulai transaksi untuk memastikan konsistensi data

          _context.next = 23;
          return regeneratorRuntime.awrap(_db["default"].query('START TRANSACTION'));

        case 23:
          _context.prev = 23;
          _context.next = 26;
          return regeneratorRuntime.awrap(_db["default"].query('UPDATE gpu_packages SET stock_available = stock_available - 1 WHERE id = ?', [gpu_package_id]));

        case 26:
          _context.next = 28;
          return regeneratorRuntime.awrap(_Order["default"].create({
            user_id: userId,
            gpu_package_id: gpu_package_id,
            duration_hours: duration_hours,
            // FIX: Change 'total_cost' to 'totalCost' to match the variable declaration above
            total_cost: totalCost,
            // <-- This line was changed
            status: 'pending_payment'
          }));

        case 28:
          result = _context.sent;
          _context.next = 31;
          return regeneratorRuntime.awrap(_db["default"].query('COMMIT'));

        case 31:
          // Respon sukses
          res.status(201).json({
            error: false,
            orderId: result.insertId,
            totalCost: totalCost,
            message: 'Pesanan berhasil dibuat.'
          });
          _context.next = 40;
          break;

        case 34:
          _context.prev = 34;
          _context.t0 = _context["catch"](23);
          _context.next = 38;
          return regeneratorRuntime.awrap(_db["default"].query('ROLLBACK'));

        case 38:
          console.error('Transaction Error during order creation:', _context.t0); // Log error transaksi

          res.status(500).json({
            error: true,
            message: 'Gagal membuat pesanan akibat kesalahan transaksi.'
          });

        case 40:
          _context.next = 46;
          break;

        case 42:
          _context.prev = 42;
          _context.t1 = _context["catch"](2);
          console.error('Error creating order:', _context.t1); // Log error umum

          res.status(500).json({
            error: true,
            message: 'Gagal membuat pesanan.'
          });

        case 46:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 42], [23, 34]]);
};

exports.createOrder = createOrder;