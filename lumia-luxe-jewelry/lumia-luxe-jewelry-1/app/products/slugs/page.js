"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { productsAPI, cartAPI } from "@/lib/api"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    if (params.slug) {
      fetchProduct()
    }
  }, [params.slug])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      console.log("🔄 Fetching product:", params.slug)
      
      // Try two ways to get product
      let response
      
      try {
        // First try by slug
        response = await productsAPI.getBySlug(params.slug)
      } catch (error) {
        console.log("⚠️ Couldn't fetch by slug, trying alternative...")
        // If that fails, get all products and find by slug
        const productsResponse = await productsAPI.getAll({ limit: 100 })
        const foundProduct = productsResponse.data?.find(p => p.slug === params.slug)
        if (foundProduct) {
          response = { success: true, data: foundProduct }
        } else {
          throw new Error("Product not found")
        }
      }
      
      if (response.success) {
        console.log("✅ Product found:", response.data)
        setProduct(response.data)
      } else {
        throw new Error("Failed to fetch product")
      }
    } catch (error) {
      console.error("❌ Error fetching product:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please login to add items to cart")
      router.push("/login")
      return
    }

    if (!product) return

    if (product.stock <= 0) {
      alert("This product is out of stock")
      return
    }

    setAddingToCart(true)
    try {
      console.log("🛒 Adding to cart:", product._id, quantity)
      
      const response = await cartAPI.add(product._id, quantity)
      
      if (response.success) {
        alert("✅ Added to cart successfully!")
        // Dispatch event to update cart count in navbar
        window.dispatchEvent(new Event("cartUpdated"))
      } else {
        alert(response.message || "Failed to add to cart")
      }
    } catch (error: any) {
      console.error("❌ Error adding to cart:", error)
      alert(error.message || "Failed to add to cart")
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F6F2] pt-32 pb-16 px-[5%] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#C0A060] border-r-transparent"></div>
          <p className="mt-4 text-[#6F6B68]">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F9F6F2] pt-32 pb-16 px-[5%]">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="font-serif text-4xl mb-6 text-[#2D2B28]">Product Not Found</h1>
          <p className="text-[#6F6B68] mb-8">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push("/")}
            className="bg-gradient-to-br from-[#D5B895] to-[#C0A060] text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-all"
          >
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9F6F2] pt-32 pb-16 px-[5%]">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-[#6F6B68]">
          <a href="/" className="hover:text-[#C0A060] transition-colors">Home</a>
          <span className="mx-2">/</span>
          <a href="/#shop" className="hover:text-[#C0A060] transition-colors">Shop</a>
          <span className="mx-2">/</span>
          <span className="text-[#C0A060] capitalize">{product.category}</span>
          <span className="mx-2">/</span>
          <span className="font-medium text-[#2D2B28]">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            {/* Main Image */}
            <div className="bg-white rounded-2xl p-8 border border-[#D5B895] mb-6">
              <div className="relative w-full h-96">
                <Image
                  src={product.images?.[selectedImageIndex]?.url || "/placeholder.svg"}
                  alt={product.images?.[selectedImageIndex]?.alt || product.name}
                  fill
                  className="object-contain rounded-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${
                      selectedImageIndex === index 
                        ? "border-[#C0A060]" 
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={image.alt || `${product.name} thumbnail ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <h1 className="font-serif text-4xl mb-4 text-[#2D2B28]">
              {product.name}
            </h1>
            
            {/* Rating */}
            {product.ratings && (
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={i < Math.round(product.ratings.average) ? "text-[#C0A060]" : "text-gray-300"}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-[#6F6B68]">
                  {product.ratings.average} ({product.ratings.count} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-semibold text-[#C0A060]">
                Rs. {product.price?.toLocaleString()}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    Rs. {product.compareAtPrice?.toLocaleString()}
                  </span>
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Save Rs. {(product.compareAtPrice - product.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 font-medium">
                    {product.stock > 10 ? "In Stock" : `Only ${product.stock} left in stock`}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-700 font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="font-serif text-xl mb-3 text-[#2D2B28]">Description</h3>
              <p className="text-[#6F6B68] leading-relaxed">{product.description}</p>
            </div>

            {/* Product Details */}
            <div className="mb-8">
              <h3 className="font-serif text-xl mb-3 text-[#2D2B28]">Product Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium capitalize">{product.category?.replace('-', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Material</p>
                  <p className="font-medium capitalize">{product.material?.replace('-', ' ')}</p>
                </div>
                {product.purity && (
                  <div>
                    <p className="text-sm text-gray-500">Purity</p>
                    <p className="font-medium">{product.purity}</p>
                  </div>
                )}
                {product.weight && (
                  <div>
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="font-medium">{product.weight.value} {product.weight.unit}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Add to Cart Section */}
            {product.stock > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="font-medium">Quantity:</span>
                  <div className="flex items-center border border-[#D5B895] rounded-full overflow-hidden">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      disabled={quantity <= 1}
                      className="px-4 py-2 hover:bg-[#F9F6F2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="px-4 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                      disabled={quantity >= product.stock}
                      className="px-4 py-2 hover:bg-[#F9F6F2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    Max: {product.stock} available
                  </span>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="w-full bg-gradient-to-br from-[#D5B895] to-[#C0A060] text-white px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {addingToCart ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></span>
                      Adding to Cart...
                    </span>
                  ) : (
                    "Add to Cart"
                  )}
                </button>

                <button
                  onClick={() => {
                    // Add wishlist functionality here
                    alert("Wishlist functionality coming soon!")
                  }}
                  className="w-full border-2 border-[#D5B895] text-[#2D2B28] px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#F9F6F2] transition-all"
                >
                  Add to Wishlist
                </button>
              </div>
            ) : (
              <div className="text-center p-8 border-2 border-red-200 rounded-2xl bg-red-50">
                <p className="text-red-700 font-semibold text-lg mb-4">This product is currently out of stock</p>
                <button
                  onClick={() => {
                    // Notify when back in stock functionality
                    alert("We'll notify you when this product is back in stock!")
                  }}
                  className="bg-gradient-to-br from-[#D5B895] to-[#C0A060] text-white px-8 py-3 rounded-full font-semibold"
                >
                  Notify When Available
                </button>
              </div>
            )}

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t border-[#D5B895]">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl mb-2">📦</div>
                  <p className="text-sm font-medium">Free Shipping</p>
                  <p className="text-xs text-gray-500">On orders over Rs. 2000</p>
                </div>
                <div>
                  <div className="text-2xl mb-2">🔒</div>
                  <p className="text-sm font-medium">Secure Payment</p>
                  <p className="text-xs text-gray-500">100% secure</p>
                </div>
                <div>
                  <div className="text-2xl mb-2">↩️</div>
                  <p className="text-sm font-medium">Easy Returns</p>
                  <p className="text-xs text-gray-500">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}