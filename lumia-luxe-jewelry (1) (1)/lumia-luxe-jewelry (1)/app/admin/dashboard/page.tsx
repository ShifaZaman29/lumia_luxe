"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { adminAPI } from "@/lib/api"
import Link from "next/link"

interface DashboardStats {
  totalOrders: number
  totalUsers: number
  totalProducts: number
  pendingOrders: number
  totalRevenue: number
  recentOrders: any[]
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        alert("Please login to access admin panel")
        router.push("/admin/login")
      } else if (user.role !== "admin") {
        alert("Access denied. Admin only!")
        router.push("/")
      } else {
        fetchStats()
      }
    }
  }, [user, authLoading, router])

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats()
      if (response.success) {
        setStats(response.data)
      }
    } catch (error: any) {
      console.error("Error fetching stats:", error)
      alert(error.message || "Failed to load dashboard")
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F9F6F2] flex items-center justify-center">
        <div className="text-xl text-[#6F6B68]">Loading dashboard...</div>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="min-h-screen bg-[#F9F6F2]">
      {/* Header */}
      <div className="bg-white border-b border-[#D5B895]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="font-serif text-3xl text-[#2D2B28]">Admin Dashboard</h1>
            <p className="text-[#6F6B68]">Welcome back, {user?.name}</p>
          </div>
          <Link
            href="/"
            className="px-6 py-2 bg-[#D5B895] text-white rounded-full hover:bg-[#C0A060] transition-all"
          >
            View Site
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-[#D5B895]">
            <div className="text-[#6F6B68] text-sm mb-2">Total Orders</div>
            <div className="font-serif text-4xl text-[#2D2B28]">{stats.totalOrders}</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#D5B895]">
            <div className="text-[#6F6B68] text-sm mb-2">Total Users</div>
            <div className="font-serif text-4xl text-[#2D2B28]">{stats.totalUsers}</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#D5B895]">
            <div className="text-[#6F6B68] text-sm mb-2">Total Products</div>
            <div className="font-serif text-4xl text-[#2D2B28]">{stats.totalProducts}</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#D5B895]">
            <div className="text-[#6F6B68] text-sm mb-2">Pending Orders</div>
            <div className="font-serif text-4xl text-[#C0A060]">{stats.pendingOrders}</div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-gradient-to-br from-[#D5B895] to-[#C0A060] rounded-2xl p-8 mb-8 text-white">
          <div className="text-white/80 text-sm mb-2">Total Revenue</div>
          <div className="font-serif text-5xl">Rs. {stats.totalRevenue.toLocaleString()}</div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/admin/orders"
            className="bg-white rounded-2xl p-6 border border-[#D5B895] hover:shadow-lg transition-all text-center no-underline"
          >
            <div className="text-4xl mb-3">📦</div>
            <div className="font-serif text-xl text-[#2D2B28]">Manage Orders</div>
            <div className="text-[#6F6B68] text-sm mt-2">{stats.pendingOrders} pending</div>
          </Link>

          <Link
            href="/admin/products"
            className="bg-white rounded-2xl p-6 border border-[#D5B895] hover:shadow-lg transition-all text-center no-underline"
          >
            <div className="text-4xl mb-3">💎</div>
            <div className="font-serif text-xl text-[#2D2B28]">Manage Products</div>
            <div className="text-[#6F6B68] text-sm mt-2">{stats.totalProducts} products</div>
          </Link>

          <Link
            href="/admin/users"
            className="bg-white rounded-2xl p-6 border border-[#D5B895] hover:shadow-lg transition-all text-center no-underline"
          >
            <div className="text-4xl mb-3">👥</div>
            <div className="font-serif text-xl text-[#2D2B28]">Manage Users</div>
            <div className="text-[#6F6B68] text-sm mt-2">{stats.totalUsers} users</div>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-8 border border-[#D5B895]">
          <h2 className="font-serif text-2xl text-[#2D2B28] mb-6">Recent Orders</h2>
          <div className="space-y-4">
            {stats.recentOrders.map((order) => (
              <div
                key={order._id}
                className="flex justify-between items-center p-4 bg-[#F9F6F2] rounded-lg"
              >
                <div>
                  <div className="font-semibold text-[#2D2B28]">{order.orderNumber}</div>
                  <div className="text-sm text-[#6F6B68]">{order.user?.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-[#C0A060]">Rs. {order.total}</div>
                  <div className="text-sm text-[#6F6B68]">{order.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}