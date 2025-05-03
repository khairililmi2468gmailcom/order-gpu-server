"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _nodeCron = _interopRequireDefault(require("node-cron"));

var _Order = _interopRequireDefault(require("../models/Order.js"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// src/cronJobs/deactivationJob.js
var runDeactivationCronJob = function runDeactivationCronJob() {
  // Jadwalkan untuk berjalan setiap menit
  _nodeCron["default"].schedule('* * * * *', function _callee() {
    var now, expiredOrders, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, order, updateResult;

    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            console.log('Cron job: Memeriksa dan menonaktifkan pesanan kedaluwarsa...');
            now = (0, _moment["default"])();
            _context.next = 5;
            return regeneratorRuntime.awrap(_Order["default"].findExpiredActiveOrders());

          case 5:
            expiredOrders = _context.sent;

            if (!(expiredOrders.length > 0)) {
              _context.next = 38;
              break;
            }

            console.log("Cron job: Menemukan ".concat(expiredOrders.length, " pesanan kedaluwarsa."));
            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context.prev = 11;
            _iterator = expiredOrders[Symbol.iterator]();

          case 13:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context.next = 22;
              break;
            }

            order = _step.value;
            _context.next = 17;
            return regeneratorRuntime.awrap(_Order["default"].findByIdAndUpdate(order.id, {
              is_active: 0
            }));

          case 17:
            updateResult = _context.sent;

            if (updateResult.affectedRows > 0) {
              console.log("Cron job: Pesanan ID ".concat(order.id, " dinonaktifkan."));
            } else {
              console.warn("Cron job: Gagal menonaktifkan pesanan ID ".concat(order.id, "."));
            }

          case 19:
            _iteratorNormalCompletion = true;
            _context.next = 13;
            break;

          case 22:
            _context.next = 28;
            break;

          case 24:
            _context.prev = 24;
            _context.t0 = _context["catch"](11);
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
            _context.next = 39;
            break;

          case 38:
            console.log('Cron job: Tidak ada pesanan kedaluwarsa yang ditemukan.');

          case 39:
            console.log('Cron job: Selesai memeriksa pesanan kedaluwarsa.');
            _context.next = 45;
            break;

          case 42:
            _context.prev = 42;
            _context.t1 = _context["catch"](0);
            console.error('Cron job error:', _context.t1);

          case 45:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 42], [11, 24, 28, 36], [29,, 31, 35]]);
  });

  console.log('Cron job untuk penonaktifan pesanan dijadwalkan.');
};

var _default = runDeactivationCronJob;
exports["default"] = _default;