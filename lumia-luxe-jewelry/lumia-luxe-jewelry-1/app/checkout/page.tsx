"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { cartAPI, ordersAPI } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

interface ShippingAddress {
  name: string
  phone: string
  street: string
  city: string
  state: string
  zipCode: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [cart, setCart] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
  })

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "online">("cash")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        alert("Please login to checkout")
        router.push("/login")
      } else {
        fetchCart()
        // Pre-fill user data if available - WITH PROPER TYPE CHECKING
        if (user.name) {
          setShippingAddress((prev) => ({ ...prev, name: user.name }))
        }
        // FIX: Check if phone exists before accessing it
        if (user.phone) {
          setShippingAddress((prev) => ({ ...prev, phone: user.phone || "" }))
        }
        // FIX: Check if address exists before accessing properties
        if (user.address) {
          setShippingAddress((prev) => ({
            ...prev,
            street: user.address?.street || "",
            city: user.address?.city || "",
            state: user.address?.state || "",
            zipCode: user.address?.zipCode || "",
          }))
        }
      }
    }
  }, [user, authLoading, router])

  const fetchCart = async () => {
    try {
      const response = await cartAPI.get()
      if (response.success) {
        setCart(response.data)
        if (response.data.items.length === 0) {
          alert("Your cart is empty")
          router.push("/cart")
        }
      }
    } catch (error: any) {
      console.error("Error fetching cart:", error)
      alert(error.message || "Failed to load cart")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!cart || cart.items.length === 0) {
      alert("Your cart is empty")
      return
    }

    setSubmitting(true)

    try {
      const orderData = {
        shippingAddress: {
          ...shippingAddress,
          country: "Pakistan",
        },
        paymentMethod,
        notes,
      }

      const response = await ordersAPI.create(orderData)

      if (response.success) {
        alert(`Order placed successfully! Order Number: ${response.data.orderNumber}`)
        router.push("/")
      }
    } catch (error: any) {
      console.error("Error creating order:", error)
      alert(error.message || "Failed to place order. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F9F6F2] pt-32 pb-16 px-[5%] flex items-center justify-center">
        <div className="text-xl text-[#6F6B68]">Loading checkout...</div>
      </div>
    )
  }

  const subtotal = cart?.totalPrice || 0
  const shippingFee = subtotal > 2000 ? 0 : 200
  const tax = subtotal * 0.05
  const total = subtotal + shippingFee + tax

  return (
    <div className="min-h-screen bg-[#F9F6F2] pt-32 pb-16 px-[5%]">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="font-serif text-5xl text-center mb-12 text-[#2D2B28]">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-[2fr_1fr] gap-8">
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-2xl p-8 border border-[#D5B895]">
              <h2 className="font-serif text-2xl mb-6 text-[#2D2B28]">Shipping Address</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-[#2D2B28] font-medium">Full Name *</label>
                  <input
                    type="text"
                    value={shippingAddress.name}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-[#D5B895] rounded-lg outline-none focus:border-[#C0A060]"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-[#2D2B28] font-medium">Phone Number *</label>
                  <input
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-[#D5B895] rounded-lg outline-none focus:border-[#C0A060]"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block mb-2 text-[#2D2B28] font-medium">Street Address *</label>
                <input
                  type="text"
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-[#D5B895] rounded-lg outline-none focus:border-[#C0A060]"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block mb-2 text-[#2D2B28] font-medium">City *</label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-[#D5B895] rounded-lg outline-none focus:border-[#C0A060]"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-[#2D2B28] font-medium">State/Province *</label>
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-[#D5B895] rounded-lg outline-none focus:border-[#C0A060]"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-[#2D2B28] font-medium">Zip Code *</label>
                  <input
                    type="text"
                    value={shippingAddress.zipCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-[#D5B895] rounded-lg outline-none focus:border-[#C0A060]"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-8 border border-[#D5B895]">
              <h2 className="font-serif text-2xl mb-6 text-[#2D2B28]">Payment Method</h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-5 h-5"
                  />
                  <span className="text-[#2D2B28]">Cash on Delivery</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-5 h-5"
                  />
                  <span className="text-[#2D2B28]">Credit/Debit Card</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-5 h-5"
                  />
                  <span className="text-[#2D2B28]">Online Payment</span>
                </label>
              </div>
            </div>

            {/* Order Notes */}
            <div className="bg-white rounded-2xl p-8 border border-[#D5B895]">
              <h2 className="font-serif text-2xl mb-6 text-[#2D2B28]">Order Notes (Optional)</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions for your order?"
                rows={4}
                className="w-full px-4 py-3 border border-[#D5B895] rounded-lg outline-none focus:border-[#C0A060]"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl p-8 border border-[#D5B895] h-fit sticky top-32">
            <h2 className="font-serif text-2xl mb-6 text-[#2D2B28]">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cart?.items.map((item: any) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-[#6F6B68]">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="text-[#2D2B28] font-semibold">Rs. {item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#D5B895] pt-4 space-y-3">
              <div className="flex justify-between text-[#6F6B68]">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#6F6B68]">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? "Free" : `Rs. ${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-[#6F6B68]">
                <span>Tax (5%)</span>
                <span>Rs. {tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-[#D5B895] pt-3 flex justify-between font-semibold text-xl text-[#2D2B28]">
                <span>Total</span>
                <span className="text-[#C0A060]">Rs. {total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-6 bg-gradient-to-br from-[#D5B895] to-[#C0A060] text-white px-4 py-4 border-none rounded-full text-base font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_6px_25px_rgba(192,160,96,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}