"use client"

import Image from "next/image"
import { useState } from "react"

const hotProducts = [
  {
    id: 1,
    name: "Gemini Ring",
    price: 850,
    category: "rings",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
  },
  {
    id: 2,
    name: "Eternal Blossom Pendant",
    price: 600,
    category: "pendants",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400",
  },
  {
    id: 3,
    name: "Glimmering Halo Hoops",
    price: 950,
    category: "earrings",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400",
  },
  {
    id: 4,
    name: "Celestial Spark Bracelet",
    price: 800,
    category: "bracelets",
    image: "https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=400",
  },
  {
    id: 5,
    name: "Golden Stone Spike Hand Cuff",
    price: 750,
    category: "handcuffs",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400",
  },
]

export default function HotProducts() {
  const [showToast, setShowToast] = useState(false)

  const addToCart = (product: (typeof hotProducts)[0]) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingItem = cart.find((item: any) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    window.dispatchEvent(new Event("cartUpdated"))

    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  return (
    <>
      <section id="shop" className="py-24 px-[5%] bg-[#F9F6F2]">
        <h2 className="font-serif text-5xl text-center mb-16 text-[#2D2B28]">Hot Selling Items 🔥</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-8 max-w-[1400px] mx-auto">
          {hotProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer border border-[#D5B895] hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(213,184,149,0.25)]"
            >
              <div className="w-full h-60 bg-[#F9F6F2] flex items-center justify-center overflow-hidden relative">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              </div>
              <div className="p-5 text-center">
                <div className="font-serif text-[17px] mb-2.5 text-[#2D2B28]">{product.name}</div>
                <div className="text-[#C0A060] text-xl font-semibold mb-4">Rs. {product.price}</div>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-gradient-to-br from-[#D5B895] to-[#C0A060] text-white border-none px-7 py-2.5 rounded-full cursor-pointer font-medium transition-all duration-300 text-sm hover:scale-105 hover:shadow-[0_5px_20px_rgba(192,160,96,0.35)]"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {showToast && (
        <div className="fixed top-32 right-8 bg-gradient-to-br from-[#D5B895] to-[#C0A060] text-white px-8 py-5 rounded-xl shadow-[0_10px_30px_rgba(213,184,149,0.4)] z-[1003] animate-[slideIn_0.3s_ease]">
          <strong>Added to Cart! 💖</strong>
        </div>
      )}
    </>
  )
}
