// lib/cart-helpers.ts
// Helper functions for cart operations

import { cartAPI } from './api';

/**
 * Add item to cart with proper error handling and logging
 */
export async function addToCart(
  productId: string,
  quantity: number = 1,
  customization?: any
): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  try {
    console.log('🛒 [Helper] Adding to cart:', { productId, quantity });

    // Validate inputs
    if (!productId || productId === 'undefined' || productId === 'null') {
      console.error('❌ Invalid product ID:', productId);
      return {
        success: false,
        message: 'Invalid product. Please refresh and try again.'
      };
    }

    // Check auth
    const token = localStorage.getItem('token');
    if (!token) {
      return {
        success: false,
        message: 'Please login to add items to cart'
      };
    }

    // Call API
    console.log('📡 Calling cartAPI.add...');
    const response = await cartAPI.add(productId, quantity, customization);

    console.log('✅ Cart API response:', response);

    // Dispatch event to update cart count in navbar
    window.dispatchEvent(new Event('cartUpdated'));

    return {
      success: true,
      message: 'Item added to cart successfully',
      data: response.data
    };
  } catch (error: any) {
    console.error('❌ [Helper] Add to cart error:', error);
    
    return {
      success: false,
      message: error.message || 'Failed to add item to cart'
    };
  }
}

/**
 * Get current cart count for navbar badge
 */
export async function getCartCount(): Promise<number> {
  try {
    const token = localStorage.getItem('token');
    if (!token) return 0;

    const response = await cartAPI.get();
    return response.data?.totalItems || 0;
  } catch (error) {
    console.error('Error getting cart count:', error);
    return 0;
  }
}