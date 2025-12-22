const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: 0
  },
  compareAtPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['rings', 'bracelets', 'earrings', 'handcuffs', 'pendants', 'chains', 'combosets']
  },
  images: [{
    url: String,
    alt: String
  }],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  material: {
    type: String,
    enum: ['gold', 'silver', 'platinum', 'rose-gold', 'white-gold', 'stainless-steel', 'brass', 'copper', 'mixed'],
    required: [true, 'Please specify the material']
  },
  purity: {
    type: String,
    enum: ['24k', '22k', '18k', '14k', '10k', '925-silver', 'not-applicable']
  },
  gemstones: [{
    name: String,
    type: {
      type: String,
      enum: ['diamond', 'ruby', 'emerald', 'sapphire', 'pearl', 'topaz', 'amethyst', 'other']
    },
    carats: Number
  }],
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['mm', 'cm', 'inch'],
      default: 'mm'
    }
  },
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ['g', 'mg', 'oz'],
      default: 'g'
    }
  },
  sizes: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  occasion: [{
    type: String,
    enum: ['wedding', 'engagement', 'anniversary', 'birthday', 'casual', 'formal', 'party', 'everyday']
  }],
  gender: {
    type: String,
    enum: ['men', 'women', 'unisex'],
    default: 'unisex'
  },
  customizable: {
    type: Boolean,
    default: false
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: String,
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Create slug from name before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }
  next();
});

// Update ratings when review is added
productSchema.methods.updateRatings = function() {
  if (this.reviews.length === 0) {
    this.ratings.average = 0;
    this.ratings.count = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.ratings.average = (sum / this.reviews.length).toFixed(1);
    this.ratings.count = this.reviews.length;
  }
};

module.exports = mongoose.model('Product', productSchema);