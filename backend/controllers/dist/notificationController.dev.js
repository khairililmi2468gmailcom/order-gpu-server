"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.markNotificationAsRead = exports.getNotifications = void 0;

var _db = _interopRequireDefault(require("../config/db.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// GET /notifications - Ambil notifikasi milik user
var getNotifications = function getNotifications(req, res) {
  var userId, _ref, _ref2, notifications;

  return regeneratorRuntime.async(function getNotifications$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          userId = req.user.id;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(_db["default"].query("SELECT id, message, status, created_at \n       FROM notifications \n       WHERE user_id = ? \n       ORDER BY created_at DESC", [userId]));

        case 4:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 1);
          notifications = _ref2[0];
          res.json(notifications);
          _context.next = 14;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](1);
          console.error(_context.t0);
          res.status(500).json({
            error: 'Gagal mengambil notifikasi'
          });

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 10]]);
}; // PUT /notifications/:id/read - Tandai notifikasi sebagai sudah dibaca


exports.getNotifications = getNotifications;

var markNotificationAsRead = function markNotificationAsRead(req, res) {
  var userId, notificationId, _ref3, _ref4, rows;

  return regeneratorRuntime.async(function markNotificationAsRead$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          userId = req.user.id;
          notificationId = req.params.id;
          _context2.prev = 2;
          _context2.next = 5;
          return regeneratorRuntime.awrap(_db["default"].query("SELECT * FROM notifications WHERE id = ? AND user_id = ?", [notificationId, userId]));

        case 5:
          _ref3 = _context2.sent;
          _ref4 = _slicedToArray(_ref3, 1);
          rows = _ref4[0];

          if (!(rows.length === 0)) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            error: 'Notifikasi tidak ditemukan'
          }));

        case 10:
          _context2.next = 12;
          return regeneratorRuntime.awrap(_db["default"].query("UPDATE notifications SET status = 'read' WHERE id = ?", [notificationId]));

        case 12:
          res.json({
            message: 'Notifikasi ditandai sebagai sudah dibaca'
          });
          _context2.next = 19;
          break;

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](2);
          console.error(_context2.t0);
          res.status(500).json({
            error: 'Gagal mengubah status notifikasi'
          });

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[2, 15]]);
};

exports.markNotificationAsRead = markNotificationAsRead;