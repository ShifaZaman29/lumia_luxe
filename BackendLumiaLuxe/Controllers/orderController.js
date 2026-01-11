const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { sendOrderConfirmation } = require('../utils/emailService');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    console.log('📦 Creating order for user:', req.user._id);
    
    const { shippingAddress, paymentMethod, notes } = req.body;

    // Validate required fields
    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address and payment method are required'
      });
    }

    // Validate shipping address fields
    const requiredFields = ['name', 'phone', 'street', 'city', 'state', 'zipCode'];
    for (const field of requiredFields) {
      if (!shippingAddress[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required in shipping address`
        });
      }
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty. Please add items before checkout.'
      });
    }

    console.log('✅ Cart found with', cart.items.length, 'items');

    // Check stock availability for all items
    for (const item of cart.items) {
      if (!item.product) {
        return res.status(400).json({
          success: false,
          message: 'One or more products in your cart no longer exist'
        });
      }
      
      if (!item.product.isActive) {
        return res.status(400).json({
          success: false,
          message: `${item.product.name} is no longer available`
        });
      }
      
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.product.name}. Available: ${item.product.stock}, Requested: ${item.quantity}`
        });
      }
    }

    // Create order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.price,
      image: item.product.images?.[0]?.url || '',
      customization: item.customization || {}
    }));

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = subtotal > 2000 ? 0 : 200; // Free shipping over Rs. 2000
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + shippingFee + tax;

    console.log('💰 Order totals:', { subtotal, shippingFee, tax, total });

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress: {
        ...shippingAddress,
        country: shippingAddress.country || 'Pakistan'
      },
      paymentMethod,
      subtotal,
      shippingFee,
      tax,
      total,
      notes: notes || '',
      status: 'pending',
      paymentStatus: 'pending'
    });

    console.log('✅ Order created:', order.orderNumber);

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
      console.log(`📦 Updated stock for ${item.product.name}: -${item.quantity}`);
    }

    // Clear cart
    cart.items = [];
    await cart.save();
    console.log('🧹 Cart cleared');

    // Send order confirmation email (don't fail if email fails)
    try {
      if (sendOrderConfirmation) {
        await sendOrderConfirmation(req.user.email, order);
        console.log('📧 Order confirmation email sent');
      }
    } catch (emailError) {
      console.error('⚠️ Email sending failed (continuing anyway):', emailError.message);
    }

    // Populate and return order
    const populatedOrder = await Order.findById(order._id)
      .populate('items.product', 'name images price')
      .populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: populatedOrder
    });

  } catch (error) {
    console.error('❌ Order creation error:', error);
    
    // Handle duplicate order number
    if (error.code === 11000 && error.keyPattern?.orderNumber) {
      return res.status(500).json({
        success: false,
        message: 'Order creation failed. Please try again.'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create order. Please try again.'
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images price')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('❌ Error getting orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name images price category');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('❌ Error getting order:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    
    if (!reason || reason.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Cancellation reason is required'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled
    if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.status}`
      });
    }

    // Update order
    order.status = 'cancelled';
    order.cancelReason = reason.trim();
    order.statusHistory.push({
      status: 'cancelled',
      note: reason.trim(),
      updatedAt: new Date()
    });

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
      console.log(`📦 Restored stock for product ${item.product}: +${item.quantity}`);
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('items.product', 'name')
      .populate('user', 'name');

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: updatedOrder
    });
  } catch (error) {
    console.error('❌ Error cancelling order:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order'
    });
  }
};