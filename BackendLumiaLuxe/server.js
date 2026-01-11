const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { errorHandler } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();

/* =======================
   Configuration
======================= */
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 4000;

console.log('🚀 Starting Lumia Luxe API Server');
console.log(`🌍 Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'Not set'}`);

/* =======================
   Trust Railway Proxy
======================= */
app.set('trust proxy', 1);

/* =======================
   CORS Configuration
======================= */
const allowedOrigins = [
  'https://lumialuxe.vercel.app',
  'https://lumialuxe.vercel.app/',
  'http://localhost:3000',
  'http://localhost:5500',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5500'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Development: allow all
    if (!isProduction) return callback(null, true);
    
    // Production: check against allowed list
    if (allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

/* =======================
   Body Parser
======================= */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* =======================
   Security Headers
======================= */
app.use((req, res, next) => {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // CORS headers
  res.header('Access-Control-Allow-Credentials', 'true');
  
  next();
});

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
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('❌ MONGODB_URI is not defined in environment variables');
      return;
    }
    
    console.log('🔌 Connecting to MongoDB...');
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.db?.databaseName || 'Unknown'}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    // Retry after 5 seconds
    console.log('🔄 Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ Mongoose disconnected from MongoDB');
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

  console.log('✅ All API routes loaded');
} catch (err) {
  console.error('❌ Error loading routes:', err);
}

/* =======================
   Health Check Endpoints
======================= */
app.get('/api/health', (req, res) => {
  const health = {
    status: 'OK',
    message: 'Lumia Luxe API is running',
    timestamp: new Date(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development',
    frontend: process.env.FRONTEND_URL || 'Not set',
    version: '1.0.0'
  };
  res.json(health);
});

app.get('/', (req, res) => {
  res.json({
    message: '🎉 Lumia Luxe E-commerce API',
    version: '1.0.0',
    status: 'operational',
    endpoints: {
      docs: 'Coming soon',
      health: '/api/health',
      auth: '/api/auth',
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders',
      users: '/api/users',
      admin: '/api/admin'
    },
    frontend: 'https://lumialuxe.vercel.app'
  });
});

/* =======================
   404 Handler
======================= */
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      '/api/health',
      '/api/auth',
      '/api/products',
      '/api/cart',
      '/api/orders',
      '/api/users',
      '/api/admin'
    ]
  });
});

/* =======================
   Error Handler
======================= */
app.use(errorHandler);

/* =======================
   Start Server
======================= */
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Health check: https://lumialuxe-production.up.railway.app/api/health`);
  console.log(`🔗 Frontend: https://lumialuxe.vercel.app`);
  console.log(`📁 Uploads: https://lumialuxe-production.up.railway.app/uploads`);
  console.log(`📊 Database: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'}`);
});

/* =======================
   Graceful Shutdown
======================= */
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});