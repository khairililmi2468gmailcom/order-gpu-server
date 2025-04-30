// src/controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { validateEmailAndPassword } from '../utils/validation.js';
import { sendEmail } from '../utils/mailer.js';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

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
    res.json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email, phone: user.phone } });
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

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

  if (users.length === 0) return res.status(404).json({ error: 'Email tidak ditemukan' });

  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 jam

  await pool.query('INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)', [
    email, token, expires
  ]);

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await sendEmail(email, 'Reset Password', `
    <p>Klik link berikut untuk mengatur ulang password Anda:</p>
    <a href="${resetLink}">${resetLink}</a>
    <p>Link berlaku selama 1 jam.</p>
  `);

  res.json({ message: 'Link reset password telah dikirim ke email' });
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  const [rows] = await pool.query(
    'SELECT * FROM password_resets WHERE token = ? AND expires_at > NOW()',
    [token]
  );

  if (rows.length === 0) return res.status(400).json({ error: 'Token tidak valid atau telah kedaluwarsa' });

  const email = rows[0].email;
  const hashed = await bcrypt.hash(newPassword, 10);

  await pool.query('UPDATE users SET password = ? WHERE email = ?', [hashed, email]);
  await pool.query('DELETE FROM password_resets WHERE email = ?', [email]);

  res.json({ message: 'Password berhasil diatur ulang' });
};