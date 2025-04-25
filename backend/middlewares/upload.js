import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import { uploadPaymentProofMiddleware, uploadPaymentProof } from '../controllers/paymentController.js';

const router = express.Router();

// Menggunakan middleware upload untuk menangani file
router.post('/orders/payment-proof', authenticate, uploadPaymentProofMiddleware, uploadPaymentProof);

export default router;
