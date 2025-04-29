// src/routes/userRoutes.js
import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import { getMyOrders } from '../controllers/userController.js';
import { createOrder } from '../controllers/orderController.js';
import { getAllPackages, getPackageById } from '../controllers/packageController.js';
import { getGpuToken } from '../controllers/userController.js';
import { uploadPaymentProof } from '../controllers/paymentController.js';

const router = express.Router();
router.get('/packages', getAllPackages);
router.get('/packages/:id', getPackageById);
router.get('/orders', authenticate, getMyOrders);
router.post('/orders', authenticate, createOrder);
router.get('/orders/:id/token', authenticate, getGpuToken);

export default router;
