"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { productsAPI, cartAPI } from "@/lib/api" 
import { useAuth } from "@/context/AuthContext"

interface Product {
  _id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  images: Array<{ url: string; alt?: string }>
  category: string
  stock: number
  featured?: boolean
  ratings?: {
    average: number
    count: number
  }
}

export default function HotProducts() {
  const router = useRouter()
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      console.log("🔄 Fetching hot products...")
      
      // Use Railway URL directly for now to test
      const RAILWAY_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lumialuxe-production-19d4.up.railway.app'
      
      // Fetch directly from Railway backend
      const response = await fetch(`${RAILWAY_URL}/api/products?featured=true&limit=8`, {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache'
      })
      
      console.log("📦 Response status:", response.status)
      const data = await response.json()
      console.log("📦 Products data:", data)
      
      if (response.ok && data.success) {
        setProducts(data.data || data.products || [])
      } else {
        console.error("Failed to fetch products:", data)
        // Use fallback mock data
        setProducts(getFallbackProducts())
      }
    } catch (error) {
      console.error("❌ Error fetching products:", error)
      // Use fallback mock data
      setProducts(getFallbackProducts())
    } finally {
      setLoading(false)
    }
  }

  // Fallback mock products in case API fails
  const getFallbackProducts = (): Product[] => [
    {
      _id: "1",
      name: "Gold Diamond Ring",
      slug: "gold-diamond-ring",
      price: 12999,
      compareAtPrice: 15999,
      images: [{ url: "/placeholder.svg", alt: "Gold Diamond Ring" }],
      category: "rings",
      stock: 10,
      featured: true,
      ratings: { average: 4.5, count: 24 }
    },
    {
      _id: "2",
      name: "Silver Pearl Necklace",
      slug: "silver-pearl-necklace",
      price: 8999,
      compareAtPrice: 11999,
      images: [{ url: "/placeholder.svg", alt: "Silver Pearl Necklace" }],
      category: "necklaces",
      stock: 8,
      featured: true,
      ratings: { average: 4.7, count: 32 }
    },
    {
      _id: "3",
      name: "Rose Gold Earrings",
      slug: "rose-gold-earrings",
      price: 4999,
      compareAtPrice: 6999,
      images: [{ url: "/placeholder.svg", alt: "Rose Gold Earrings" }],
      category: "earrings",
      stock: 15,
      featured: true,
      ratings: { average: 4.3, count: 18 }
    },
    {
      _id: "4",
      name: "Platinum Wedding Band",
      slug: "platinum-wedding-band",
      price: 18999,
      compareAtPrice: 22999,
      images: [{ url: "/placeholder.svg", alt: "Platinum Wedding Band" }],
      category: "rings",
      stock: 5,
      featured: true,
      ratings: { average: 4.8, count: 12 }
    },
    {
      _id: "5",
      name: "Diamond Tennis Bracelet",
      slug: "diamond-tennis-bracelet",
      price: 24999,
      images: [{ url: "/placeholder.svg", alt: "Diamond Tennis Bracelet" }],
      category: "bracelets",
      stock: 3,
      featured: true,
      ratings: { average: 4.9, count: 9 }
    }
  ]

  const handleAddToCart = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      setToastMessage("Please login to add items to cart")
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      router.push("/login")
      return
    }

    const product = products.find(p => p._id === productId)
    if (!product) {
      setToastMessage("Product not found")
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }

    if (product.stock <= 0) {
      setToastMessage("This product is out of stock")
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }

    setAddingToCart(productId)

    try {
      console.log("🛒 Attempting to add product:", productId)
      
      // Get token from localStorage safely
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      
      const RAILWAY_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lumialuxe-production-19d4.up.railway.app'
      
      const response = await fetch(`${RAILWAY_URL}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ productId, quantity: 1 })
      })
      
      const data = await response.json()
      console.log("🛒 Add to cart response:", data)
      
      if (response.ok) {
        setToastMessage("✅ Added to Cart!")
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
        
        // Dispatch cart updated event
        window.dispatchEvent(new Event("cartUpdated"))
      } else {
        setToastMessage(data.message || "Failed to add to cart")
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
      }
    } catch (error: any) {
      console.error("❌ Error adding to cart:", error)
      setToastMessage(error.message || "Failed to add item to cart")
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } finally {
      setAddingToCart(null)
    }
  }

  if (loading) {
    return (
      <section id="shop" className="py-24 px-[5%] bg-[#F9F6F2]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#C0A060] border-r-transparent"></div>
          <p className="mt-4 text-[#6F6B68]">Loading products...</p>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section id="shop" className="py-24 px-[5%] bg-[#F9F6F2]">
        <div className="text-center">
          <h2 className="font-serif text-5xl mb-4 text-[#2D2B28]">
            Hot Selling Items 🔥
          </h2>
          <p className="text-xl text-[#6F6B68] max-w-2xl mx-auto mb-8">
            Discover our most popular jewelry pieces at amazing prices
          </p>
          <p className="text-[#6F6B68]">No products available at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    <>
      <section id="shop" className="py-24 px-[5%] bg-[#F9F6F2]">
        <div className="text-center mb-16">
          <h2 className="font-serif text-5xl mb-4 text-[#2D2B28]">
            Hot Selling Items 🔥
          </h2>
          <p className="text-xl text-[#6F6B68] max-w-2xl mx-auto">
            Discover our most popular jewelry pieces at amazing prices
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-[1400px] mx-auto">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer border border-[#D5B895] hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(213,184,149,0.25)] group"
            >
              {/* Product Image */}
              <Link href={`/products/${product.slug || product._id}`} className="block">
                <div className="w-full h-60 bg-[#F9F6F2] flex items-center justify-center overflow-hidden relative">
                  <Image
                    src={product.images?.[0]?.url || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    unoptimized // Added for external images
                  />
                  
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                      {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                    </div>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                      <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
              </Link>

              {/* Product Content */}
              <div className="p-5">
                <Link href={`/products/${product.slug || product._id}`}>
                  <h3 className="font-serif text-[17px] mb-2.5 text-[#2D2B28] line-clamp-2 group-hover:text-[#C0A060] transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <p className="text-sm text-[#6F6B68] capitalize mb-2">
                  {product.category.replace('-', ' ')}
                </p>

                {/* Rating */}
                {product.ratings && product.ratings.count > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={i < Math.round(product.ratings!.average) ? "text-[#C0A060]" : "text-gray-300"}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-[#6F6B68]">
                      ({product.ratings.count})
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xl font-semibold text-[#C0A060]">
                    Rs. {product.price.toLocaleString()}
                  </span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      Rs. {product.compareAtPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Stock Warning */}
                {product.stock > 0 && product.stock < 5 && (
                  <p className="text-sm text-orange-600 mb-3">
                    Only {product.stock} left in stock!
                  </p>
                )}

                {/* Add to Cart Button */}
                <button
                  onClick={(e) => handleAddToCart(e, product._id)}
                  disabled={addingToCart === product._id || product.stock === 0}
                  className="w-full bg-gradient-to-br from-[#D5B895] to-[#C0A060] text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_5px_20px_rgba(192,160,96,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
                >
                  {addingToCart === product._id 
                    ? 'Adding...' 
                    : product.stock === 0 
                    ? 'Out of Stock' 
                    : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-block bg-gradient-to-br from-[#D5B895] to-[#C0A060] text-white px-12 py-4 rounded-full font-semibold text-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-32 right-8 bg-gradient-to-br from-[#D5B895] to-[#C0A060] text-white px-8 py-5 rounded-xl shadow-[0_10px_30px_rgba(213,184,149,0.4)] z-[1003] animate-[slideIn_0.3s_ease]">
          <strong>{toastMessage}</strong>
        </div>
      )}
    </>
  )
}