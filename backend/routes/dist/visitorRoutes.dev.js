"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _visitorController = require("../controllers/visitorController.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// routes/visitorRoutes.js
var router = _express["default"].Router();

router.post('/visitors', _visitorController.recordVisit); // Endpoint untuk mencatat kunjungan (POST karena kita membuat/memperbarui data)

router.get('/visitors/today', _visitorController.getTodayVisitors); // Endpoint untuk mendapatkan jumlah pengunjung hari ini

var _default = router;
exports["default"] = _default;