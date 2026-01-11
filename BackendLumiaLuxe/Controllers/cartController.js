const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper function to format cart response
const formatCartResponse = (cart) => {
  const cartObj = cart.toObject();
  return {
    ...cartObj,
    totalPrice: cart.totalPrice || 0,
    totalItems: cart.totalItems || 0
  };
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    console.log('📦 Getting cart for user:', req.user._id);
    
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name price images stock category slug'
    });

    if (!cart) {
      console.log('🆕 No cart found, creating new one');
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    console.log('✅ Cart found with', cart.items.length, 'items');

    res.status(200).json({
      success: true,
      data: formatCartResponse(cart)
    });
  } catch (error) {
    console.error('❌ Get cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, customization } = req.body;

    console.log('🛒 Adding to cart:', { 
      productId, 
      quantity, 
      userId: req.user._id 
    });

    // Validation
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Check if product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This product is no longer available'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Only ${product.stock} available`
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      console.log('🆕 Creating new cart for user');
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more. Only ${product.stock} available in stock`
        });
      }
      
      cart.items[existingItemIndex].quantity = newQuantity;
      console.log('✅ Updated existing item quantity to:', newQuantity);
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
        customization: customization || {}
      });
      console.log('✅ Added new item to cart');
    }

    // Save cart
    await cart.save();
    
    // Populate product details
    await cart.populate({
      path: 'items.product',
      select: 'name price images stock category slug'
    });

    console.log('✅ Cart saved. Total items:', cart.items.length);

    res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      data: formatCartResponse(cart)
    });
  } catch (error) {
    console.error('❌ Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;
    
    console.log('🔄 Updating cart item:', { itemId, quantity });

    if (quantity === undefined || quantity === null) {
      return res.status(400).json({
        success: false,
        message: 'Quantity is required'
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    if (quantity <= 0) {
      // Remove item
      cart.items = cart.items.filter(i => i._id.toString() !== itemId);
      console.log('🗑️ Removed item from cart');
    } else {
      // Check stock
      const product = await Product.findById(item.product);
      if (product && quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} available in stock`
        });
      }
      
      item.quantity = quantity;
      console.log('✅ Updated quantity to:', quantity);
    }

    await cart.save();
    await cart.populate({
      path: 'items.product',
      select: 'name price images stock category slug'
    });

    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      data: formatCartResponse(cart)
    });
  } catch (error) {
    console.error('❌ Update cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    console.log('🗑️ Removing item:', itemId);
    
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);

    if (cart.items.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    await cart.save();
    await cart.populate({
      path: 'items.product',
      select: 'name price images stock category slug'
    });

    console.log('✅ Item removed. Cart now has:', cart.items.length, 'items');

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: formatCartResponse(cart)
    });
  } catch (error) {
    console.error('❌ Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    console.log('🧹 Clearing cart for user:', req.user._id);
    
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: {
        ...cart.toObject(),
        totalPrice: 0,
        totalItems: 0
      }
    });
  } catch (error) {
    console.error('❌ Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};