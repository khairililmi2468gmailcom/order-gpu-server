"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTotalVisitors = exports.getTodayVisitors = exports.recordVisit = void 0;

var _db = _interopRequireDefault(require("../config/db.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var recordVisit = function recordVisit(req, res) {
  var today;
  return regeneratorRuntime.async(function recordVisit$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          today = new Date().toISOString().slice(0, 10); // Coba insert terlebih dahulu. Jika gagal karena duplikat key, lakukan update.

          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap(_db["default"].execute('INSERT INTO visitors (visit_date, visit_count) VALUES (?, 1)', [today]));

        case 5:
          res.status(200).json({
            message: 'Kunjungan pertama hari ini tercatat'
          });
          _context.next = 18;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](2);

          if (!(_context.t0.code === 'ER_DUP_ENTRY')) {
            _context.next = 16;
            break;
          }

          _context.next = 13;
          return regeneratorRuntime.awrap(_db["default"].execute('UPDATE visitors SET visit_count = visit_count + 1 WHERE visit_date = ?', [today]));

        case 13:
          res.status(200).json({
            message: 'Jumlah kunjungan hari ini diperbarui'
          });
          _context.next = 18;
          break;

        case 16:
          // Jika error bukan duplicate entry, lempar error
          console.error('Gagal mencatat kunjungan:', _context.t0);
          res.status(500).json({
            message: 'Gagal mencatat kunjungan'
          });

        case 18:
          _context.next = 24;
          break;

        case 20:
          _context.prev = 20;
          _context.t1 = _context["catch"](0);
          console.error('Gagal mencatat kunjungan (outer catch):', _context.t1);
          res.status(500).json({
            message: 'Gagal mencatat kunjungan'
          });

        case 24:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 20], [2, 8]]);
};

exports.recordVisit = recordVisit;

var getTodayVisitors = function getTodayVisitors(req, res) {
  var today, _ref, _ref2, visitors;

  return regeneratorRuntime.async(function getTodayVisitors$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          today = new Date().toISOString().slice(0, 10);
          _context2.next = 4;
          return regeneratorRuntime.awrap(_db["default"].execute('SELECT visit_count FROM visitors WHERE visit_date = ?', [today]));

        case 4:
          _ref = _context2.sent;
          _ref2 = _slicedToArray(_ref, 1);
          visitors = _ref2[0];

          if (visitors.length > 0) {
            res.status(200).json({
              visitors: visitors[0].visit_count
            });
          } else {
            res.status(200).json({
              visitors: 0
            });
          }

          _context2.next = 14;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          console.error('Gagal mendapatkan jumlah pengunjung hari ini:', _context2.t0);
          res.status(500).json({
            message: 'Gagal mendapatkan jumlah pengunjung hari ini'
          });

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.getTodayVisitors = getTodayVisitors;

var getTotalVisitors = function getTotalVisitors(req, res) {
  var _ref3, _ref4, totalVisitorsResult;

  return regeneratorRuntime.async(function getTotalVisitors$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(_db["default"].execute('SELECT SUM(visit_count) AS total_visitors FROM visitors'));

        case 3:
          _ref3 = _context3.sent;
          _ref4 = _slicedToArray(_ref3, 1);
          totalVisitorsResult = _ref4[0];

          if (totalVisitorsResult.length > 0 && totalVisitorsResult[0].total_visitors !== null) {
            res.status(200).json({
              totalVisitors: totalVisitorsResult[0].total_visitors
            });
          } else {
            res.status(200).json({
              totalVisitors: 0
            });
          }

          _context3.next = 13;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          console.error('Gagal mendapatkan total pengunjung:', _context3.t0);
          res.status(500).json({
            message: 'Gagal mendapatkan total pengunjung'
          });

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.getTotalVisitors = getTotalVisitors;