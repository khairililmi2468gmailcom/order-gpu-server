"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteGpuPackage = exports.updateGpuPackage = exports.getGpuPackages = exports.createGpuPackage = void 0;

var _db = _interopRequireDefault(require("../config/db.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var createGpuPackage = function createGpuPackage(req, res) {
  var _req$body, name, price_per_hour, vcpu, ram, ssd, memory_gpu, description, min_period_hours;

  return regeneratorRuntime.async(function createGpuPackage$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, name = _req$body.name, price_per_hour = _req$body.price_per_hour, vcpu = _req$body.vcpu, ram = _req$body.ram, ssd = _req$body.ssd, memory_gpu = _req$body.memory_gpu, description = _req$body.description, min_period_hours = _req$body.min_period_hours;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(_db["default"].query("INSERT INTO gpu_packages \n        (name, price_per_hour, vcpu, ram, ssd, memory_gpu, description, min_period_hours) \n        VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [name, price_per_hour, vcpu, ram, ssd, memory_gpu, description, min_period_hours]));

        case 4:
          res.status(201).json({
            message: 'GPU package berhasil dibuat'
          });
          _context.next = 11;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](1);
          console.error('Create GPU Package Error:', _context.t0);
          res.status(500).json({
            error: 'Gagal membuat GPU package'
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 7]]);
};

exports.createGpuPackage = createGpuPackage;

var getGpuPackages = function getGpuPackages(req, res) {
  var _ref, _ref2, gpuPackages;

  return regeneratorRuntime.async(function getGpuPackages$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(_db["default"].query('SELECT * FROM gpu_packages'));

        case 3:
          _ref = _context2.sent;
          _ref2 = _slicedToArray(_ref, 1);
          gpuPackages = _ref2[0];
          res.json(gpuPackages);
          _context2.next = 13;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          console.error('Get GPU Packages Error:', _context2.t0);
          res.status(500).json({
            error: 'Gagal mengambil GPU packages'
          });

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.getGpuPackages = getGpuPackages;

var updateGpuPackage = function updateGpuPackage(req, res) {
  var id, _req$body2, name, price_per_hour, vcpu, ram, ssd, memory_gpu, description, min_period_hours, _ref3, _ref4, gpuPackage;

  return regeneratorRuntime.async(function updateGpuPackage$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          id = req.params.id;
          _req$body2 = req.body, name = _req$body2.name, price_per_hour = _req$body2.price_per_hour, vcpu = _req$body2.vcpu, ram = _req$body2.ram, ssd = _req$body2.ssd, memory_gpu = _req$body2.memory_gpu, description = _req$body2.description, min_period_hours = _req$body2.min_period_hours;
          _context3.prev = 2;
          _context3.next = 5;
          return regeneratorRuntime.awrap(_db["default"].query('SELECT * FROM gpu_packages WHERE id = ?', [id]));

        case 5:
          _ref3 = _context3.sent;
          _ref4 = _slicedToArray(_ref3, 1);
          gpuPackage = _ref4[0];

          if (!(gpuPackage.length === 0)) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: 'GPU package tidak ditemukan'
          }));

        case 10:
          _context3.next = 12;
          return regeneratorRuntime.awrap(_db["default"].query("UPDATE gpu_packages \n        SET name = ?, price_per_hour = ?, vcpu = ?, ram = ?, ssd = ?, memory_gpu = ?, description = ?, min_period_hours = ? \n        WHERE id = ?", [name, price_per_hour, vcpu, ram, ssd, memory_gpu, description, min_period_hours, id]));

        case 12:
          res.json({
            message: 'GPU package berhasil diupdate'
          });
          _context3.next = 19;
          break;

        case 15:
          _context3.prev = 15;
          _context3.t0 = _context3["catch"](2);
          console.error('Update GPU Package Error:', _context3.t0);
          res.status(500).json({
            error: 'Gagal mengupdate GPU package'
          });

        case 19:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[2, 15]]);
};

exports.updateGpuPackage = updateGpuPackage;

var deleteGpuPackage = function deleteGpuPackage(req, res) {
  var id, _ref5, _ref6, gpuPackage, _ref7, _ref8, orders, orderIds;

  return regeneratorRuntime.async(function deleteGpuPackage$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          id = req.params.id;
          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(_db["default"].query('SELECT * FROM gpu_packages WHERE id = ?', [id]));

        case 4:
          _ref5 = _context4.sent;
          _ref6 = _slicedToArray(_ref5, 1);
          gpuPackage = _ref6[0];

          if (!(gpuPackage.length === 0)) {
            _context4.next = 9;
            break;
          }

          return _context4.abrupt("return", res.status(404).json({
            error: 'GPU package tidak ditemukan'
          }));

        case 9:
          _context4.next = 11;
          return regeneratorRuntime.awrap(_db["default"].query('SELECT id FROM orders WHERE gpu_package_id = ?', [id]));

        case 11:
          _ref7 = _context4.sent;
          _ref8 = _slicedToArray(_ref7, 1);
          orders = _ref8[0];
          orderIds = orders.map(function (order) {
            return order.id;
          });

          if (!(orderIds.length > 0)) {
            _context4.next = 20;
            break;
          }

          _context4.next = 18;
          return regeneratorRuntime.awrap(_db["default"].query('DELETE FROM payments WHERE order_id IN (?)', [orderIds]));

        case 18:
          _context4.next = 20;
          return regeneratorRuntime.awrap(_db["default"].query('DELETE FROM orders WHERE id IN (?)', [orderIds]));

        case 20:
          _context4.next = 22;
          return regeneratorRuntime.awrap(_db["default"].query('DELETE FROM gpu_packages WHERE id = ?', [id]));

        case 22:
          res.json({
            message: 'GPU package dan semua order serta payment terkait berhasil dihapus'
          });
          _context4.next = 29;
          break;

        case 25:
          _context4.prev = 25;
          _context4.t0 = _context4["catch"](1);
          console.error('Delete GPU Package Error:', _context4.t0);
          res.status(500).json({
            error: 'Gagal menghapus GPU package'
          });

        case 29:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 25]]);
};

exports.deleteGpuPackage = deleteGpuPackage;