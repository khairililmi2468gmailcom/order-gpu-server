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
export const getPackageById = async (req, res) => {
  const { id } = req.params;

  try {
    const [packageData] = await pool.query('SELECT * FROM gpu_packages WHERE id = ?', [id]);

    if (packageData.length === 0) {
      return res.status(404).json({ error: 'Paket tidak ditemukan' });
    }

    res.json(packageData[0]);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil detail paket' });
  }
};