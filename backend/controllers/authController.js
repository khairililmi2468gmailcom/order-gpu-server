// src/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { validateEmailAndPassword } from '../utils/validation.js';

export const register = async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Validasi email dan password
  const { valid, error } = validateEmailAndPassword(email, password);
  if (!valid) return res.status(400).json({ error });

  try {
    const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) return res.status(400).json({ error: 'Email sudah terdaftar' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, phone]
    );

    res.status(201).json({ message: 'Registrasi berhasil' });
  } catch (err) {
    console.error('Register Error:', err); // Tambahan log
    res.status(500).json({ error: 'Gagal registrasi' });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validasi email dan password
  const { valid, error } = validateEmailAndPassword(email, password);
  if (!valid) return res.status(400).json({ error });

  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];
    if (!user) return res.status(400).json({ error: 'Email tidak ditemukan' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Password salah' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2d' }); // role penting untuk middleware
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    console.error('Login Error:', err); // Tambahan log
    res.status(500).json({ error: 'Gagal login' });
  }
};

export const refreshToken = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
  }

  const oldToken = authHeader.split(' ')[1];

  jwt.verify(oldToken, process.env.JWT_SECRET, { ignoreExpiration: true }, (err, decoded) => {
      if (err) {
          console.error(err);
          return res.status(403).json({ message: 'Invalid token' });
      }

      const { id, email, role } = decoded;

      const newToken = jwt.sign(
          { id, email, role },
          process.env.JWT_SECRET,
          { expiresIn: '1h' } // Token baru 1 jam lagi valid
      );

      res.status(200).json({ token: newToken });
  });
};
