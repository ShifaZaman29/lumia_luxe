const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  price: {
    type: Number,
    required: true
  },
  customization: {
    message: String,
    flavor: String,
    size: String,
    color: String
  }
}, { _id: true });

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field to calculate total price
cartSchema.virtual('totalPrice').get(function() {
  if (!this.items || this.items.length === 0) return 0;
  return this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
});

// Virtual field to calculate total items
cartSchema.virtual('totalItems').get(function() {
  if (!this.items || this.items.length === 0) return 0;
  return this.items.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
});

// Ensure virtuals are included in JSON
cartSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.totalPrice = doc.totalPrice;
    ret.totalItems = doc.totalItems;
    return ret;
  }
});

module.exports = mongoose.model('Cart', cartSchema);