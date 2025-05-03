// src/routes/userRoutes.js
import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import { deactivateOrder, deleteOrder, getMyOrders, startUsage, updatePassword, updateProfile } from '../controllers/userController.js';
import { createOrder } from '../controllers/orderController.js';
import { getAllPackages, getPackageById } from '../controllers/packageController.js';
import { getGpuToken } from '../controllers/userController.js';
import { uploadPaymentProof } from '../controllers/paymentController.js';
import { getNotifications, markNotificationAsRead } from '../controllers/notificationController.js';
import { getTodayVisitors, getTotalVisitors, recordVisit } from '../controllers/visitorController.js';

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
router.post('/visitors', recordVisit);
router.get('/visitors/today', getTodayVisitors);
router.get('/visitors/total', getTotalVisitors);
router.put('/start-usage', authenticate, startUsage);
router.put('/orders/:id/deactivate', authenticate, deactivateOrder); 

export default router;
