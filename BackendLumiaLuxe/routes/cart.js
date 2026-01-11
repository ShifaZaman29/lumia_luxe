const express = require('express');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../Controllers/cartController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Debug route - TEMPORARY
router.get('/debug', protect, async (req, res) => {
  try {
    const Cart = require('../models/Cart');
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product')
      .lean();
    
    console.log('🔍 Debug - User ID:', req.user._id);
    console.log('🔍 Debug - Cart exists:', !!cart);
    console.log('🔍 Debug - Items count:', cart?.items?.length || 0);
    
    res.json({
      success: true,
      debug: {
        userId: req.user._id,
        userName: req.user.name,
        cartExists: !!cart,
        itemCount: cart?.items?.length || 0,
        items: cart?.items || [],
        totalPrice: cart?.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0,
        totalItems: cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
      },
      rawCart: cart
    });
  } catch (error) {
    console.error('❌ Debug error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    });
  }
});

// Apply protect middleware to all other routes
router.use(protect);

router.route('/')
  .get(getCart)
  .post(addToCart)
  .delete(clearCart);

router.route('/:itemId')
  .put(updateCartItem)
  .delete(removeFromCart);

module.exports = router;