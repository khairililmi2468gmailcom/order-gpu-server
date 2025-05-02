// src/controllers/gpuController.js
import pool from '../config/db.js';

export const createGpuPackage = async (req, res) => {
  const {
    name,
    price_per_hour,
    vcpu,
    ram,
    ssd,
    memory_gpu,
    description,
    min_period_hours,
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO gpu_packages 
        (name, price_per_hour, vcpu, ram, ssd, memory_gpu, description, min_period_hours) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, price_per_hour, vcpu, ram, ssd, memory_gpu, description, min_period_hours]
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
  const {
    name,
    price_per_hour,
    vcpu,
    ram,
    ssd,
    memory_gpu,
    description,
    min_period_hours,
  } = req.body;

  try {
    const [gpuPackage] = await pool.query('SELECT * FROM gpu_packages WHERE id = ?', [id]);
    if (gpuPackage.length === 0) {
      return res.status(404).json({ error: 'GPU package tidak ditemukan' });
    }

    await pool.query(
      `UPDATE gpu_packages 
        SET name = ?, price_per_hour = ?, vcpu = ?, ram = ?, ssd = ?, memory_gpu = ?, description = ?, min_period_hours = ? 
        WHERE id = ?`,
      [name, price_per_hour, vcpu, ram, ssd, memory_gpu, description, min_period_hours, id]
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
    const [gpuPackage] = await pool.query('SELECT * FROM gpu_packages WHERE id = ?', [id]);
    if (gpuPackage.length === 0) {
      return res.status(404).json({ error: 'GPU package tidak ditemukan' });
    }

    // Langkah 1: Cari semua order_id yang terkait dengan GPU package ini
    const [orders] = await pool.query('SELECT id FROM orders WHERE gpu_package_id = ?', [id]);
    const orderIds = orders.map(order => order.id);

    if (orderIds.length > 0) {
      // Langkah 2: Hapus payments yang terkait dengan order-order ini
      await pool.query('DELETE FROM payments WHERE order_id IN (?)', [orderIds]);

      // Langkah 3: Hapus semua orders
      await pool.query('DELETE FROM orders WHERE id IN (?)', [orderIds]);
    }

    // Langkah 4: Hapus GPU package
    await pool.query('DELETE FROM gpu_packages WHERE id = ?', [id]);

    res.json({ message: 'GPU package dan semua order serta payment terkait berhasil dihapus' });
  } catch (err) {
    console.error('Delete GPU Package Error:', err);
    res.status(500).json({ error: 'Gagal menghapus GPU package' });
  }
};
