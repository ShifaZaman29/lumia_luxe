const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send order confirmation email
exports.sendOrderConfirmation = async (email, order) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d4a574;">Thank you for your order!</h2>
        <p>Your order has been received and is being processed.</p>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order Details</h3>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Total Amount:</strong> Rs. ${order.total.toFixed(2)}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        </div>

        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Shipping Address</h3>
          <p>${order.shippingAddress.name}</p>
          <p>${order.shippingAddress.street}</p>
          <p>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}</p>
          <p>${order.shippingAddress.phone}</p>
        </div>

        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order Items</h3>
          ${order.items.map(item => `
            <div style="padding: 10px 0; border-bottom: 1px solid #ddd;">
              <p><strong>${item.name}</strong></p>
              <p>Quantity: ${item.quantity} × Rs. ${item.price.toFixed(2)}</p>
            </div>
          `).join('')}
        </div>

        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          We'll send you another email when your order ships.
        </p>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #d4a574;">
          <p style="color: #666; font-size: 12px;">
            This is an automated email. Please do not reply to this message.
          </p>
          <p style="color: #d4a574; font-weight: bold;">Honeyed Bakery</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};