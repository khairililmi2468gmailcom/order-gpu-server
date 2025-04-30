"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendTokenToUser = exports.updatePassword = exports.updateUser = exports.getAllPayments = exports.getWebsiteStats = exports.updateOrderToken = exports.updateTokenStatus = exports.getTokens = exports.approveOrder = exports.verifyPayment = exports.getAllOrders = void 0;

var _db = _interopRequireDefault(require("../config/db.js"));

var _uuid = require("uuid");

var _User = _interopRequireDefault(require("../models/User.js"));

var _Notification = _interopRequireDefault(require("../models/Notification.js"));

var _Order = _interopRequireDefault(require("../models/Order.js"));

var _Password = _interopRequireDefault(require("../models/Password.js"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _notification = require("../utils/notification.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var getAllOrders = function getAllOrders(req, res) {
  var _ref, _ref2, orders, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, order, _ref3, _ref4, payment;

  return regeneratorRuntime.async(function getAllOrders$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(_db["default"].query("SELECT o.*, u.name AS user_name, g.name AS package_name FROM orders o \n       JOIN users u ON o.user_id = u.id \n       JOIN gpu_packages g ON o.gpu_package_id = g.id"));

        case 3:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 1);
          orders = _ref2[0];
          // Loop through orders and check if there's a matching entry in the payments table
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 9;
          _iterator = orders[Symbol.iterator]();

        case 11:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 22;
            break;
          }

          order = _step.value;
          _context.next = 15;
          return regeneratorRuntime.awrap(_db["default"].query("SELECT p.proof_url FROM payments p WHERE p.order_id = ?", [order.id]));

        case 15:
          _ref3 = _context.sent;
          _ref4 = _slicedToArray(_ref3, 1);
          payment = _ref4[0];
          // Check if a payment entry exists and has a proof_url
          order.hasUpload = payment.length > 0 && payment[0].proof_url ? true : false;

        case 19:
          _iteratorNormalCompletion = true;
          _context.next = 11;
          break;

        case 22:
          _context.next = 28;
          break;

        case 24:
          _context.prev = 24;
          _context.t0 = _context["catch"](9);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 28:
          _context.prev = 28;
          _context.prev = 29;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 31:
          _context.prev = 31;

          if (!_didIteratorError) {
            _context.next = 34;
            break;
          }

          throw _iteratorError;

        case 34:
          return _context.finish(31);

        case 35:
          return _context.finish(28);

        case 36:
          res.json(orders);
          _context.next = 42;
          break;

        case 39:
          _context.prev = 39;
          _context.t1 = _context["catch"](0);
          res.status(500).json({
            error: 'Gagal mengambil semua pesanan'
          });

        case 42:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 39], [9, 24, 28, 36], [29,, 31, 35]]);
};

exports.getAllOrders = getAllOrders;

var verifyPayment = function verifyPayment(req, res) {
  var _req$body, payment_id, status, _ref5, _ref6, paymentResult, payment, verifiedAt, gpuToken;

  return regeneratorRuntime.async(function verifyPayment$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, payment_id = _req$body.payment_id, status = _req$body.status;
          _context2.prev = 1;

          if (['verified', 'rejected'].includes(status)) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: 'Status tidak valid'
          }));

        case 4:
          _context2.next = 6;
          return regeneratorRuntime.awrap(_db["default"].query('SELECT * FROM payments WHERE id = ?', [payment_id]));

        case 6:
          _ref5 = _context2.sent;
          _ref6 = _slicedToArray(_ref5, 1);
          paymentResult = _ref6[0];

          if (!(paymentResult.length === 0)) {
            _context2.next = 11;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            error: 'Payment ID tidak ditemukan'
          }));

        case 11:
          payment = paymentResult[0];
          verifiedAt = new Date(); // Update tabel payments

          _context2.next = 15;
          return regeneratorRuntime.awrap(_db["default"].query('UPDATE payments SET status = ?, verified_by = ?, verified_at = ? WHERE id = ?', [status, req.user.id, verifiedAt, payment_id]));

        case 15:
          if (!(status === 'verified')) {
            _context2.next = 21;
            break;
          }

          gpuToken = (0, _uuid.v4)(); // Token unik

          _context2.next = 19;
          return regeneratorRuntime.awrap(_db["default"].query('UPDATE orders SET status = ?, gpu_token = ? WHERE id = ?', ['approved', gpuToken, payment.order_id] // Update order status ke 'approved'
          ));

        case 19:
          _context2.next = 23;
          break;

        case 21:
          _context2.next = 23;
          return regeneratorRuntime.awrap(_db["default"].query('UPDATE orders SET status = ? WHERE id = ?', ['rejected', payment.order_id]));

        case 23:
          res.json({
            message: "Pembayaran berhasil diverifikasi dengan status ".concat(status)
          });
          _context2.next = 30;
          break;

        case 26:
          _context2.prev = 26;
          _context2.t0 = _context2["catch"](1);
          console.error('Verify Payment Error:', _context2.t0);
          res.status(500).json({
            error: 'Gagal verifikasi pembayaran'
          });

        case 30:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 26]]);
};

exports.verifyPayment = verifyPayment;

var approveOrder = function approveOrder(req, res) {
  var _req$body2, order_id, action, _ref7, _ref8, orders, gpuToken;

  return regeneratorRuntime.async(function approveOrder$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body2 = req.body, order_id = _req$body2.order_id, action = _req$body2.action;
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(_db["default"].query('SELECT * FROM orders WHERE id = ?', [order_id]));

        case 4:
          _ref7 = _context3.sent;
          _ref8 = _slicedToArray(_ref7, 1);
          orders = _ref8[0];

          if (orders[0]) {
            _context3.next = 9;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: 'Pesanan tidak ditemukan'
          }));

        case 9:
          if (!(action === 'approve')) {
            _context3.next = 16;
            break;
          }

          gpuToken = (0, _uuid.v4)();
          _context3.next = 13;
          return regeneratorRuntime.awrap(_db["default"].query('UPDATE orders SET status = ?, gpu_token = ?, is_active = ? WHERE id = ?', ['approved', gpuToken, true, order_id]));

        case 13:
          res.json({
            message: 'Pesanan disetujui',
            token: gpuToken
          });
          _context3.next = 23;
          break;

        case 16:
          if (!(action === 'reject')) {
            _context3.next = 22;
            break;
          }

          _context3.next = 19;
          return regeneratorRuntime.awrap(_db["default"].query('UPDATE orders SET status = ? WHERE id = ?', ['rejected', order_id]));

        case 19:
          res.json({
            message: 'Pesanan ditolak'
          });
          _context3.next = 23;
          break;

        case 22:
          res.status(400).json({
            error: 'Aksi tidak valid'
          });

        case 23:
          _context3.next = 28;
          break;

        case 25:
          _context3.prev = 25;
          _context3.t0 = _context3["catch"](1);
          res.status(500).json({
            error: 'Gagal memproses pesanan'
          });

        case 28:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 25]]);
};

exports.approveOrder = approveOrder;

var getTokens = function getTokens(req, res) {
  var _ref9, _ref10, tokens;

  return regeneratorRuntime.async(function getTokens$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(_db["default"].query('SELECT * FROM orders WHERE is_active = ?', [true]));

        case 3:
          _ref9 = _context4.sent;
          _ref10 = _slicedToArray(_ref9, 1);
          tokens = _ref10[0];
          res.json(tokens);
          _context4.next = 13;
          break;

        case 9:
          _context4.prev = 9;
          _context4.t0 = _context4["catch"](0);
          console.error('Get Tokens Error:', _context4.t0);
          res.status(500).json({
            error: 'Gagal mengambil aktivitas token'
          });

        case 13:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.getTokens = getTokens;

var updateTokenStatus = function updateTokenStatus(req, res) {
  var _req$body3, order_id, is_active, _ref11, _ref12, order, statusMessage;

  return regeneratorRuntime.async(function updateTokenStatus$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$body3 = req.body, order_id = _req$body3.order_id, is_active = _req$body3.is_active;

          if (!(typeof is_active !== 'boolean')) {
            _context5.next = 3;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            error: 'Field is_active harus berupa boolean'
          }));

        case 3:
          _context5.prev = 3;
          _context5.next = 6;
          return regeneratorRuntime.awrap(_db["default"].query('SELECT * FROM orders WHERE id = ?', [order_id]));

        case 6:
          _ref11 = _context5.sent;
          _ref12 = _slicedToArray(_ref11, 1);
          order = _ref12[0];

          if (order[0]) {
            _context5.next = 11;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            error: 'Pesanan tidak ditemukan'
          }));

        case 11:
          _context5.next = 13;
          return regeneratorRuntime.awrap(_db["default"].query('UPDATE orders SET is_active = ? WHERE id = ?', [is_active, order_id]));

        case 13:
          statusMessage = is_active ? 'diaktifkan' : 'dinonaktifkan';
          res.json({
            message: "Token berhasil ".concat(statusMessage)
          });
          _context5.next = 21;
          break;

        case 17:
          _context5.prev = 17;
          _context5.t0 = _context5["catch"](3);
          console.error('Update Token Status Error:', _context5.t0);
          res.status(500).json({
            error: 'Gagal mengubah status token'
          });

        case 21:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[3, 17]]);
}; // export const updateOrderToken = async (req, res) => {
//   try {
//     const { orderId, token, is_active } = req.body;
//     const order = await Order.findByPk(orderId); // atau .findById jika pakai mongoose
//     if (!order) return res.status(404).json({ message: 'Order tidak ditemukan' });
//     // Update order
//     order.token = token;
//     order.is_active = is_active;
//     await order.save();
//     // Jika token aktif dan tidak null, kirim notifikasi ke user
//     if (is_active === 1 && token) {
//       const user = await User.findByPk(order.user_id); // atau .findById
//       if (user) {
//         await notifyUserWithToken(user.email, user.name, token);
//       }
//     }
//     res.json({ message: 'Token order diperbarui dan notifikasi dikirim jika valid' });
//   } catch (err) {
//     console.error('Gagal update order token:', err);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };


exports.updateTokenStatus = updateTokenStatus;

var updateOrderToken = function updateOrderToken(req, res) {
  var _req$body4, order_id, token, _ref13, _ref14, order;

  return regeneratorRuntime.async(function updateOrderToken$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _req$body4 = req.body, order_id = _req$body4.order_id, token = _req$body4.token;

          if (!(!token || typeof token !== 'string')) {
            _context6.next = 3;
            break;
          }

          return _context6.abrupt("return", res.status(400).json({
            error: 'Token harus berupa string dan tidak boleh kosong'
          }));

        case 3:
          _context6.prev = 3;
          _context6.next = 6;
          return regeneratorRuntime.awrap(_db["default"].query('SELECT * FROM orders WHERE id = ?', [order_id]));

        case 6:
          _ref13 = _context6.sent;
          _ref14 = _slicedToArray(_ref13, 1);
          order = _ref14[0];

          if (order[0]) {
            _context6.next = 11;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            error: 'Pesanan tidak ditemukan'
          }));

        case 11:
          _context6.next = 13;
          return regeneratorRuntime.awrap(_db["default"].query('UPDATE orders SET token = ?, updated_at = NOW() WHERE id = ?', [token, order_id]));

        case 13:
          res.json({
            message: 'Token berhasil diupdate'
          });
          _context6.next = 20;
          break;

        case 16:
          _context6.prev = 16;
          _context6.t0 = _context6["catch"](3);
          console.error('Update Token Error:', _context6.t0);
          res.status(500).json({
            error: 'Gagal mengupdate token'
          });

        case 20:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[3, 16]]);
};

exports.updateOrderToken = updateOrderToken;

var getWebsiteStats = function getWebsiteStats(req, res) {
  var _ref15, _ref16, visitorCount, _ref17, _ref18, userCount, _ref19, _ref20, orderCount, _ref21, _ref22, totalRevenue, _ref23, _ref24, pendingOrders, _ref25, _ref26, approvedOrders, _ref27, _ref28, monthlyNewUsersTotal, _ref29, _ref30, todayVisitors, _ref31, _ref32, monthlyRevenue, _ref33, _ref34, orderStatusCount, _ref35, _ref36, monthlyNewUsers, _ref37, _ref38, dailyVisitors;

  return regeneratorRuntime.async(function getWebsiteStats$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return regeneratorRuntime.awrap(_db["default"].query('SELECT COUNT(DISTINCT ip) AS visitor_count FROM access_log'));

        case 3:
          _ref15 = _context7.sent;
          _ref16 = _slicedToArray(_ref15, 1);
          visitorCount = _ref16[0];
          _context7.next = 8;
          return regeneratorRuntime.awrap(_db["default"].query('SELECT COUNT(id) AS user_count FROM users'));

        case 8:
          _ref17 = _context7.sent;
          _ref18 = _slicedToArray(_ref17, 1);
          userCount = _ref18[0];
          _context7.next = 13;
          return regeneratorRuntime.awrap(_db["default"].query('SELECT COUNT(id) AS order_count FROM orders'));

        case 13:
          _ref19 = _context7.sent;
          _ref20 = _slicedToArray(_ref19, 1);
          orderCount = _ref20[0];
          _context7.next = 18;
          return regeneratorRuntime.awrap(_db["default"].query('SELECT IFNULL(SUM(total_cost), 0) AS total_revenue FROM orders WHERE status = "approved"'));

        case 18:
          _ref21 = _context7.sent;
          _ref22 = _slicedToArray(_ref21, 1);
          totalRevenue = _ref22[0];
          _context7.next = 23;
          return regeneratorRuntime.awrap(_db["default"].query('SELECT COUNT(id) AS pending_order FROM orders WHERE status = "pending_payment"'));

        case 23:
          _ref23 = _context7.sent;
          _ref24 = _slicedToArray(_ref23, 1);
          pendingOrders = _ref24[0];
          _context7.next = 28;
          return regeneratorRuntime.awrap(_db["default"].query('SELECT COUNT(id) AS approved_order FROM orders WHERE status = "approved"'));

        case 28:
          _ref25 = _context7.sent;
          _ref26 = _slicedToArray(_ref25, 1);
          approvedOrders = _ref26[0];
          _context7.next = 33;
          return regeneratorRuntime.awrap(_db["default"].query("\n      SELECT COUNT(*) AS this_month_new_users\n      FROM users\n      WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())\n    "));

        case 33:
          _ref27 = _context7.sent;
          _ref28 = _slicedToArray(_ref27, 1);
          monthlyNewUsersTotal = _ref28[0];
          _context7.next = 38;
          return regeneratorRuntime.awrap(_db["default"].query("\n      SELECT COUNT(DISTINCT ip) AS today_visitors\n      FROM access_log\n      WHERE DATE(accessed_at) = CURDATE()\n    "));

        case 38:
          _ref29 = _context7.sent;
          _ref30 = _slicedToArray(_ref29, 1);
          todayVisitors = _ref30[0];
          _context7.next = 43;
          return regeneratorRuntime.awrap(_db["default"].query("\n      SELECT \n        DATE_FORMAT(created_at, '%Y-%m') AS month,\n        SUM(total_cost) AS total\n      FROM orders\n      WHERE status = \"approved\"\n      GROUP BY month\n      ORDER BY month ASC\n    "));

        case 43:
          _ref31 = _context7.sent;
          _ref32 = _slicedToArray(_ref31, 1);
          monthlyRevenue = _ref32[0];
          _context7.next = 48;
          return regeneratorRuntime.awrap(_db["default"].query("\n      SELECT \n        status,\n        COUNT(*) AS count\n      FROM orders\n      GROUP BY status\n    "));

        case 48:
          _ref33 = _context7.sent;
          _ref34 = _slicedToArray(_ref33, 1);
          orderStatusCount = _ref34[0];
          _context7.next = 53;
          return regeneratorRuntime.awrap(_db["default"].query("\n      SELECT \n        DATE_FORMAT(created_at, '%Y-%m') AS month,\n        COUNT(*) AS new_users\n      FROM users\n      GROUP BY month\n      ORDER BY month ASC\n    "));

        case 53:
          _ref35 = _context7.sent;
          _ref36 = _slicedToArray(_ref35, 1);
          monthlyNewUsers = _ref36[0];
          _context7.next = 58;
          return regeneratorRuntime.awrap(_db["default"].query("\n      SELECT \n        DATE(accessed_at) AS date,\n        COUNT(DISTINCT ip) AS visitors\n      FROM access_log\n      WHERE accessed_at >= CURDATE() - INTERVAL 30 DAY\n      GROUP BY date\n      ORDER BY date ASC\n    "));

        case 58:
          _ref37 = _context7.sent;
          _ref38 = _slicedToArray(_ref37, 1);
          dailyVisitors = _ref38[0];
          res.json({
            cards: {
              visitorCount: visitorCount[0].visitor_count,
              todayVisitors: todayVisitors[0].today_visitors,
              userCount: userCount[0].user_count,
              monthlyNewUsers: monthlyNewUsersTotal[0].this_month_new_users,
              orderCount: orderCount[0].order_count,
              pendingOrders: pendingOrders[0].pending_order,
              approvedOrders: approvedOrders[0].approved_order,
              totalRevenue: totalRevenue[0].total_revenue
            },
            charts: {
              lineChart: {
                label: "Pendapatan Bulanan",
                data: monthlyRevenue
              },
              barChart: {
                label: "User Baru per Bulan",
                data: monthlyNewUsers
              },
              pieChart: {
                label: "Status Order",
                data: orderStatusCount
              },
              areaChart: {
                label: "Visitor Harian (30 hari)",
                data: dailyVisitors
              }
            }
          });
          _context7.next = 68;
          break;

        case 64:
          _context7.prev = 64;
          _context7.t0 = _context7["catch"](0);
          console.error('Get Website Stats Error:', _context7.t0);
          res.status(500).json({
            error: 'Gagal mengambil statistik website'
          });

        case 68:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 64]]);
};

exports.getWebsiteStats = getWebsiteStats;

var getAllPayments = function getAllPayments(req, res) {
  var _ref39, _ref40, payments;

  return regeneratorRuntime.async(function getAllPayments$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return regeneratorRuntime.awrap(_db["default"].query("SELECT \n          p.id AS payment_id,\n          p.order_id,\n          p.proof_url,\n          p.status AS payment_status,\n          p.verified_by,\n          p.verified_at,\n          \n          o.id AS order_id,\n          o.user_id,\n          o.gpu_package_id,\n          o.duration_days,\n          o.total_cost,\n          o.token,\n          o.is_active,\n          o.status AS order_status,\n          o.start_date,\n          o.end_date,\n          o.created_at AS order_created_at,\n          o.updated_at AS order_updated_at,\n          \n          u.name AS user_name,\n          u.email AS user_email,\n\n          g.name AS gpu_package_name,\n          g.price_per_hour,\n          g.vcpu,\n          g.ram,\n          g.min_period_days\n       FROM payments p \n       JOIN orders o ON p.order_id = o.id \n       JOIN users u ON o.user_id = u.id\n       JOIN gpu_packages g ON o.gpu_package_id = g.id"));

        case 3:
          _ref39 = _context8.sent;
          _ref40 = _slicedToArray(_ref39, 1);
          payments = _ref40[0];
          res.json(payments);
          _context8.next = 13;
          break;

        case 9:
          _context8.prev = 9;
          _context8.t0 = _context8["catch"](0);
          console.error('Get Payments Error:', _context8.t0);
          res.status(500).json({
            error: 'Gagal mengambil data pembayaran'
          });

        case 13:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.getAllPayments = getAllPayments;

var updateUser = function updateUser(req, res) {
  var id, _req$body5, name, email, phone, existingUser;

  return regeneratorRuntime.async(function updateUser$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          id = req.params.id;
          _req$body5 = req.body, name = _req$body5.name, email = _req$body5.email, phone = _req$body5.phone;

          if (!(!name || !email)) {
            _context9.next = 5;
            break;
          }

          return _context9.abrupt("return", res.status(400).json({
            message: 'Name, and email are required.'
          }));

        case 5:
          _context9.next = 7;
          return regeneratorRuntime.awrap(_User["default"].findById(id));

        case 7:
          existingUser = _context9.sent;

          if (existingUser) {
            _context9.next = 10;
            break;
          }

          return _context9.abrupt("return", res.status(404).json({
            message: 'User not found.'
          }));

        case 10:
          _context9.next = 12;
          return regeneratorRuntime.awrap(_User["default"].updateById(id, {
            name: name,
            email: email,
            phone: phone
          }));

        case 12:
          res.json({
            message: 'User updated successfully.'
          });
          _context9.next = 19;
          break;

        case 15:
          _context9.prev = 15;
          _context9.t0 = _context9["catch"](0);
          console.error(_context9.t0);
          res.status(500).json({
            message: 'Failed to update user.'
          });

        case 19:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

exports.updateUser = updateUser;

var updatePassword = function updatePassword(req, res) {
  var id, password, existingUser, hashedPassword;
  return regeneratorRuntime.async(function updatePassword$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          id = req.params.id;
          password = req.body.password;

          if (password) {
            _context10.next = 5;
            break;
          }

          return _context10.abrupt("return", res.status(400).json({
            message: 'Password is required.'
          }));

        case 5:
          _context10.next = 7;
          return regeneratorRuntime.awrap(_User["default"].findById(id));

        case 7:
          existingUser = _context10.sent;

          if (existingUser) {
            _context10.next = 10;
            break;
          }

          return _context10.abrupt("return", res.status(404).json({
            message: 'User not found.'
          }));

        case 10:
          _context10.next = 12;
          return regeneratorRuntime.awrap(_bcryptjs["default"].hash(password, 10));

        case 12:
          hashedPassword = _context10.sent;
          _context10.next = 15;
          return regeneratorRuntime.awrap(_Password["default"].updateById(id, {
            password: hashedPassword
          }));

        case 15:
          res.json({
            message: 'Password updated successfully.'
          });
          _context10.next = 22;
          break;

        case 18:
          _context10.prev = 18;
          _context10.t0 = _context10["catch"](0);
          console.error(_context10.t0);
          res.status(500).json({
            message: 'Failed to update password.'
          });

        case 22:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

exports.updatePassword = updatePassword;

var sendTokenToUser = function sendTokenToUser(req, res) {
  var _req$body6, orderId, token, order, user, message;

  return regeneratorRuntime.async(function sendTokenToUser$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          _req$body6 = req.body, orderId = _req$body6.orderId, token = _req$body6.token; // Ambil ID pesanan dan token yang akan dikirim

          _context11.next = 4;
          return regeneratorRuntime.awrap(_Order["default"].findById(orderId));

        case 4:
          order = _context11.sent;

          if (!(!order || order.is_active === 0)) {
            _context11.next = 7;
            break;
          }

          return _context11.abrupt("return", res.status(404).json({
            message: 'Pesanan tidak ditemukan atau belum aktif.'
          }));

        case 7:
          _context11.next = 9;
          return regeneratorRuntime.awrap(_Order["default"].updateOrderStatusAndToken(orderId, {
            status: 'approved',
            token: token
          }));

        case 9:
          _context11.next = 11;
          return regeneratorRuntime.awrap(_User["default"].findById(order.user_id));

        case 11:
          user = _context11.sent;

          if (user) {
            _context11.next = 14;
            break;
          }

          return _context11.abrupt("return", res.status(404).json({
            message: 'Pengguna tidak ditemukan.'
          }));

        case 14:
          // Kirimkan notifikasi ke pengguna dalam aplikasi
          message = "Token aktif Anda adalah: ".concat(token);
          _context11.next = 17;
          return regeneratorRuntime.awrap(_Notification["default"].create({
            user_id: user.id,
            message: message
          }));

        case 17:
          _context11.next = 19;
          return regeneratorRuntime.awrap((0, _notification.notifyUserWithToken)(user.email, user.name, token));

        case 19:
          return _context11.abrupt("return", res.status(200).json({
            message: 'Token telah dikirimkan kepada pengguna dan email telah dikirim.'
          }));

        case 22:
          _context11.prev = 22;
          _context11.t0 = _context11["catch"](0);
          console.error(_context11.t0);
          return _context11.abrupt("return", res.status(500).json({
            message: 'Terjadi kesalahan dalam mengirim token.'
          }));

        case 26:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 22]]);
};

exports.sendTokenToUser = sendTokenToUser;