const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const sampleProducts = [
  {
    name: "Diamond Solitaire Ring",
    description: "Elegant 18k white gold solitaire ring featuring a brilliant-cut diamond. Perfect for engagements and special occasions.",
    price: 45000,
    compareAtPrice: 55000,
    category: "rings",
    material: "white-gold",
    purity: "18k",
    gemstones: [
      {
        name: "Diamond",
        type: "diamond",
        carats: 1.0
      }
    ],
    stock: 5,
    featured: true,
    occasion: ["engagement", "wedding", "anniversary"],
    gender: "women",
    images: [
      { url: "/uploads/products/diamond-ring.jpg", alt: "Diamond Solitaire Ring" }
    ],
    tags: ["diamond", "engagement", "luxury"]
  },
  {
    name: "Gold Chain Necklace",
    description: "Classic 22k yellow gold chain necklace. Timeless design suitable for everyday wear.",
    price: 35000,
    category: "chains",
    material: "gold",
    purity: "22k",
    stock: 10,
    featured: true,
    occasion: ["everyday", "casual", "formal"],
    gender: "unisex",
    images: [
      { url: "/uploads/products/gold-chain.jpg", alt: "Gold Chain Necklace" }
    ],
    tags: ["gold", "chain", "classic"],
    weight: {
      value: 15,
      unit: "g"
    }
  },
  {
    name: "Pearl Drop Earrings",
    description: "Stunning freshwater pearl drop earrings set in sterling silver. Elegant and sophisticated.",
    price: 8500,
    compareAtPrice: 12000,
    category: "earrings",
    material: "silver",
    purity: "925-silver",
    gemstones: [
      {
        name: "Pearl",
        type: "pearl"
      }
    ],
    stock: 15,
    featured: false,
    occasion: ["party", "wedding", "formal"],
    gender: "women",
    images: [
      { url: "/uploads/products/pearl-earrings.jpg", alt: "Pearl Drop Earrings" }
    ],
    tags: ["pearl", "earrings", "elegant"]
  },
  {
    name: "Rose Gold Bracelet",
    description: "Delicate rose gold bracelet with intricate design. Perfect for gifting or personal wear.",
    price: 18500,
    category: "bracelets",
    material: "rose-gold",
    purity: "18k",
    stock: 8,
    featured: true,
    occasion: ["birthday", "anniversary", "everyday"],
    gender: "women",
    images: [
      { url: "/uploads/products/rose-gold-bracelet.jpg", alt: "Rose Gold Bracelet" }
    ],
    tags: ["rose-gold", "bracelet", "gift"],
    weight: {
      value: 8,
      unit: "g"
    }
  },
  {
    name: "Sapphire Pendant Set",
    description: "Exquisite sapphire pendant with matching earrings in white gold. A complete jewelry set.",
    price: 65000,
    compareAtPrice: 75000,
    category: "combosets",
    material: "white-gold",
    purity: "18k",
    gemstones: [
      {
        name: "Sapphire",
        type: "sapphire",
        carats: 2.5
      }
    ],
    stock: 3,
    featured: true,
    occasion: ["wedding", "party", "formal"],
    gender: "women",
    images: [
      { url: "/uploads/products/sapphire-set.jpg", alt: "Sapphire Pendant Set" }
    ],
    tags: ["sapphire", "set", "luxury"]
  },
  {
    name: "Men's Silver Ring",
    description: "Bold sterling silver ring with modern design. Perfect for everyday wear.",
    price: 6500,
    category: "rings",
    material: "silver",
    purity: "925-silver",
    stock: 12,
    featured: false,
    occasion: ["everyday", "casual"],
    gender: "men",
    sizes: ["7", "8", "9", "10", "11"],
    images: [
      { url: "/uploads/products/mens-silver-ring.jpg", alt: "Men's Silver Ring" }
    ],
    tags: ["silver", "men", "ring"],
    weight: {
      value: 12,
      unit: "g"
    }
  },
  {
    name: "Ruby Heart Pendant",
    description: "Beautiful heart-shaped ruby pendant in yellow gold. Symbol of love and passion.",
    price: 28000,
    category: "pendants",
    material: "gold",
    purity: "22k",
    gemstones: [
      {
        name: "Ruby",
        type: "ruby",
        carats: 1.5
      }
    ],
    stock: 6,
    featured: true,
    occasion: ["anniversary", "birthday", "valentine"],
    gender: "women",
    images: [
      { url: "/uploads/products/ruby-pendant.jpg", alt: "Ruby Heart Pendant" }
    ],
    tags: ["ruby", "heart", "pendant"]
  },
  {
    name: "Diamond Tennis Bracelet",
    description: "Luxurious tennis bracelet featuring multiple diamonds in platinum setting.",
    price: 85000,
    compareAtPrice: 95000,
    category: "bracelets",
    material: "platinum",
    purity: "not-applicable",
    gemstones: [
      {
        name: "Diamond",
        type: "diamond",
        carats: 3.0
      }
    ],
    stock: 2,
    featured: true,
    occasion: ["wedding", "party", "formal"],
    gender: "women",
    images: [
      { url: "/uploads/products/tennis-bracelet.jpg", alt: "Diamond Tennis Bracelet" }
    ],
    tags: ["diamond", "bracelet", "luxury"]
  },
  {
    name: "Gold Hoop Earrings",
    description: "Classic gold hoop earrings. A timeless addition to any jewelry collection.",
    price: 12500,
    category: "earrings",
    material: "gold",
    purity: "18k",
    stock: 20,
    featured: false,
    occasion: ["everyday", "casual", "party"],
    gender: "women",
    images: [
      { url: "/uploads/products/hoop-earrings.jpg", alt: "Gold Hoop Earrings" }
    ],
    tags: ["gold", "hoops", "classic"],
    weight: {
      value: 6,
      unit: "g"
    }
  },
  {
    name: "Emerald Ring Set",
    description: "Stunning emerald ring with matching band. Perfect bridal set in white gold.",
    price: 72000,
    category: "combosets",
    material: "white-gold",
    purity: "18k",
    gemstones: [
      {
        name: "Emerald",
        type: "emerald",
        carats: 2.0
      }
    ],
    stock: 4,
    featured: true,
    occasion: ["wedding", "engagement"],
    gender: "women",
    images: [
      { url: "/uploads/products/emerald-set.jpg", alt: "Emerald Ring Set" }
    ],
    tags: ["emerald", "bridal", "set"]
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Added ${products.length} sample products`);

    // Display products
    console.log('\n📦 Sample Products Added:\n');
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - Rs. ${product.price} (${product.category})`);
    });

    console.log('\n✨ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();