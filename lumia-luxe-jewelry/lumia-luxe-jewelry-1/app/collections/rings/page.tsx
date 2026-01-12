"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

interface Product {
  _id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  images: Array<{ url: string; alt?: string }>
  category: string
  stock: number
  description: string
  material: string
  sizes?: string[]
}

export default function RingsCollectionPage() {
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({})

  // Sample ring data
  const rings: Product[] = [
    {
      _id: "ring1",
      name: "Celestia Ring",
      slug: "celestia-ring",
      price: 1299,
      compareAtPrice: 1699,
      images: [{
        url: "/Celestia-ring.jpg",
        alt: "Celestia Ring"
      }],
      category: "rings",
      stock: 12,
      description: "A celestial-inspired ring with intricate star patterns. Features a central moonstone that shimmers in the light, perfect for dreamers and stargazers.",
      material: "925 Sterling Silver with Moonstone",
      sizes: ["16", "17", "18", "19", "20"]
    },
    {
      _id: "ring2",
      name: "Braided Bliss Ring",
      slug: "braided-bliss-ring",
      price: 899,
      compareAtPrice: 1199,
      images: [{
        url: "/Braided-bliss-ring.jpg",
        alt: "Braided Bliss Ring"
      }],
      category: "rings",
      stock: 18,
      description: "Elegantly braided design that symbolizes intertwined lives and eternal love. Crafted with precision for a comfortable fit.",
      material: "Rose Gold Plated Sterling Silver",
      sizes: ["15", "16", "17", "18", "19", "20", "21"]
    },
    {
      _id: "ring3",
      name: "Golden Weave Ring",
      slug: "golden-weave-ring",
      price: 1099,
      compareAtPrice: 1499,
      images: [{
        url: "/Golden-weave-ring.jpg",
        alt: "Golden Weave Ring"
      }],
      category: "rings",
      stock: 8,
      description: "Intricately woven golden design that catches the light beautifully. A statement piece that adds elegance to any outfit.",
      material: "Yellow Gold Plated Brass",
      sizes: ["17", "18", "19", "20"]
    },
    {
      _id: "ring4",
      name: "Circle Carrier Ring",
      slug: "circle-carrier-ring",
      price: 699,
      compareAtPrice: 999,
      images: [{
        url: "/Circle-Cartier-ring.jpg",
        alt: "Circle Carrier Ring"
      }],
      category: "rings",
      stock: 25,
      description: "Minimalist geometric design with floating circle element. Modern, sleek, and perfect for everyday wear or special occasions.",
      material: "Stainless Steel with Gold Plating",
      sizes: ["16", "17", "18", "19", "20"]
    },
    {
      _id: "ring5",
      name: "Bow Love Ring",
      slug: "bow-love-ring",
      price: 1199,
      compareAtPrice: 1499,
      images: [{
        url: "/bow-ring.jpg",
        alt: "Bow Love Ring"
      }],
      category: "rings",
      stock: 10,
      description: "Delicate bow-shaped ring symbolizing love and affection. A romantic piece perfect for gifting to your loved one.",
      material: "Rose Gold Plated Sterling Silver",
      sizes: ["16", "17", "18", "19", "20"]
    },
    {
      _id: "ring6",
      name: "Sun Smile Ring",
      slug: "sun-smile-ring",
      price: 999,
      compareAtPrice: 1299,
      images: [{
        url: "/sun-smile-ring.jpg",
        alt: "Sun Smile Ring"
      }],
      category: "rings",
      stock: 15,
      description: "Cheerful sun design with smiley face center. Brings positivity and joy to your everyday wear.",
      material: "Yellow Gold Plated Brass",
      sizes: ["17", "18", "19", "20", "21"]
    }
  ]

  const handleAddToCart = (e: React.MouseEvent, productId: string) => {
    e.preventDefault()
    e.stopPropagation()

    const product = rings.find(p => p._id === productId)
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

    // Simulate API call
    setTimeout(() => {
      setToastMessage("✅ Added to Cart!")
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      window.dispatchEvent(new Event("cartUpdated"))
      setAddingToCart(null)
    }, 500)
  }

  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }))
  }

  return (
    <div className="min-h-screen bg-[#F9F6F2] pt-32 pb-16 px-[5%]">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Hero Section with more space */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h1 className="font-serif text-5xl mb-4 text-[#2D2B28]">
              Rings Collection
            </h1>
            <p className="text-lg text-[#6F6B68] max-w-2xl mx-auto mb-4">
              Discover our exquisite collection of handcrafted rings, each piece telling a unique story of elegance and craftsmanship.
            </p>
            <div className="mt-4">
              <Link
                href="/"
                className="bg-gradient-to-br from-[#D5B895] to-[#C0A060] text-white px-6 py-2 rounded-full font-semibold hover:-translate-y-1 hover:shadow-xl transition-all duration-300 inline-block text-sm"
              >
                Back to Shop
              </Link>
            </div>
          </div>
        </div>

        {/* Product Grid with equal height boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rings.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(213,184,149,0.25)] group border border-[#D5B895] flex flex-col h-full" /* Added flex-col and h-full */
            >
              {/* Product Image - Fixed height */}
              <Link href={`/products/${product.slug}`} className="block flex-shrink-0"> 
                <div className="w-full h-64 bg-[#F9F6F2] flex items-center justify-center overflow-hidden relative">
                  {imageErrors[product._id] ? (
                    <div className="flex flex-col items-center justify-center h-full w-full">
                      <div className="text-5xl mb-3">💍</div>
                      <div className="text-lg font-semibold text-[#2D2B28] text-center px-4">{product.name}</div>
                    </div>
                  ) : (
                    <>
                      <Image
                        src={product.images[0].url}
                        alt={product.images[0].alt || product.name}
                        width={280}
                        height={280}
                        className="object-contain group-hover:scale-105 transition-transform duration-500 p-4"
                        onError={() => handleImageError(product._id)}
                      />
                      
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-10">
                          {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                        </div>
                      )}
                      
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                          <span className="bg-red-500 text-white px-3 py-1 rounded-lg font-semibold text-sm">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Link>

              {/* Product Content - Flex-grow to take remaining space */}
              <div className="p-5 flex flex-col flex-grow"> 
                <Link href={`/products/${product.slug}`}>
                  <h3 className="font-serif text-xl mb-3 text-[#2D2B28] group-hover:text-[#C0A060] transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <p className="text-sm text-[#6F6B68] mb-4 line-clamp-2 flex-grow"> 
                  {product.description}
                </p>

                <div className="mb-4">
                  <div className="text-sm text-[#6F6B68] mb-2">
                    <span className="font-semibold text-[#2D2B28]">Material:</span> {product.material}
                  </div>
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="text-sm text-[#6F6B68]">
                      <span className="font-semibold text-[#2D2B28]">Sizes:</span> {product.sizes.join(", ")}
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xl font-semibold text-[#C0A060]">
                    Rs. {product.price.toLocaleString()}
                  </span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="text-base text-gray-400 line-through">
                      Rs. {product.compareAtPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Stock Warning */}
                {product.stock > 0 && product.stock < 5 && (
                  <p className="text-xs text-orange-600 mb-3">
                    ⚠️ Only {product.stock} left in stock!
                  </p>
                )}

                {/* Add to Cart Button - At bottom */}
                <div className="flex gap-3 mt-auto"> 
                  <button
                    onClick={(e) => handleAddToCart(e, product._id)}
                    disabled={addingToCart === product._id || product.stock === 0}
                    className="flex-1 bg-gradient-to-br from-[#D5B895] to-[#C0A060] text-white px-4 py-2.5 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_12px_rgba(192,160,96,0.35)] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {addingToCart === product._id 
                      ? 'Adding...' 
                      : product.stock === 0 
                      ? 'Out of Stock' 
                      : 'Add to Cart'}
                  </button>
                  <Link
                    href={`/products/${product.slug}`}
                    className="flex-1 border border-[#D5B895] text-[#2D2B28] px-4 py-2.5 rounded-full font-semibold text-center hover:bg-[#F9F6F2] transition-all duration-300 text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Space after last ring box */}
        <div className="mt-20">
          {/* Collection Info */}
          <div className="bg-white rounded-2xl p-8 border border-[#D5B895]">
            <h2 className="font-serif text-3xl mb-6 text-[#2D2B28]">About Our Rings Collection</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-serif text-xl mb-4 text-[#C0A060]">Craftsmanship</h3>
                <p className="text-[#6F6B68]">
                  Each ring in our collection is meticulously handcrafted by skilled artisans. 
                  We combine traditional techniques with modern design to create pieces that 
                  are both timeless and contemporary.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-4 text-[#C0A060]">Materials</h3>
                <p className="text-[#6F6B68]">
                  We use only the finest materials including 18k gold, 925 sterling silver, 
                  and premium platinum. All our rings are hypoallergenic and tarnish-resistant.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-4 text-[#C0A060]">Sizing</h3>
                <p className="text-[#6F6B68]">
                  Available in a wide range of sizes (15-21). Need a custom size? 
                  Contact us for bespoke sizing options at no extra cost.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-4 text-[#C0A060]">Care Instructions</h3>
                <p className="text-[#6F6B68]">
                  To maintain the brilliance of your ring, gently clean with a soft cloth 
                  and mild soap. Store separately to prevent scratches. 
                  Avoid contact with harsh chemicals.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Collection Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#D5B895] text-center">
            <div className="text-3xl font-serif text-[#C0A060]">{rings.length}</div>
            <div className="text-[#6F6B68]">Unique Designs</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#D5B895] text-center">
            <div className="text-3xl font-serif text-[#C0A060]">6+</div>
            <div className="text-[#6F6B68]">Materials Used</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#D5B895] text-center">
            <div className="text-3xl font-serif text-[#C0A060]">7</div>
            <div className="text-[#6F6B68]">Size Options</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#D5B895] text-center">
            <div className="text-3xl font-serif text-[#C0A060]">200+</div>
            <div className="text-[#6F6B68]">Happy Customers</div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-32 right-8 bg-gradient-to-br from-[#D5B895] to-[#C0A060] text-white px-8 py-5 rounded-xl shadow-[0_10px_30px_rgba(213,184,149,0.4)] z-[1003] animate-[slideIn_0.3s_ease]">
          <strong>{toastMessage}</strong>
        </div>
      )}
    </div>
  )
}