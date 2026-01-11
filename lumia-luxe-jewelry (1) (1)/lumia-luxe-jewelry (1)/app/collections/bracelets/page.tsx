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

export default function BraceletsCollectionPage() {
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({})

  // Bracelet data with your images
  const bracelets: Product[] = [
    {
      _id: "bracelet1",
      name: "Floral Elegance Bracelet",
      slug: "floral-elegance-bracelet",
      price: 1299,
      compareAtPrice: 1699,
      images: [{
        url: "/flower-bracelet.webp",
        alt: "Floral Elegance Bracelet"
      }],
      category: "bracelets",
      stock: 15,
      description: "Delicate floral design bracelet with intricate detailing. Features genuine freshwater pearls and rose gold accents for a feminine touch.",
      material: "Sterling Silver with Freshwater Pearls",
      sizes: ["Small", "Medium", "Large"]
    },
    {
      _id: "bracelet2",
      name: "Cannci Chain Bracelet",
      slug: "cannci-chain-bracelet",
      price: 899,
      compareAtPrice: 1199,
      images: [{
        url: "/Cannci-bracelet.jpg",
        alt: "Cannci Chain Bracelet"
      }],
      category: "bracelets",
      stock: 22,
      description: "Modern chain link design with a sleek finish. Adjustable clasp allows for perfect fit on any wrist size.",
      material: "Gold Plated Stainless Steel",
      sizes: ["Adjustable"]
    },
    {
      _id: "bracelet3",
      name: "Cartier Inspired Bracelet",
      slug: "cartier-inspired-bracelet",
      price: 1999,
      compareAtPrice: 2499,
      images: [{
        url: "/Cartier-bracelet.jpg",
        alt: "Cartier Inspired Bracelet"
      }],
      category: "bracelets",
      stock: 8,
      description: "Luxurious bracelet inspired by classic designs. Features a secure locking mechanism and elegant craftsmanship.",
      material: "Stainless Steel with Gold Accents",
      sizes: ["Small", "Medium"]
    },
    {
      _id: "bracelet4",
      name: "Golden Twisted Bracelet",
      slug: "golden-twisted-bracelet",
      price: 1499,
      compareAtPrice: 1899,
      images: [{
        url: "/Gold-twisted-waterproof.jpg",
        alt: "Golden Twisted Bracelet"
      }],
      category: "bracelets",
      stock: 12,
      description: "Beautiful twisted rope design with waterproof coating. Perfect for everyday wear and special occasions.",
      material: "Waterproof Gold Plated Brass",
      sizes: ["Medium", "Large"]
    },
    {
      _id: "bracelet5",
      name: "GS Triangle Bracelet",
      slug: "gs-triangle-bracelet",
      price: 1599,
      compareAtPrice: 1999,
      images: [{
        url: "/placeholder-bracelet.jpg",
        alt: "GS Triangle Bracelet"
      }],
      category: "bracelets",
      stock: 18,
      description: "Geometric triangle design with modern appeal. Features the iconic GS logo and comfortable fit.",
      material: "Stainless Steel with Diamond Cut Edges",
      sizes: ["Small", "Medium", "Large"]
    }
  ]

  const handleAddToCart = (e: React.MouseEvent, productId: string) => {
    e.preventDefault()
    e.stopPropagation()

    const product = bracelets.find(p => p._id === productId)
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
        
        {/* Hero Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h1 className="font-serif text-5xl mb-4 text-[#2D2B28]">
              Bracelets Collection ✨
            </h1>
            <p className="text-lg text-[#6F6B68] max-w-2xl mx-auto mb-4">
              Discover our exquisite collection of handcrafted bracelets, each piece designed to adorn your wrist with elegance and style.
              From delicate chains to statement pieces, find the perfect bracelet for every occasion.
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

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bracelets.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(213,184,149,0.25)] group border border-[#D5B895] flex flex-col h-full"
            >
              {/* Product Image */}
              <Link href={`/products/${product.slug}`} className="block flex-shrink-0">
                <div className="w-full h-64 bg-[#F9F6F2] flex items-center justify-center overflow-hidden relative">
                  {imageErrors[product._id] ? (
                    <div className="flex flex-col items-center justify-center h-full w-full">
                      <div className="text-5xl mb-3">✨</div>
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

              {/* Product Content */}
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

                {/* Add to Cart Button */}
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

        {/* Space after last product box */}
        <div className="mt-20">
          {/* Collection Info */}
          <div className="bg-white rounded-2xl p-8 border border-[#D5B895]">
            <h2 className="font-serif text-3xl mb-6 text-[#2D2B28]">About Our Bracelets Collection</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-serif text-xl mb-4 text-[#C0A060]">Craftsmanship</h3>
                <p className="text-[#6F6B68]">
                  Each bracelet in our collection is meticulously handcrafted by skilled artisans. 
                  We combine traditional techniques with modern design to create pieces that 
                  are both timeless and contemporary.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-4 text-[#C0A060]">Materials</h3>
                <p className="text-[#6F6B68]">
                  We use only the finest materials including sterling silver, gold plating, 
                  stainless steel, and genuine gemstones. All our bracelets are hypoallergenic 
                  and designed for everyday comfort.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-4 text-[#C0A060]">Sizing & Fit</h3>
                <p className="text-[#6F6B68]">
                  Available in various sizes (Small, Medium, Large) with adjustable options. 
                  Our bracelets are designed to fit comfortably and securely on all wrist sizes.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-xl mb-4 text-[#C0A060]">Care Instructions</h3>
                <p className="text-[#6F6B68]">
                  To maintain the beauty of your bracelet, avoid contact with water, perfumes, 
                  and harsh chemicals. Store separately in a soft pouch to prevent scratches 
                  and tangling.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Collection Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#D5B895] text-center">
            <div className="text-3xl font-serif text-[#C0A060]">{bracelets.length}</div>
            <div className="text-[#6F6B68]">Unique Designs</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#D5B895] text-center">
            <div className="text-3xl font-serif text-[#C0A060]">5+</div>
            <div className="text-[#6F6B68]">Materials Used</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#D5B895] text-center">
            <div className="text-3xl font-serif text-[#C0A060]">3</div>
            <div className="text-[#6F6B68]">Size Options</div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#D5B895] text-center">
            <div className="text-3xl font-serif text-[#C0A060]">180+</div>
            <div className="text-[#6F6B68]">Happy Customers</div>
          </div>
        </div>

        {/* Stacking Tips Section */}
        <div className="mt-12 bg-white rounded-2xl p-8 border border-[#D5B895]">
          <h2 className="font-serif text-3xl mb-6 text-[#2D2B28]">Bracelet Stacking Tips</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-serif text-xl mb-4 text-[#C0A060]">Mix Textures</h3>
              <p className="text-[#6F6B68]">
                Combine different textures like chains, beads, and bangles for a dynamic look. 
                Pair our Golden Twisted Bracelet with the delicate Floral Elegance Bracelet.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl mb-4 text-[#C0A060]">Layer Wisely</h3>
              <p className="text-[#6F6B68]">
                Start with thinner bracelets closer to your hand and add thicker ones upward. 
                Limit to 3-5 bracelets per wrist for a balanced look.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-xl mb-4 text-[#C0A060]">Color Coordination</h3>
              <p className="text-[#6F6B68]">
                Mix metals or stick to one tone. Our collection offers both gold and silver tones 
                that can be mixed or matched according to your style.
              </p>
            </div>
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