// app.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import visitorRoutes from './routes/visitorRoutes.js';
import runDeactivationCronJob from './cronJobs/deactivationJobs.js';
import runActivationCronJob from './cronJobs/activationJob.js';

dotenv.config();

const app = express();

// Environment variable check
if (!process.env.UPLOAD_DIR) {
  console.error('UPLOAD_DIR environment variable is not set');
  process.exit(1);
}

// Middleware
const corsOptions = {
  origin: 'http://localhost:3000', // Mengizinkan akses hanya dari localhost:3000
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Izinkan berbagai metode HTTP
  allowedHeaders: ['Content-Type', 'Authorization'], // Header yang diizinkan
};

app.use(cors(corsOptions));

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Izinkan cross-origin
}));
app.use(express.json());

app.use('/uploads', express.static(process.env.UPLOAD_DIR));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api', visitorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);

// Jalankan cron job saat server dimulai
runDeactivationCronJob();
runActivationCronJob();
// Optional: define root route to test '/' if needed
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is working' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

export default app;
