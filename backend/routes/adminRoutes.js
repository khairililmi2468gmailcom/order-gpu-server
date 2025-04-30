// src/routes/adminRoutes.js
import express from 'express';
import { authenticate, isAdmin } from '../middlewares/auth.js';
import { approveOrder,  getAllOrders, getAllPayments, getTokens, getWebsiteStats,  sendTokenToUser,  updateOrderToken,  updatePassword,  updateTokenStatus, updateUser, verifyPayment } from '../controllers/adminController.js';
import { createGpuPackage, getGpuPackages, updateGpuPackage, deleteGpuPackage } from '../controllers/gpuController.js';
import logAccess from '../middlewares/logAccess.js';

const router = express.Router();

// Rute untuk memanage pesanan
router.get('/orders', authenticate, isAdmin, getAllOrders);
router.put('/payments/verify', authenticate, isAdmin, verifyPayment);
router.put('/orders/approve', authenticate, isAdmin, approveOrder);
router.post('/orders/verify', authenticate, isAdmin, verifyPayment);
// Rute untuk memanage GPU packages
router.get('/gpu-packages', authenticate, isAdmin, getGpuPackages);
router.post('/gpu-packages', authenticate, isAdmin, createGpuPackage);
router.put('/gpu-packages/:id', authenticate, isAdmin, updateGpuPackage);
router.delete('/gpu-packages/:id', authenticate, isAdmin, deleteGpuPackage);

// Rute untuk memanage token dan statistik
router.get('/tokens', authenticate, isAdmin, getTokens);
router.put('/tokens/token-status', authenticate, isAdmin, updateTokenStatus);
router.put('/tokens/order-token', authenticate, isAdmin, updateOrderToken);
router.get('/stats', authenticate, isAdmin, logAccess, getWebsiteStats);
router.get('/payments', authenticate, isAdmin, getAllPayments);

router.put('/users/:id', authenticate, isAdmin, updateUser);
router.put('/password/:id', authenticate, isAdmin, updatePassword);
router.put('/orders/send-token', authenticate, isAdmin, sendTokenToUser);

export default router;
