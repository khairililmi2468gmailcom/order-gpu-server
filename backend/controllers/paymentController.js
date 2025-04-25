import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import pool from '../config/db.js';

// Konfigurasi penyimpanan file dengan multer
const storage = multer.memoryStorage(); // Menyimpan file dalam memory sementara
const upload = multer({ storage });

// Fungsi untuk menangani upload bukti pembayaran
export const uploadPaymentProof = async (req, res) => {
  const { order_id } = req.body; // order_id dari form-data
  const file = req.file; // File dari form-data

  if (!file) {
    return res.status(400).json({ error: 'File tidak ditemukan' });
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedTypes.includes(file.mimetype)) {
    return res.status(400).json({ error: 'Format file tidak didukung. Hanya jpg, jpeg, dan png.' });
  }

  const filename = `${uuidv4()}${path.extname(file.originalname)}`;
  const filePath = `uploads/proofs/${filename}`;

  try {
    // Cek apakah sudah ada bukti pembayaran sebelumnya
    const [existingProof] = await pool.query('SELECT proof_url FROM payments WHERE order_id = ?', [order_id]);

    if (existingProof[0] && existingProof[0].proof_url) {
      // Jika bukti pembayaran sudah ada, update dengan file baru
      fs.writeFileSync(filePath, file.buffer);

      // Update bukti pembayaran dan status order
      await pool.query('UPDATE payments SET proof_url = ? WHERE order_id = ?', [filePath, order_id]);
      await pool.query('UPDATE orders SET status = ? WHERE id = ?', ['pending_approval', order_id]);

      res.status(200).json({ message: 'Bukti pembayaran berhasil diperbarui' });
    } else {
      // Jika belum ada bukti pembayaran, insert yang baru
      fs.writeFileSync(filePath, file.buffer);

      // Insert bukti pembayaran baru
      await pool.query('INSERT INTO payments (order_id, proof_url) VALUES (?, ?)', [order_id, filePath]);
      await pool.query('UPDATE orders SET status = ? WHERE id = ?', ['pending_approval', order_id]);

      res.status(201).json({ message: 'Bukti pembayaran berhasil diunggah' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengunggah bukti pembayaran' });
  }
};

// Middleware untuk menangani file upload
export const uploadPaymentProofMiddleware = upload.single('paymentProof');
