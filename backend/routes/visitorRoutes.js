// routes/visitorRoutes.js
import express from 'express';
import { recordVisit, getTodayVisitors } from '../controllers/visitorController.js';

const router = express.Router();

router.post('/visitors', recordVisit); // Endpoint untuk mencatat kunjungan (POST karena kita membuat/memperbarui data)
router.get('/visitors/today', getTodayVisitors); // Endpoint untuk mendapatkan jumlah pengunjung hari ini

export default router;