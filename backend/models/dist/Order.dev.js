"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _db = _interopRequireDefault(require("../config/db.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var Order = {
  // Fungsi untuk mencari pesanan berdasarkan ID
  findById: function findById(id) {
    var _ref, _ref2, rows;

    return regeneratorRuntime.async(function findById$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(_db["default"].query('SELECT * FROM orders WHERE id = ?', [id]));

          case 2:
            _ref = _context.sent;
            _ref2 = _slicedToArray(_ref, 1);
            rows = _ref2[0];
            return _context.abrupt("return", rows[0]);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  // Fungsi untuk menemukan pesanan berdasarkan status
  findByStatus: function findByStatus(status) {
    var _ref3, _ref4, rows;

    return regeneratorRuntime.async(function findByStatus$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(_db["default"].query('SELECT * FROM orders WHERE status = ?', [status]));

          case 2:
            _ref3 = _context2.sent;
            _ref4 = _slicedToArray(_ref3, 1);
            rows = _ref4[0];
            return _context2.abrupt("return", rows);

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    });
  },
  // Fungsi untuk menemukan pesanan berdasarkan user_id
  findByUserId: function findByUserId(user_id) {
    var _ref5, _ref6, rows;

    return regeneratorRuntime.async(function findByUserId$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return regeneratorRuntime.awrap(_db["default"].query('SELECT * FROM orders WHERE user_id = ?', [user_id]));

          case 2:
            _ref5 = _context3.sent;
            _ref6 = _slicedToArray(_ref5, 1);
            rows = _ref6[0];
            return _context3.abrupt("return", rows);

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    });
  },
  // Fungsi untuk memperbarui status pesanan dan mengaktifkan token
  updateOrderStatusAndToken: function updateOrderStatusAndToken(orderId, _ref7) {
    var status, token, domain, _ref8, _ref9, result;

    return regeneratorRuntime.async(function updateOrderStatusAndToken$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            status = _ref7.status, token = _ref7.token, domain = _ref7.domain;
            _context4.next = 3;
            return regeneratorRuntime.awrap(_db["default"].query('UPDATE orders SET status = ?, token = ?, domain = ?, is_active = 1 WHERE id = ?', [status, token, domain, orderId]));

          case 3:
            _ref8 = _context4.sent;
            _ref9 = _slicedToArray(_ref8, 1);
            result = _ref9[0];
            return _context4.abrupt("return", result);

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    });
  },
  // Fungsi untuk mencari pesanan dengan kondisi khusus
  findActiveOrderWithToken: function findActiveOrderWithToken() {
    var _ref10, _ref11, rows;

    return regeneratorRuntime.async(function findActiveOrderWithToken$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return regeneratorRuntime.awrap(_db["default"].query('SELECT * FROM orders WHERE is_active = 1 AND token IS NOT NULL'));

          case 2:
            _ref10 = _context5.sent;
            _ref11 = _slicedToArray(_ref10, 1);
            rows = _ref11[0];
            return _context5.abrupt("return", rows);

          case 6:
          case "end":
            return _context5.stop();
        }
      }
    });
  },
  // Fungsi untuk mendapatkan semua pesanan
  getAllOrders: function getAllOrders() {
    var _ref12, _ref13, rows;

    return regeneratorRuntime.async(function getAllOrders$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return regeneratorRuntime.awrap(_db["default"].query('SELECT * FROM orders'));

          case 2:
            _ref12 = _context6.sent;
            _ref13 = _slicedToArray(_ref12, 1);
            rows = _ref13[0];
            return _context6.abrupt("return", rows);

          case 6:
          case "end":
            return _context6.stop();
        }
      }
    });
  },
  // Fungsi untuk membuat pesanan baru
  create: function create(_ref14) {
    var user_id, gpu_package_id, duration_days, total_cost, status, token, start_date, end_date, _ref15, _ref16, result;

    return regeneratorRuntime.async(function create$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            user_id = _ref14.user_id, gpu_package_id = _ref14.gpu_package_id, duration_days = _ref14.duration_days, total_cost = _ref14.total_cost, status = _ref14.status, token = _ref14.token, start_date = _ref14.start_date, end_date = _ref14.end_date;
            _context7.next = 3;
            return regeneratorRuntime.awrap(_db["default"].query('INSERT INTO orders (user_id, gpu_package_id, duration_days, total_cost, status, token, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [user_id, gpu_package_id, duration_days, total_cost, status, token, start_date, end_date]));

          case 3:
            _ref15 = _context7.sent;
            _ref16 = _slicedToArray(_ref15, 1);
            result = _ref16[0];
            return _context7.abrupt("return", result);

          case 7:
          case "end":
            return _context7.stop();
        }
      }
    });
  }
};
var _default = Order;
exports["default"] = _default;