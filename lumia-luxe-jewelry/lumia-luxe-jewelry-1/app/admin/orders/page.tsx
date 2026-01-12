"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { adminAPI } from "@/lib/api"
import Link from "next/link"

interface Order {
  _id: string
  orderNumber: string
  user: {
    _id: string
    name: string
    email: string
  }
  items: Array<{
    product: {
      name: string
      price: number
    }
    quantity: number
  }>
  total: number
  status: string
  shippingAddress: {
    fullName: string
    phone: string
    address: string
    city: string
    postalCode: string
  }
  createdAt: string
}

export default function AdminOrders() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        alert("Please login to access admin panel")
        router.push("/admin/login")
      } else if (user.role !== "admin") {
        alert("Access denied. Admin only!")
        router.push("/")
      } else {
        fetchOrders()
      }
    }
  }, [user, authLoading, router])

  const fetchOrders = async () => {
    try {
      const response = await adminAPI.getAllOrders()
      if (response.success) {
        setOrders(response.data)
      }
    } catch (error: any) {
      console.error("Error fetching orders:", error)
      alert(error.message || "Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    if (updating) return

    if (!confirm(`Change order status to ${newStatus}?`)) {
      return
    }

    setUpdating(orderId)
    try {
      const response = await adminAPI.updateOrderStatus(orderId, newStatus)
      if (response.success) {
        alert("Order status updated!")
        fetchOrders()
      }
    } catch (error: any) {
      console.error("Error updating status:", error)
      alert(error.message || "Failed to update order status")
    } finally {
      setUpdating(null)
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true
    return order.status === filter
  })

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F9F6F2] flex items-center justify-center">
        <div className="text-xl text-[#6F6B68]">Loading orders...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9F6F2]">
      {/* Header */}
      <div className="bg-white border-b border-[#D5B895]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="font-serif text-3xl text-[#2D2B28]">Manage Orders</h1>
            <p className="text-[#6F6B68]">View and manage customer orders</p>
          </div>
          <Link
            href="/admin/dashboard"
            className="px-6 py-2 bg-[#D5B895] text-white rounded-full hover:bg-[#C0A060] transition-all no-underline"
          >
            ← Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6">
          {["all", "pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filter === status
                  ? "bg-[#D5B895] text-white"
                  : "bg-white text-[#6F6B68] border border-[#D5B895] hover:bg-[#F9F6F2]"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status === "all" && ` (${orders.length})`}
              {status !== "all" &&
                ` (${orders.filter((o) => o.status === status).length})`}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#D5B895]">
              <div className="text-4xl mb-4">📦</div>
              <div className="text-xl text-[#6F6B68]">No orders found</div>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl p-6 border border-[#D5B895]"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-serif text-xl text-[#2D2B28]">
                      {order.orderNumber}
                    </h3>
                    <p className="text-sm text-[#6F6B68]">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-serif text-2xl text-[#C0A060]">
                      Rs. {order.total.toLocaleString()}
                    </div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "processing"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "shipped"
                          ? "bg-purple-100 text-purple-800"
                          : order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-[#F9F6F2] rounded-lg">
                  <div>
                    <div className="text-sm text-[#6F6B68] mb-1">Customer</div>
                    <div className="font-medium text-[#2D2B28]">{order.user.name}</div>
                    <div className="text-sm text-[#6F6B68]">{order.user.email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#6F6B68] mb-1">Shipping Address</div>
                    <div className="font-medium text-[#2D2B28]">
                      {order.shippingAddress.fullName}
                    </div>
                    <div className="text-sm text-[#6F6B68]">
                      {order.shippingAddress.phone}
                    </div>
                    <div className="text-sm text-[#6F6B68]">
                      {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                      {order.shippingAddress.postalCode}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <div className="text-sm text-[#6F6B68] mb-2 font-medium">Order Items</div>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-2 bg-[#F9F6F2] rounded"
                      >
                        <div>
                          <span className="font-medium text-[#2D2B28]">
                            {item.product.name}
                          </span>
                          <span className="text-sm text-[#6F6B68] ml-2">
                            × {item.quantity}
                          </span>
                        </div>
                        <div className="text-[#C0A060] font-medium">
                          Rs. {(item.product.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Update Actions */}
                <div className="flex gap-2 flex-wrap">
                  {order.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateOrderStatus(order._id, "processing")}
                        disabled={updating === order._id}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm disabled:opacity-50"
                      >
                        Mark Processing
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order._id, "cancelled")}
                        disabled={updating === order._id}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm disabled:opacity-50"
                      >
                        Cancel Order
                      </button>
                    </>
                  )}
                  {order.status === "processing" && (
                    <button
                      onClick={() => updateOrderStatus(order._id, "shipped")}
                      disabled={updating === order._id}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all text-sm disabled:opacity-50"
                    >
                      Mark Shipped
                    </button>
                  )}
                  {order.status === "shipped" && (
                    <button
                      onClick={() => updateOrderStatus(order._id, "delivered")}
                      disabled={updating === order._id}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-sm disabled:opacity-50"
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}