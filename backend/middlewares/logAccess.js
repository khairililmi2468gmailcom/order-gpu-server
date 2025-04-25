// middlewares/logAccess.js
import pool from '../config/db.js'; // atau path ke koneksi MySQL kamu

const logAccess = async (req, res, next) => {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';
    const endpoint = req.originalUrl;

    await pool.query(
      'INSERT INTO access_log (ip, user_agent, endpoint) VALUES (?, ?, ?)',
      [ip, userAgent, endpoint]
    );
  } catch (err) {
    console.error('Log Access Error:', err); // Jangan blokir user meski gagal log
  }

  next();
};

export default logAccess;
