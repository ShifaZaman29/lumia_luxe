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
  'https://v0-lumialuxejewelry1.vercel.app',
  'https://lumia-luxe-jewelry.vercel.app',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://*.vercel.app',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (!isProduction) return callback(null, true);
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
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
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
app.use('/uploads', express.static(uploadsDir));

/* =======================
   BASIC ROUTES (Always available)
======================= */
// Health check (always available)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Lumia Luxe API is running',
    timestamp: new Date(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Test route
app.post('/api/test-auth', (req, res) => {
  res.json({
    success: true,
    message: 'Test auth route is working',
    timestamp: new Date()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: '🎉 Lumia Luxe E-commerce API',
    version: '1.0.0',
    status: 'operational',
    health: '/api/health',
    test_auth: 'POST /api/test-auth'
  });
});

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
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');
    
    // NOW load main routes after DB is connected
    loadMainRoutes();
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('🔄 Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

// Function to load main routes AFTER DB connects
const loadMainRoutes = () => {
  console.log('🔄 Loading main application routes...');
  
  try {
    // Test if route files exist
    console.log('📁 Checking route files...');
    
    const routes = [
      { path: './routes/auth', name: 'auth' },
      { path: './routes/products', name: 'products' },
      { path: './routes/cart', name: 'cart' },
      { path: './routes/orders', name: 'orders' },
      { path: './routes/users', name: 'users' },
      { path: './routes/admin', name: 'admin' }
    ];
    
    routes.forEach(route => {
      try {
        const routeModule = require(route.path);
        app.use(`/api/${route.name}`, routeModule);
        console.log(`✅ ${route.name} routes loaded`);
      } catch (err) {
        console.error(`❌ Failed to load ${route.name} routes:`, err.message);
      }
    });
    
    console.log('✅ Main routes loaded successfully');
    
  } catch (err) {
    console.error('❌ Critical error loading routes:', err);
  }
};

// MongoDB events
mongoose.connection.on('connected', () => console.log('✅ Mongoose connected to MongoDB'));
mongoose.connection.on('error', (err) => console.error('❌ Mongoose connection error:', err.message));
mongoose.connection.on('disconnected', () => console.warn('⚠️ Mongoose disconnected'));

/* =======================
   404 Handler
======================= */
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      '/api/health',
      '/api/test-auth',
      '/api/auth/register',
      '/api/auth/login'
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
const startServer = () => {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Health: http://localhost:${PORT}/api/health`);
    console.log(`🔗 Frontend: https://v0-lumialuxejewelry1.vercel.app`);
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
};

// Start DB connection, then server
connectDB();

// Start server immediately for basic routes
startServer();