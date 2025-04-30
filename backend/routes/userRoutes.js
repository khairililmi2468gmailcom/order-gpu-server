// src/routes/userRoutes.js
import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import { deleteOrder, getMyOrders, updatePassword, updateProfile } from '../controllers/userController.js';
import { createOrder } from '../controllers/orderController.js';
import { getAllPackages, getPackageById } from '../controllers/packageController.js';
import { getGpuToken } from '../controllers/userController.js';
import { uploadPaymentProof } from '../controllers/paymentController.js';
import { getNotifications, markNotificationAsRead } from '../controllers/notificationController.js';

const router = express.Router();
router.get('/packages', getAllPackages);
router.get('/packages/:id', getPackageById);
router.get('/orders', authenticate, getMyOrders);
router.post('/orders', authenticate, createOrder);
router.get('/orders/:id/token', authenticate, getGpuToken);
router.delete('/orders/:id', authenticate, deleteOrder);
router.put('/profile', authenticate, updateProfile);
router.put('/profile/password', authenticate, updatePassword);
router.get('/notifications', authenticate, getNotifications);
router.put('/notifications/:id/read', authenticate, markNotificationAsRead);
export default router;
