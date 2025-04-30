"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _auth = require("../middlewares/auth.js");

var _userController = require("../controllers/userController.js");

var _orderController = require("../controllers/orderController.js");

var _packageController = require("../controllers/packageController.js");

var _paymentController = require("../controllers/paymentController.js");

var _notificationController = require("../controllers/notificationController.js");

var _visitorController = require("../controllers/visitorController.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// src/routes/userRoutes.js
var router = _express["default"].Router();

router.get('/packages', _packageController.getAllPackages);
router.get('/packages/:id', _packageController.getPackageById);
router.get('/orders', _auth.authenticate, _userController.getMyOrders);
router.post('/orders', _auth.authenticate, _orderController.createOrder);
router.get('/orders/:id/token', _auth.authenticate, _userController.getGpuToken);
router["delete"]('/orders/:id', _auth.authenticate, _userController.deleteOrder);
router.put('/profile', _auth.authenticate, _userController.updateProfile);
router.put('/profile/password', _auth.authenticate, _userController.updatePassword);
router.get('/notifications', _auth.authenticate, _notificationController.getNotifications);
router.put('/notifications/:id/read', _auth.authenticate, _notificationController.markNotificationAsRead);
router.post('/visitors', _visitorController.recordVisit);
router.get('/visitors/today', _visitorController.getTodayVisitors);
router.get('/visitors/total', _visitorController.getTotalVisitors);
var _default = router;
exports["default"] = _default;