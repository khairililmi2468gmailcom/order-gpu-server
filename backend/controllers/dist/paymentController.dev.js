"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadPaymentProofMiddleware = exports.uploadPaymentProof = void 0;

var _multer = _interopRequireDefault(require("multer"));

var _path = _interopRequireDefault(require("path"));

var _uuid = require("uuid");

var _fs = _interopRequireDefault(require("fs"));

var _db = _interopRequireDefault(require("../config/db.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Konfigurasi penyimpanan file dengan multer
var storage = _multer["default"].memoryStorage(); // Menyimpan file dalam memory sementara


var upload = (0, _multer["default"])({
  storage: storage
}); // Fungsi untuk menangani upload bukti pembayaran

var uploadPaymentProof = function uploadPaymentProof(req, res) {
  var order_id, file, allowedTypes, filename, filePath, _ref, _ref2, existingProof;

  return regeneratorRuntime.async(function uploadPaymentProof$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          order_id = req.body.order_id; // order_id dari form-data

          file = req.file; // File dari form-data

          if (file) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: 'File tidak ditemukan'
          }));

        case 4:
          allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

          if (allowedTypes.includes(file.mimetype)) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: 'Format file tidak didukung. Hanya jpg, jpeg, dan png.'
          }));

        case 7:
          filename = "".concat((0, _uuid.v4)()).concat(_path["default"].extname(file.originalname));
          filePath = "uploads/proofs/".concat(filename);
          _context.prev = 9;
          _context.next = 12;
          return regeneratorRuntime.awrap(_db["default"].query('SELECT proof_url FROM payments WHERE order_id = ?', [order_id]));

        case 12:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 1);
          existingProof = _ref2[0];

          if (!(existingProof[0] && existingProof[0].proof_url)) {
            _context.next = 24;
            break;
          }

          // Jika bukti pembayaran sudah ada, update dengan file baru
          _fs["default"].writeFileSync(filePath, file.buffer); // Update bukti pembayaran dan status order


          _context.next = 19;
          return regeneratorRuntime.awrap(_db["default"].query('UPDATE payments SET proof_url = ? WHERE order_id = ?', [filePath, order_id]));

        case 19:
          _context.next = 21;
          return regeneratorRuntime.awrap(_db["default"].query('UPDATE orders SET status = ? WHERE id = ?', ['pending_approval', order_id]));

        case 21:
          res.status(200).json({
            message: 'Bukti pembayaran berhasil diperbarui'
          });
          _context.next = 30;
          break;

        case 24:
          // Jika belum ada bukti pembayaran, insert yang baru
          _fs["default"].writeFileSync(filePath, file.buffer); // Insert bukti pembayaran baru


          _context.next = 27;
          return regeneratorRuntime.awrap(_db["default"].query('INSERT INTO payments (order_id, proof_url) VALUES (?, ?)', [order_id, filePath]));

        case 27:
          _context.next = 29;
          return regeneratorRuntime.awrap(_db["default"].query('UPDATE orders SET status = ? WHERE id = ?', ['pending_approval', order_id]));

        case 29:
          res.status(201).json({
            message: 'Bukti pembayaran berhasil diunggah'
          });

        case 30:
          _context.next = 36;
          break;

        case 32:
          _context.prev = 32;
          _context.t0 = _context["catch"](9);
          console.error(_context.t0);
          res.status(500).json({
            error: 'Gagal mengunggah bukti pembayaran'
          });

        case 36:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[9, 32]]);
}; // Middleware untuk menangani file upload


exports.uploadPaymentProof = uploadPaymentProof;
var uploadPaymentProofMiddleware = upload.single('paymentProof');
exports.uploadPaymentProofMiddleware = uploadPaymentProofMiddleware;