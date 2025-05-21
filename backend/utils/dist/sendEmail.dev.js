"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _nodemailer = _interopRequireDefault(require("nodemailer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var transporter = _nodemailer["default"].createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

var sendEmail = function sendEmail(to, subject, html) {
  return regeneratorRuntime.async(function sendEmail$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(transporter.sendMail({
            from: "\"Admin GPU FMIPA USK\" <".concat(process.env.EMAIL_USER, ">"),
            to: to,
            subject: subject,
            html: html
          }));

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
};

var _default = sendEmail;
exports["default"] = _default;