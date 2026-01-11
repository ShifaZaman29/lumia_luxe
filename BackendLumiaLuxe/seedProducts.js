require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
  {
    name: "Golden Heart Necklace",
    slug: "golden-heart-necklace",
    description: "Elegant golden heart necklace with intricate detailing.",
    price: 1500,
    compareAtPrice: 2000,
    category: "pendants",
    images: [
      {
        url: "/Golden-heart-necklace.jpg",
        alt: "Golden Heart Necklace"
      }
    ],
    material: "gold",
    purity: "18k",
    stock: 15,
    featured: true,
    dimensions: {
      length: 45,
      unit: "mm"
    },
    weight: {
      value: 8,
      unit: "g"
    },
    occasion: ["casual", "formal", "anniversary"],
    gender: "women",
    tags: ["heart", "gold", "necklace", "pendant"],
    ratings: {
      average: 4.8,
      count: 42
    }
  },
  {
    name: "Odette Cuff Bracelet",
    slug: "odette-cuff-bracelet",
    description: "Stylish cuff bracelet with unique geometric design.",
    price: 1200,
    compareAtPrice: 1600,
    category: "bracelets",
    images: [
      {
        url: "/Odette-cuff.jpg",
        alt: "Odette Cuff Bracelet"
      }
    ],
    material: "silver",
    purity: "925-silver",
    stock: 8,
    featured: true,
    dimensions: {
      length: 180,
      unit: "mm"
    },
    weight: {
      value: 15,
      unit: "g"
    },
    occasion: ["party", "formal", "casual"],
    gender: "unisex",
    tags: ["cuff", "bracelet", "silver", "geometric"],
    ratings: {
      average: 4.7,
      count: 28
    }
  },
  {
    name: "Aura Square Necklace",
    slug: "aura-square-necklace",
    description: "Modern square-shaped necklace with minimalist design.",
    price: 1800,
    compareAtPrice: 2200,
    category: "pendants",
    images: [
      {
        url: "/Aura-square-necklace.jpg",
        alt: "Aura Square Necklace"
      }
    ],
    material: "white-gold",
    purity: "18k",
    stock: 12,
    featured: true,
    dimensions: {
      length: 40,
      width: 40,
      unit: "mm"
    },
    weight: {
      value: 12,
      unit: "g"
    },
    occasion: ["formal", "party", "engagement"],
    gender: "women",
    tags: ["square", "modern", "minimalist", "necklace"],
    ratings: {
      average: 4.9,
      count: 56
    }
  },
  {
    name: "Eternal Blossom Pendant",
    slug: "eternal-blossom-pendant",
    description: "Beautiful flower-shaped pendant symbolizing eternal beauty.",
    price: 1400,
    compareAtPrice: 1800,
    category: "pendants",
    images: [
      {
        url: "/Eternal-blossom-pendant.jpg",
        alt: "Eternal Blossom Pendant"
      }
    ],
    material: "rose-gold",
    purity: "14k",
    stock: 20,
    featured: true,
    dimensions: {
      length: 35,
      unit: "mm"
    },
    weight: {
      value: 6,
      unit: "g"
    },
    occasion: ["wedding", "anniversary", "birthday"],
    gender: "women",
    tags: ["flower", "blossom", "pendant", "rose-gold"],
    ratings: {
      average: 4.8,
      count: 64
    }
  },
  {
    name: "Bow of Love Earrings",
    slug: "bow-of-love-earrings",
    description: "Cute bow-shaped earrings for everyday wear.",
    price: 1000,
    compareAtPrice: 1300,
    category: "earrings",
    images: [
      {
        url: "/Bow-of-love-earrings.jpg",
        alt: "Bow of Love Earrings"
      }
    ],
    material: "gold",
    purity: "10k",
    stock: 25,
    featured: true,
    dimensions: {
      length: 25,
      unit: "mm"
    },
    weight: {
      value: 4,
      unit: "g"
    },
    sizes: ["Small", "Medium"],
    occasion: ["casual", "party", "everyday"],
    gender: "women",
    tags: ["bow", "earrings", "cute", "gold"],
    ratings: {
      average: 4.6,
      count: 37
    }
  },
  // Ring Products
  {
    name: "Textured Treasure Ring",
    slug: "textured-treasure-ring",
    description: "Exquisitely textured ring with intricate patterns, a true treasure to behold.",
    price: 2200,
    compareAtPrice: 2800,
    category: "rings",
    images: [
      {
        url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
        alt: "Textured Treasure Ring"
      }
    ],
    material: "gold",
    purity: "18k",
    stock: 12,
    featured: true,
    dimensions: {
      diameter: 18,
      unit: "mm"
    },
    weight: {
      value: 5,
      unit: "g"
    },
    sizes: ["16", "17", "18", "19", "20"],
    occasion: ["formal", "party", "special-occasion"],
    gender: "unisex",
    tags: ["textured", "treasure", "ring", "gold", "intricate"],
    ratings: {
      average: 4.9,
      count: 38
    }
  },
  {
    name: "Circle Cartier Ring",
    slug: "circle-cartier-ring",
    description: "Elegant circle-inspired design with Cartier-inspired craftsmanship.",
    price: 3500,
    compareAtPrice: 4200,
    category: "rings",
    images: [
      {
        url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
        alt: "Circle Cartier Ring"
      }
    ],
    material: "platinum",
    purity: "950-platinum",
    stock: 8,
    featured: true,
    dimensions: {
      diameter: 19,
      unit: "mm"
    },
    weight: {
      value: 7,
      unit: "g"
    },
    sizes: ["17", "18", "19", "20", "21"],
    occasion: ["luxury", "formal", "wedding"],
    gender: "unisex",
    tags: ["cartier", "circle", "luxury", "platinum", "elegant"],
    ratings: {
      average: 4.8,
      count: 45
    }
  },
  {
    name: "Celestia Ring",
    slug: "celestia-ring",
    description: "Celestial-inspired ring with star and moon motifs, perfect for dreamers.",
    price: 1800,
    compareAtPrice: 2400,
    category: "rings",
    images: [
      {
        url: "https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&q=80",
        alt: "Celestia Ring"
      }
    ],
    material: "silver",
    purity: "925-silver",
    stock: 15,
    featured: true,
    dimensions: {
      diameter: 17,
      unit: "mm"
    },
    weight: {
      value: 4,
      unit: "g"
    },
    sizes: ["15", "16", "17", "18", "19"],
    occasion: ["casual", "party", "everyday"],
    gender: "women",
    tags: ["celestial", "stars", "moon", "silver", "dreamy"],
    ratings: {
      average: 4.7,
      count: 52
    }
  },
  {
    name: "Braided Bliss Ring",
    slug: "braided-bliss-ring",
    description: "Beautiful braided design that symbolizes unity and eternal love.",
    price: 1900,
    compareAtPrice: 2500,
    category: "rings",
    images: [
      {
        url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
        alt: "Braided Bliss Ring"
      }
    ],
    material: "rose-gold",
    purity: "14k",
    stock: 10,
    featured: true,
    dimensions: {
      diameter: 18,
      unit: "mm"
    },
    weight: {
      value: 6,
      unit: "g"
    },
    sizes: ["16", "17", "18", "19"],
    occasion: ["anniversary", "engagement", "special-occasion"],
    gender: "women",
    tags: ["braided", "bliss", "unity", "rose-gold", "love"],
    ratings: {
      average: 4.9,
      count: 41
    }
  },
  {
    name: "Golden Weave Ring",
    slug: "golden-weave-ring",
    description: "Intricate woven gold design that catches light with every movement.",
    price: 2100,
    compareAtPrice: 2700,
    category: "rings",
    images: [
      {
        url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
        alt: "Golden Weave Ring"
      }
    ],
    material: "yellow-gold",
    purity: "18k",
    stock: 14,
    featured: true,
    dimensions: {
      diameter: 19,
      unit: "mm"
    },
    weight: {
      value: 5.5,
      unit: "g"
    },
    sizes: ["17", "18", "19", "20"],
    occasion: ["formal", "party", "luxury"],
    gender: "unisex",
    tags: ["woven", "gold", "intricate", "yellow-gold", "luxury"],
    ratings: {
      average: 4.8,
      count: 36
    }
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lumia-luxe");
    console.log("SUCCESS: Connected to MongoDB");

    // Clear existing products
    await Product.deleteMany({});
    console.log("INFO: Cleared existing products");

    // Insert all products
    console.log("Inserting products...");
    for (const productData of products) {
      const product = new Product(productData);
      await product.save();
      console.log(`  - Created: ${product.name}`);
    }

    // Get count of products
    const productCount = await Product.countDocuments();
    console.log(`\nSUCCESS: ${productCount} products seeded successfully`);

    // Show categories breakdown
    const categories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          products: { $push: "$name" }
        }
      }
    ]);

    console.log("\n📊 CATEGORY BREAKDOWN:");
    categories.forEach(cat => {
      console.log(`\n${cat._id.toUpperCase()} (${cat.count} products):`);
      cat.products.forEach(productName => {
        console.log(`  • ${productName}`);
      });
    });

    console.log("\n✅ Database seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("ERROR seeding database:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();