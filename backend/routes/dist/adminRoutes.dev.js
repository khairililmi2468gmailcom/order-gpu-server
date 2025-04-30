"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _auth = require("../middlewares/auth.js");

var _adminController = require("../controllers/adminController.js");

var _gpuController = require("../controllers/gpuController.js");

var _logAccess = _interopRequireDefault(require("../middlewares/logAccess.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// src/routes/adminRoutes.js
var router = _express["default"].Router(); // Rute untuk memanage pesanan


router.get('/orders', _auth.authenticate, _auth.isAdmin, _adminController.getAllOrders);
router.put('/payments/verify', _auth.authenticate, _auth.isAdmin, _adminController.verifyPayment);
router.put('/orders/approve', _auth.authenticate, _auth.isAdmin, _adminController.approveOrder);
router.post('/orders/verify', _auth.authenticate, _auth.isAdmin, _adminController.verifyPayment); // Rute untuk memanage GPU packages

router.get('/gpu-packages', _auth.authenticate, _auth.isAdmin, _gpuController.getGpuPackages);
router.post('/gpu-packages', _auth.authenticate, _auth.isAdmin, _gpuController.createGpuPackage);
router.put('/gpu-packages/:id', _auth.authenticate, _auth.isAdmin, _gpuController.updateGpuPackage);
router["delete"]('/gpu-packages/:id', _auth.authenticate, _auth.isAdmin, _gpuController.deleteGpuPackage); // Rute untuk memanage token dan statistik

router.get('/tokens', _auth.authenticate, _auth.isAdmin, _adminController.getTokens);
router.put('/tokens/token-status', _auth.authenticate, _auth.isAdmin, _adminController.updateTokenStatus);
router.put('/tokens/order-token', _auth.authenticate, _auth.isAdmin, _adminController.updateOrderToken);
router.get('/stats', _auth.authenticate, _auth.isAdmin, _logAccess["default"], _adminController.getWebsiteStats);
router.get('/payments', _auth.authenticate, _auth.isAdmin, _adminController.getAllPayments);
router.put('/users/:id', _auth.authenticate, _auth.isAdmin, _adminController.updateUser);
router.put('/password/:id', _auth.authenticate, _auth.isAdmin, _adminController.updatePassword);
router.put('/orders/send-token', _auth.authenticate, _auth.isAdmin, _adminController.sendTokenToUser);
var _default = router;
exports["default"] = _default;