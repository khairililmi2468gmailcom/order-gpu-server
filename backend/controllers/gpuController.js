// src/controllers/gpuController.js
import pool from '../config/db.js';

export const createGpuPackage = async (req, res) => {
  const { name, price_per_hour, vcpu, ram, min_period_days } = req.body;

  try {
    // Insert GPU package baru ke database
    await pool.query(
      'INSERT INTO gpu_packages (name, price_per_hour, vcpu, ram, min_period_days) VALUES (?, ?, ?, ?, ?)',
      [name, price_per_hour, vcpu, ram, min_period_days]
    );

    res.status(201).json({ message: 'GPU package berhasil dibuat' });
  } catch (err) {
    console.error('Create GPU Package Error:', err);
    res.status(500).json({ error: 'Gagal membuat GPU package' });
  }
};

export const getGpuPackages = async (req, res) => {
  try {
    // Mengambil semua GPU packages
    const [gpuPackages] = await pool.query('SELECT * FROM gpu_packages');
    res.json(gpuPackages);
  } catch (err) {
    console.error('Get GPU Packages Error:', err);
    res.status(500).json({ error: 'Gagal mengambil GPU packages' });
  }
};

export const updateGpuPackage = async (req, res) => {
  const { id } = req.params;
  const { name, price_per_hour, vcpu, ram, min_period_days } = req.body;

  try {
    // Cek apakah GPU package ada
    const [gpuPackage] = await pool.query('SELECT * FROM gpu_packages WHERE id = ?', [id]);
    if (gpuPackage.length === 0) {
      return res.status(404).json({ error: 'GPU package tidak ditemukan' });
    }

    // Update GPU package
    await pool.query(
      'UPDATE gpu_packages SET name = ?, price_per_hour = ?, vcpu = ?, ram = ?, min_period_days = ? WHERE id = ?',
      [name, price_per_hour, vcpu, ram, min_period_days, id]
    );

    res.json({ message: 'GPU package berhasil diupdate' });
  } catch (err) {
    console.error('Update GPU Package Error:', err);
    res.status(500).json({ error: 'Gagal mengupdate GPU package' });
  }
};

export const deleteGpuPackage = async (req, res) => {
  const { id } = req.params;

  try {
    // Cek apakah GPU package ada
    const [gpuPackage] = await pool.query('SELECT * FROM gpu_packages WHERE id = ?', [id]);
    if (gpuPackage.length === 0) {
      return res.status(404).json({ error: 'GPU package tidak ditemukan' });
    }

    // Hapus GPU package
    await pool.query('DELETE FROM gpu_packages WHERE id = ?', [id]);

    res.json({ message: 'GPU package berhasil dihapus' });
  } catch (err) {
    console.error('Delete GPU Package Error:', err);
    res.status(500).json({ error: 'Gagal menghapus GPU package' });
  }
};
