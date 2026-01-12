const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

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
   CORS Configuration (Like your similar project)
======================= */
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://v0-lumialuxejewelry1.vercel.app',
      'https://lumia-luxe-jewelry.vercel.app',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'https://*.vercel.app'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      console.log('🌐 CORS blocked origin:', origin);
      callback(new Error('CORS policy violation'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept']
}));

/* =======================
   Request Logging
======================= */
app.use((req, res, next) => {
  console.log(`\n🌐 ${req.method} ${req.originalUrl}`);
  console.log(`📍 Origin: ${req.headers.origin || 'No origin'}`);
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    console.log('🛫 Preflight request');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    return res.status(200).json({});
  }
  
  next();
});

/* =======================
   Body Parser
======================= */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* =======================
   Uploads Directory
======================= */
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Uploads directory created');
}
app.use('/uploads', express.static(uploadsDir));

/* =======================
   MongoDB Connection
======================= */
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

/* =======================
   LOAD ROUTES (Exactly like your similar project)
======================= */
console.log('\n📁 Loading routes...');

try {
  // Try to load routes
  const authRoutes = require('./routes/auth');
  const productRoutes = require('./routes/products');
  const cartRoutes = require('./routes/cart');
  const orderRoutes = require('./routes/orders');
  const userRoutes = require('./routes/users');
  const adminRoutes = require('./routes/admin');

  // Mount routers
  console.log('🔧 Mounting routes...');
  
  app.use('/api/auth', authRoutes);
  console.log('   ✅ Auth routes mounted at /api/auth');
  
  app.use('/api/products', productRoutes);
  console.log('   ✅ Product routes mounted at /api/products');
  
  app.use('/api/cart', cartRoutes);
  console.log('   ✅ Cart routes mounted at /api/cart');
  
  app.use('/api/orders', orderRoutes);
  console.log('   ✅ Order routes mounted at /api/orders');
  
  app.use('/api/users', userRoutes);
  console.log('   ✅ User routes mounted at /api/users');
  
  app.use('/api/admin', adminRoutes);
  console.log('   ✅ Admin routes mounted at /api/admin');
  
  console.log('✅ All routes loaded and mounted successfully!');
  
} catch (err) {
  console.error('❌ CRITICAL: Error loading routes:', err.message);
  console.error('❌ Stack trace:', err.stack);
  
  // Provide fallback routes if route files don't exist
  console.log('⚠️ Creating fallback routes...');
  
  // Fallback auth route
  app.post('/api/auth/register', (req, res) => {
    console.log('📝 Fallback register:', req.body);
    res.json({
      success: false,
      message: 'Auth route file not found. Check server logs.'
    });
  });
  
  // Fallback products route
  app.get('/api/products', (req, res) => {
    console.log('📦 Fallback products:', req.query);
    res.json({
      success: false,
      message: 'Products route file not found. Check server logs.'
    });
  });
}

/* =======================
   TEST ENDPOINTS (For debugging)
======================= */
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Lumia Luxe API is working!',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: 'POST /api/auth/register, POST /api/auth/login',
      products: 'GET /api/products',
      cart: 'POST /api/cart',
      health: 'GET /api/health'
    }
  });
});

/* =======================
   HEALTH CHECK (For Railway)
======================= */
app.get('/api/health', (req, res) => {
  const health = {
    status: 'OK',
    message: 'Lumia Luxe API is running',
    timestamp: new Date(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development'
  };
  res.json(health);
});

/* =======================
   ROOT ENDPOINT
======================= */
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Lumia Luxe E-commerce API',
    version: '1.0.0',
    health: '/api/health',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders',
      users: '/api/users',
      admin: '/api/admin',
      test: '/api/test'
    }
  });
});

/* =======================
   404 HANDLER
======================= */
app.use('*', (req, res) => {
  console.error(`❌ 404: Route ${req.originalUrl} not found`);
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      '/api/health',
      '/api/test',
      '/api/auth/register',
      '/api/auth/login',
      '/api/products'
    ]
  });
});

/* =======================
   ERROR HANDLER
======================= */
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: isProduction ? undefined : err.message
  });
});

/* =======================
   START SERVER
======================= */
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/`);
  console.log(`🔗 API Health: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Test endpoint: http://localhost:${PORT}/api/test`);
});

/* =======================
   GRACEFUL SHUTDOWN
======================= */
process.on('unhandledRejection', (err) => {
  console.error('⚠️ Unhandled Promise Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});