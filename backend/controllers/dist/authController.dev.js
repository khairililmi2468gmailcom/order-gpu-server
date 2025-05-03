"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetPassword = exports.forgotPassword = exports.refreshToken = exports.login = exports.register = void 0;

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _db = _interopRequireDefault(require("../config/db.js"));

var _validation = require("../utils/validation.js");

var _mailer = require("../utils/mailer.js");

var _crypto = _interopRequireDefault(require("crypto"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

_dotenv["default"].config();

var register = function register(req, res) {
  var _req$body, name, email, password, phone, _validateEmailAndPass, valid, error, _ref, _ref2, existingUser, hashedPassword;

  return regeneratorRuntime.async(function register$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, name = _req$body.name, email = _req$body.email, password = _req$body.password, phone = _req$body.phone; // Validasi email dan password

          _validateEmailAndPass = (0, _validation.validateEmailAndPassword)(email, password), valid = _validateEmailAndPass.valid, error = _validateEmailAndPass.error;

          if (valid) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: error
          }));

        case 4:
          _context.prev = 4;
          _context.next = 7;
          return regeneratorRuntime.awrap(_db["default"].query('SELECT * FROM users WHERE email = ?', [email]));

        case 7:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 1);
          existingUser = _ref2[0];

          if (!(existingUser.length > 0)) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: 'Email sudah terdaftar'
          }));

        case 12:
          _context.next = 14;
          return regeneratorRuntime.awrap(_bcryptjs["default"].hash(password, 10));

        case 14:
          hashedPassword = _context.sent;
          _context.next = 17;
          return regeneratorRuntime.awrap(_db["default"].query('INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, phone]));

        case 17:
          res.status(201).json({
            message: 'Registrasi berhasil'
          });
          _context.next = 24;
          break;

        case 20:
          _context.prev = 20;
          _context.t0 = _context["catch"](4);
          console.error('Register Error:', _context.t0); // Tambahan log

          res.status(500).json({
            error: 'Gagal registrasi'
          });

        case 24:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 20]]);
};

exports.register = register;

var login = function login(req, res) {
  var _req$body2, email, password, _validateEmailAndPass2, valid, error, _ref3, _ref4, users, user, isMatch, token;

  return regeneratorRuntime.async(function login$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password; // Validasi email dan password

          _validateEmailAndPass2 = (0, _validation.validateEmailAndPassword)(email, password), valid = _validateEmailAndPass2.valid, error = _validateEmailAndPass2.error;

          if (valid) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: error
          }));

        case 4:
          _context2.prev = 4;
          _context2.next = 7;
          return regeneratorRuntime.awrap(_db["default"].query('SELECT * FROM users WHERE email = ?', [email]));

        case 7:
          _ref3 = _context2.sent;
          _ref4 = _slicedToArray(_ref3, 1);
          users = _ref4[0];
          user = users[0];

          if (user) {
            _context2.next = 13;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: 'Email tidak ditemukan'
          }));

        case 13:
          _context2.next = 15;
          return regeneratorRuntime.awrap(_bcryptjs["default"].compare(password, user.password));

        case 15:
          isMatch = _context2.sent;

          if (isMatch) {
            _context2.next = 18;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            error: 'Password salah'
          }));

        case 18:
          token = _jsonwebtoken["default"].sign({
            id: user.id,
            role: user.role
          }, process.env.JWT_SECRET, {
            expiresIn: '20m'
          }); // role penting untuk middleware

          res.json({
            token: token,
            user: {
              id: user.id,
              name: user.name,
              role: user.role,
              email: user.email,
              phone: user.phone
            }
          });
          _context2.next = 26;
          break;

        case 22:
          _context2.prev = 22;
          _context2.t0 = _context2["catch"](4);
          console.error('Login Error:', _context2.t0); // Tambahan log

          res.status(500).json({
            error: 'Gagal login'
          });

        case 26:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[4, 22]]);
};

exports.login = login;

var refreshToken = function refreshToken(req, res) {
  var authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'No token provided'
    });
  }

  var oldToken = authHeader.split(' ')[1];

  _jsonwebtoken["default"].verify(oldToken, process.env.JWT_SECRET, {
    ignoreExpiration: true
  }, function (err, decoded) {
    if (err) {
      console.error(err);
      return res.status(403).json({
        message: 'Invalid token'
      });
    }

    var id = decoded.id,
        email = decoded.email,
        role = decoded.role;

    var newToken = _jsonwebtoken["default"].sign({
      id: id,
      email: email,
      role: role
    }, process.env.JWT_SECRET, {
      expiresIn: '20m'
    } // Token baru 20 menit lagi valid
    );

    res.status(200).json({
      token: newToken
    });
  });
};

exports.refreshToken = refreshToken;

var forgotPassword = function forgotPassword(req, res) {
  var email, _ref5, _ref6, users, token, expires, resetLink;

  return regeneratorRuntime.async(function forgotPassword$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          email = req.body.email;
          _context3.next = 3;
          return regeneratorRuntime.awrap(_db["default"].query('SELECT * FROM users WHERE email = ?', [email]));

        case 3:
          _ref5 = _context3.sent;
          _ref6 = _slicedToArray(_ref5, 1);
          users = _ref6[0];

          if (!(users.length === 0)) {
            _context3.next = 8;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: 'Email tidak ditemukan'
          }));

        case 8:
          token = _crypto["default"].randomBytes(32).toString('hex');
          expires = new Date(Date.now() + 60 * 60 * 1000); // 1 jam

          _context3.next = 12;
          return regeneratorRuntime.awrap(_db["default"].query('INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)', [email, token, expires]));

        case 12:
          resetLink = "".concat(process.env.FRONTEND_URL, "/reset-password?token=").concat(token);
          _context3.next = 15;
          return regeneratorRuntime.awrap((0, _mailer.sendEmail)(email, 'Reset Password', "\n    <p>Klik link berikut untuk mengatur ulang password Anda:</p>\n    <a href=\"".concat(resetLink, "\">").concat(resetLink, "</a>\n    <p>Link berlaku selama 1 jam.</p>\n  ")));

        case 15:
          res.json({
            message: 'Link reset password telah dikirim ke email'
          });

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.forgotPassword = forgotPassword;

var resetPassword = function resetPassword(req, res) {
  var _req$body3, token, newPassword, _ref7, _ref8, rows, email, hashed;

  return regeneratorRuntime.async(function resetPassword$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body3 = req.body, token = _req$body3.token, newPassword = _req$body3.newPassword;
          _context4.next = 3;
          return regeneratorRuntime.awrap(_db["default"].query('SELECT * FROM password_resets WHERE token = ? AND expires_at > NOW()', [token]));

        case 3:
          _ref7 = _context4.sent;
          _ref8 = _slicedToArray(_ref7, 1);
          rows = _ref8[0];

          if (!(rows.length === 0)) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            error: 'Token tidak valid atau telah kedaluwarsa'
          }));

        case 8:
          email = rows[0].email;
          _context4.next = 11;
          return regeneratorRuntime.awrap(_bcryptjs["default"].hash(newPassword, 10));

        case 11:
          hashed = _context4.sent;
          _context4.next = 14;
          return regeneratorRuntime.awrap(_db["default"].query('UPDATE users SET password = ? WHERE email = ?', [hashed, email]));

        case 14:
          _context4.next = 16;
          return regeneratorRuntime.awrap(_db["default"].query('DELETE FROM password_resets WHERE email = ?', [email]));

        case 16:
          res.json({
            message: 'Password berhasil diatur ulang'
          });

        case 17:
        case "end":
          return _context4.stop();
      }
    }
  });
};

exports.resetPassword = resetPassword;