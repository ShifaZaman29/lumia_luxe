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
    console.log(`📊 Database: ${mongoose.connection.db?.databaseName || 'Unknown'}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('🔄 Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};
connectDB();

// MongoDB events
mongoose.connection.on('connected', () => console.log('✅ Mongoose connected to MongoDB'));
mongoose.connection.on('error', (err) => console.error('❌ Mongoose connection error:', err.message));
mongoose.connection.on('disconnected', () => console.warn('⚠️ Mongoose disconnected'));

/* =======================
   TEMPORARY ROUTES (For immediate testing)
======================= */

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    timestamp: new Date(),
    routes: [
      '/api/health',
      '/api/auth/register',
      '/api/auth/login',
      '/api/products'
    ]
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Lumia Luxe API is running',
    timestamp: new Date(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// SIMPLE AUTH ROUTES
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log('📝 Registration attempt:', { name, email });
    
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }
    
    res.json({
      success: true,
      message: 'Registration successful',
      user: {
        id: Date.now().toString(),
        name,
        email,
        token: 'jwt_test_token_' + Date.now()
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔐 Login attempt:', { email });
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: '123',
        name: 'Test User',
        email,
        token: 'jwt_test_token_' + Date.now()
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// SIMPLE PRODUCTS ROUTES
app.get('/api/products', (req, res) => {
  try {
    const { featured, limit = 8 } = req.query;
    
    console.log('📦 Products request:', { featured, limit });
    
    const mockProducts = [
      {
        _id: "1",
        name: "Gold Diamond Ring",
        slug: "gold-diamond-ring",
        price: 12999,
        compareAtPrice: 15999,
        images: [{ url: "https://via.placeholder.com/400x400/FFD700/000000?text=Gold+Ring" }],
        category: "rings",
        stock: 10,
        featured: true,
        ratings: { average: 4.5, count: 24 }
      },
      {
        _id: "2",
        name: "Silver Pearl Necklace",
        slug: "silver-pearl-necklace",
        price: 8999,
        compareAtPrice: 11999,
        images: [{ url: "https://via.placeholder.com/400x400/C0C0C0/000000?text=Silver+Necklace" }],
        category: "necklaces",
        stock: 8,
        featured: true,
        ratings: { average: 4.7, count: 32 }
      },
      {
        _id: "3",
        name: "Rose Gold Earrings",
        slug: "rose-gold-earrings",
        price: 4999,
        compareAtPrice: 6999,
        images: [{ url: "https://via.placeholder.com/400x400/FF69B4/000000?text=Rose+Gold" }],
        category: "earrings",
        stock: 15,
        featured: true,
        ratings: { average: 4.3, count: 18 }
      },
      {
        _id: "4",
        name: "Platinum Wedding Band",
        slug: "platinum-wedding-band",
        price: 18999,
        compareAtPrice: 22999,
        images: [{ url: "https://via.placeholder.com/400x400/E5E4E2/000000?text=Platinum" }],
        category: "rings",
        stock: 5,
        featured: true,
        ratings: { average: 4.8, count: 12 }
      }
    ];
    
    // Filter featured if requested
    let products = mockProducts;
    if (featured === 'true') {
      products = mockProducts.filter(p => p.featured);
    }
    
    // Apply limit
    products = products.slice(0, parseInt(limit));
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching products'
    });
  }
});

// SIMPLE CART ROUTE
app.post('/api/cart', (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    console.log('🛒 Add to cart:', { productId, quantity });
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }
    
    res.json({
      success: true,
      message: 'Added to cart',
      cartItem: {
        productId,
        quantity,
        id: Date.now().toString()
      }
    });
  } catch (error) {
    console.error('Cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

/* =======================
   Root Route
======================= */
app.get('/', (req, res) => {
  res.json({
    message: '🎉 Lumia Luxe E-commerce API',
    version: '1.0.0',
    status: 'operational',
    endpoints: {
      health: '/api/health',
      test: '/api/test',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      },
      products: 'GET /api/products',
      cart: 'POST /api/cart'
    },
    frontend: 'https://v0-lumialuxejewelry1.vercel.app'
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
      '/api/test',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/products',
      'POST /api/cart'
    ]
  });
});

/* =======================
   Error Handler
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
   Start Server
======================= */
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Health: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Test: http://localhost:${PORT}/api/test`);
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