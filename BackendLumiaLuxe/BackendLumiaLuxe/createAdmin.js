const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@lumialuxe.com' });
    
    if (existingAdmin) {
      console.log('❌ Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      
      // Update to admin if not already
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ User role updated to admin!');
      }
      
      process.exit(0);
    }

    // Create new admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@lumialuxe.com',
      password: 'admin123', // This will be hashed automatically
      role: 'admin',
      phone: '+92 300 1234567'
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    admin@lumialuxe.com');
    console.log('🔐 Password: admin123');
    console.log('👤 Role:     admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  SECURITY WARNING:');
    console.log('   Please change the password after first login!');
    console.log('\n🌐 Login at:');
    console.log('   Local:      https://v0-lumialuxejewelry1.vercel.app/');
    console.log('   Production: hhttps://v0-lumialuxejewelry1.vercel.app/');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

// Run the function
createAdmin();