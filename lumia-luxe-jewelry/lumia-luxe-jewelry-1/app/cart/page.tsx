"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { cartAPI } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

interface CartItem {
  _id: string
  product: {
    _id: string
    name: string
    price: number
    images: Array<{ url: string; alt: string }>
    stock: number
  }
  quantity: number
  price: number
}

interface Cart {
  _id: string
  items: CartItem[]
  totalPrice: number
  totalItems: number
}

export default function CartPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        alert("Please login to view your cart")
        router.push("/login")
      } else {
        fetchCart()
      }
    }
  }, [user, authLoading, router])

  const fetchCart = async () => {
    try {
      const response = await cartAPI.get()
      if (response.success) {
        setCart(response.data)
      }
    } catch (error: any) {
      console.error("Error fetching cart:", error)
      alert(error.message || "Failed to load cart")
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (updating) return

    setUpdating(true)
    try {
      if (newQuantity <= 0) {
        await removeItem(itemId)
      } else {
        const response = await cartAPI.update(itemId, newQuantity)
        if (response.success) {
          setCart(response.data)
          window.dispatchEvent(new Event("cartUpdated"))
        }
      }
    } catch (error: any) {
      console.error("Error updating cart:", error)
      alert(error.message || "Failed to update cart")
    } finally {
      setUpdating(false)
    }
  }

  const removeItem = async (itemId: string) => {
    if (updating) return

    setUpdating(true)
    try {
      const response = await cartAPI.remove(itemId)
      if (response.success) {
        setCart(response.data)
        window.dispatchEvent(new Event("cartUpdated"))
      }
    } catch (error: any) {
      console.error("Error removing item:", error)
      alert(error.message || "Failed to remove item")
    } finally {
      setUpdating(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F9F6F2] pt-32 pb-16 px-[5%] flex items-center justify-center">
        <div className="text-xl text-[#6F6B68]">Loading cart...</div>
      </div>
    )
  }

  const total = cart?.totalPrice || 0

  return (
    <div className="min-h-screen bg-[#F9F6F2] pt-32 pb-16 px-[5%]">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="font-serif text-5xl text-center mb-12 text-[#2D2B28]">Shopping Cart 🛒</h1>

        {!cart || cart.items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-[#6F6B68] mb-8">Your cart is empty</p>
            <Link
              href="/#shop"
              className="inline-block bg-gradient-to-br from-[#D5B895] to-[#C0A060] text-white px-12 py-4 border-none rounded-full text-base font-semibold cursor-pointer transition-all duration-300 no-underline shadow-[0_4px_15px_rgba(213,184,149,0.3)] hover:-translate-y-1 hover:shadow-[0_6px_25px_rgba(192,160,96,0.4)]"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-[2fr_1fr] gap-8">
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl p-6 flex gap-6 items-center border border-[#D5B895]"
                >
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.product.images?.[0]?.url || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-serif text-xl text-[#2D2B28] mb-2">{item.product.name}</h3>
                    <p className="text-[#C0A060] font-semibold text-lg">Rs. {item.price}</p>
                    {item.product.stock < 5 && item.product.stock > 0 && (
                      <p className="text-orange-600 text-sm mt-1">Only {item.product.stock} left in stock</p>
                    )}
                    {item.product.stock === 0 && (
                      <p className="text-red-600 text-sm mt-1">Out of stock</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      disabled={updating}
                      className="w-8 h-8 bg-[#F9F6F2] border border-[#D5B895] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#D5B895] hover:text-white transition-all disabled:opacity-50"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      disabled={updating || item.quantity >= item.product.stock}
                      className="w-8 h-8 bg-[#F9F6F2] border border-[#D5B895] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#D5B895] hover:text-white transition-all disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item._id)}
                    disabled={updating}
                    className="text-red-500 hover:text-red-700 text-xl disabled:opacity-50"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-8 border border-[#D5B895] h-fit sticky top-32">
              <h2 className="font-serif text-2xl mb-6 text-[#2D2B28]">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[#6F6B68]">
                  <span>Subtotal ({cart.totalItems} items)</span>
                  <span>Rs. {total}</span>
                </div>
                <div className="flex justify-between text-[#6F6B68]">
                  <span>Shipping</span>
                  <span>{total > 2000 ? "Free" : "Rs. 200"}</span>
                </div>
                <div className="flex justify-between text-[#6F6B68]">
                  <span>Tax (5%)</span>
                  <span>Rs. {(total * 0.05).toFixed(2)}</span>
                </div>
                <div className="border-t border-[#D5B895] pt-3 flex justify-between font-semibold text-xl text-[#2D2B28]">
                  <span>Total</span>
                  <span className="text-[#C0A060]">
                    Rs. {(total + (total > 2000 ? 0 : 200) + total * 0.05).toFixed(2)}
                  </span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="block w-full bg-gradient-to-br from-[#D5B895] to-[#C0A060] text-white px-4 py-4 border-none rounded-full text-base font-semibold cursor-pointer transition-all duration-300 text-center no-underline hover:-translate-y-1 hover:shadow-[0_6px_25px_rgba(192,160,96,0.4)]"
              >
                Proceed to Checkout
              </Link>
              <Link href="/#shop" className="block text-center mt-4 text-[#C0A060] no-underline hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}