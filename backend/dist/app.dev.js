"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _cors = _interopRequireDefault(require("cors"));

var _helmet = _interopRequireDefault(require("helmet"));

var _expressRateLimit = _interopRequireDefault(require("express-rate-limit"));

var _authRoutes = _interopRequireDefault(require("./routes/authRoutes.js"));

var _userRoutes = _interopRequireDefault(require("./routes/userRoutes.js"));

var _adminRoutes = _interopRequireDefault(require("./routes/adminRoutes.js"));

var _paymentRoutes = _interopRequireDefault(require("./routes/paymentRoutes.js"));

var _visitorRoutes = _interopRequireDefault(require("./routes/visitorRoutes.js"));

var _deactivationJobs = _interopRequireDefault(require("./cronJobs/deactivationJobs.js"));

var _activationJob = _interopRequireDefault(require("./cronJobs/activationJob.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// app.js
_dotenv["default"].config();

var app = (0, _express["default"])(); // Environment variable check

if (!process.env.UPLOAD_DIR) {
  console.error('UPLOAD_DIR environment variable is not set');
  process.exit(1);
} // Middleware


var corsOptions = {
  origin: 'http://localhost:3000',
  // Mengizinkan akses hanya dari localhost:3000
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  // Izinkan berbagai metode HTTP
  allowedHeaders: ['Content-Type', 'Authorization'] // Header yang diizinkan

};
app.use((0, _cors["default"])(corsOptions));
app.use((0, _helmet["default"])({
  crossOriginResourcePolicy: {
    policy: "cross-origin"
  } // Izinkan cross-origin

}));
app.use(_express["default"].json());
app.use('/uploads', _express["default"]["static"](process.env.UPLOAD_DIR)); // Rate limiting

var limiter = (0, _expressRateLimit["default"])({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter); // Routes

app.use('/api/auth', _authRoutes["default"]);
app.use('/api/user', _userRoutes["default"]);
app.use('/api', _visitorRoutes["default"]);
app.use('/api/admin', _adminRoutes["default"]);
app.use('/api/payment', _paymentRoutes["default"]); // Jalankan cron job saat server dimulai

(0, _deactivationJobs["default"])();
(0, _activationJob["default"])(); // Optional: define root route to test '/' if needed

app.get('/', function (req, res) {
  res.status(200).json({
    message: 'API is working'
  });
}); // Error handler

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!'
  });
});
var _default = app;
exports["default"] = _default;