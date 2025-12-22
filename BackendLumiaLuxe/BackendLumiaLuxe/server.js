const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { errorHandler } = require('./middleware/errorHandler');

// Load environment variables FIRST
dotenv.config();

const app = express();

/* =======================
   Middleware
======================= */

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS - Fixed to allow localhost AND Vercel
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://v0-lumialuxejewelry1.vercel.app',
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));

/* =======================
   Uploads Directory
======================= */

const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Uploads directory created');
}

// Serve uploads statically
app.use('/uploads', express.static(uploadsDir));

/* =======================
   MongoDB Connection
======================= */

console.log('🌍 MongoDB URI:', process.env.MONGODB_URI);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

/* =======================
   Routes
======================= */

try {
  const authRoutes = require('./routes/auth');
  const productRoutes = require('./routes/products');
  const cartRoutes = require('./routes/cart');
  const orderRoutes = require('./routes/orders');
  const userRoutes = require('./routes/users');
  const adminRoutes = require('./routes/admin');

  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/admin', adminRoutes);

  console.log('✅ All routes loaded successfully');
} catch (err) {
  console.error('❌ Error loading routes:', err);
}

/* =======================
   Health Check
======================= */

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date()
  });
});

/* =======================
   Root Route
======================= */

app.get('/', (req, res) => {
  res.json({
    message: 'Lumia Luxe E-commerce API',
    version: '1.0.0'
  });
});

/* =======================
   404 Handler
======================= */

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

/* =======================
   Error Handler
======================= */

app.use(errorHandler);

/* =======================
   Start Server
======================= */

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📁 Uploads served from: /uploads`);
});

/* =======================
   Graceful Shutdown
======================= */

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down...');
  server.close(() => {
    console.log('✅ Server closed');
  });
});