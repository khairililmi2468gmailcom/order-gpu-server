// src/controllers/packageController.js
import pool from '../config/db.js';

export const getAllPackages = async (req, res) => {
  try {
    const [packages] = await pool.query('SELECT * FROM gpu_packages');
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data paket' });
  }
};