import express from 'express';
import uploadRouter from '../middlewares/upload.js'; // Mengimpor router upload dari middlewares/upload.js

const router = express.Router();

// Menambahkan rute upload pembayaran
router.use(uploadRouter);

export default router;
