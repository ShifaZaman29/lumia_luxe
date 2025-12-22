"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { adminAPI } from "@/lib/api"
import Link from "next/link"

interface Product {
  _id: string
  name: string
  description: string
  price: number
  category: string
  images: string[]
  stock: number
  isActive: boolean
  createdAt: string
}

export default function AdminProducts() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        alert("Please login to access admin panel")
        router.push("/admin/login")
      } else if (user.role !== "admin") {
        alert("Access denied. Admin only!")
        router.push("/")
      } else {
        fetchProducts()
      }
    }
  }, [user, authLoading, router])

  const fetchProducts = async () => {
    try {
      const response = await adminAPI.getAllProducts()
      if (response.success) {
        setProducts(response.data)
      }
    } catch (error: any) {
      console.error("Error fetching products:", error)
      alert(error.message || "Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const response = await adminAPI.updateProduct(productId, {
        isActive: !currentStatus,
      })
      if (response.success) {
        alert("Product status updated!")
        fetchProducts()
      }
    } catch (error: any) {
      console.error("Error updating product:", error)
      alert(error.message || "Failed to update product")
    }
  }

  const deleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone!")) {
      return
    }

    try {
      const response = await adminAPI.deleteProduct(productId)
      if (response.success) {
        alert("Product deleted!")
        fetchProducts()
      }
    } catch (error: any) {
      console.error("Error deleting product:", error)
      alert(error.message || "Failed to delete product")
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F9F6F2] flex items-center justify-center">
        <div className="text-xl text-[#6F6B68]">Loading products...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9F6F2]">
      {/* Header */}
      <div className="bg-white border-b border-[#D5B895]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="font-serif text-3xl text-[#2D2B28]">Manage Products</h1>
            <p className="text-[#6F6B68]">View and manage product inventory</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all"
            >
              + Add Product
            </button>
            <Link
              href="/admin/dashboard"
              className="px-6 py-2 bg-[#D5B895] text-white rounded-full hover:bg-[#C0A060] transition-all no-underline"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-[#D5B895]">
            <div className="text-[#6F6B68] text-sm mb-2">Total Products</div>
            <div className="font-serif text-4xl text-[#2D2B28]">{products.length}</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#D5B895]">
            <div className="text-[#6F6B68] text-sm mb-2">Active Products</div>
            <div className="font-serif text-4xl text-green-600">
              {products.filter((p) => p.isActive).length}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#D5B895]">
            <div className="text-[#6F6B68] text-sm mb-2">Inactive Products</div>
            <div className="font-serif text-4xl text-red-600">
              {products.filter((p) => !p.isActive).length}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#D5B895]">
            <div className="text-[#6F6B68] text-sm mb-2">Low Stock</div>
            <div className="font-serif text-4xl text-[#C0A060]">
              {products.filter((p) => p.stock < 5).length}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl overflow-hidden border border-[#D5B895] hover:shadow-lg transition-all"
            >
              {/* Product Image */}
              <div className="relative h-64 bg-[#F9F6F2]">
                {product.images && product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    💎
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      product.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-serif text-xl text-[#2D2B28] mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-[#6F6B68] line-clamp-2">
                    {product.description}
                  </p>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-sm text-[#6F6B68]">Price</div>
                    <div className="font-serif text-2xl text-[#C0A060]">
                      Rs. {product.price.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-[#6F6B68]">Stock</div>
                    <div
                      className={`font-semibold text-xl ${
                        product.stock < 5 ? "text-red-600" : "text-[#2D2B28]"
                      }`}
                    >
                      {product.stock}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="px-3 py-1 bg-[#F9F6F2] text-[#6F6B68] rounded-full text-sm">
                    {product.category}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="flex-1 px-4 py-2 bg-[#D5B895] text-white rounded-lg hover:bg-[#C0A060] transition-all text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleProductStatus(product._id, product.isActive)}
                    className={`flex-1 px-4 py-2 rounded-lg transition-all text-sm ${
                      product.isActive
                        ? "bg-yellow-500 text-white hover:bg-yellow-600"
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    {product.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#D5B895]">
            <div className="text-6xl mb-4">💎</div>
            <div className="text-xl text-[#6F6B68] mb-4">No products found</div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-[#D5B895] text-white rounded-full hover:bg-[#C0A060] transition-all"
            >
              Add Your First Product
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal Placeholder */}
      {(showAddModal || editingProduct) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
            <h2 className="font-serif text-2xl text-[#2D2B28] mb-4">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-[#6F6B68] mb-6">
              Product form will be implemented here with all fields for adding/editing products.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingProduct(null)
                }}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
              <button className="px-6 py-2 bg-[#D5B895] text-white rounded-lg hover:bg-[#C0A060] transition-all">
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}