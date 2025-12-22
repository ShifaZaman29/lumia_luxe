"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!heroRef.current) return

    // Create sparkles
    for (let i = 0; i < 50; i++) {
      const sparkle = document.createElement("div")
      sparkle.className = "absolute bg-[#D5B895] rounded-full animate-[twinkle_4s_ease-in-out_infinite]"
      const size = Math.random() * 4 + 2
      sparkle.style.width = size + "px"
      sparkle.style.height = size + "px"
      sparkle.style.left = Math.random() * 100 + "%"
      sparkle.style.top = Math.random() * 100 + "%"
      sparkle.style.animationDelay = Math.random() * 4 + "s"
      sparkle.style.animationDuration = Math.random() * 3 + 3 + "s"
      heroRef.current.appendChild(sparkle)
    }
  }, [])

  return (
    <section
      ref={heroRef}
      className="min-h-screen bg-gradient-to-br from-[#F9F6F2] via-white to-[#F9F6F2] flex items-center justify-center text-center text-[#2D2B28] relative overflow-hidden mt-24 px-5 py-20"
    >
      <div className="z-[2] max-w-[800px]">
        <h1 className="font-serif text-[68px] max-md:text-[42px] mb-5 tracking-[2px] font-semibold">
          Jewelry that tells a story
        </h1>
        <div className="font-cursive text-[42px] text-[#C0A060] mb-8">Wear your story, tell your truth ✨</div>
        <p className="text-lg mb-10 text-[#6F6B68] leading-relaxed">
          Founded by WN, Lumia Luxe is a celebration of handcrafted elegance
        </p>
        <Link
          href="#collections"
          className="inline-block bg-gradient-to-br from-[#D5B895] to-[#C0A060] text-white px-12 py-4 border-none rounded-full text-base font-semibold cursor-pointer transition-all duration-300 no-underline shadow-[0_4px_15px_rgba(213,184,149,0.3)] hover:-translate-y-1 hover:shadow-[0_6px_25px_rgba(192,160,96,0.4)]"
        >
          Shop Now
        </Link>
      </div>
    </section>
  )
}
