// src/routes/adminRoutes.js
import express from 'express';
import { authenticate, isAdmin } from '../middlewares/auth.js';
import { approveOrder, deactivateToken, getAllOrders, getAllPayments, getTokens, getWebsiteStats, verifyPayment } from '../controllers/adminController.js';
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
router.put('/tokens/deactivate', authenticate, isAdmin, deactivateToken);
router.get('/stats', authenticate, isAdmin, logAccess, getWebsiteStats);

router.get('/payments', authenticate, isAdmin, getAllPayments);

export default router;
